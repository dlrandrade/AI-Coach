import React from 'react';
import { AnalysisResult } from '../services/aiService';

interface SevenDayPlanScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
}

const formatLabels: Record<string, string> = {
    story: 'story',
    stories: 'story',
    reel: 'reel',
    reels: 'reel',
    carrossel: 'carrossel',
    carousel: 'carrossel',
    bio: 'bio',
    destaque: 'destaque',
    feed: 'feed',
};

export const SevenDayPlanScreen: React.FC<SevenDayPlanScreenProps> = ({ handle, result, onReset }) => {
    const plan = result?.plan;

    if (!plan || plan.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="mono text-muted mb-4">Plano não disponível</p>
                    <button onClick={onReset} className="brutal-btn">VOLTAR</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 md:py-16">
            <div className="container">
                {/* Header */}
                <header className="mb-12 pb-6 border-b-2 border-default">
                    <p className="mono text-xs text-danger uppercase tracking-widest mb-2">
                        [ PLANO DE AÇÃO ]
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">
                        PROTOCOLO 7 DIAS
                    </h1>
                    <p className="mono text-sm text-muted mt-3">
                        Plano cirúrgico para <span className="text-white font-bold">@{handle}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <div className="pulse-dot"></div>
                        <span className="mono text-xs text-muted">
                            Baseado nos padrões identificados
                        </span>
                    </div>
                </header>

                {/* Days */}
                <div className="space-y-4">
                    {plan.map((item, index) => {
                        const formatKey = (item.format || '').toLowerCase();
                        const formatClass = formatLabels[formatKey] || formatKey;

                        return (
                            <div
                                key={item.day}
                                className="brutal-card group hover:border-white transition-all"
                            >
                                {/* Day Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-3xl font-bold text-subtle group-hover:text-white transition-colors mono">
                                        {item.day < 10 ? `0${item.day}` : item.day}
                                    </span>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {item.format && (
                                                <span className={`badge badge-format ${formatClass}`}>
                                                    {formatClass.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <p className="mono text-sm md:text-base text-white/90 leading-relaxed mb-4">
                                    {item.action || item.task}
                                </p>

                                {/* Why */}
                                {item.why && (
                                    <div className="pt-4 border-t border-default">
                                        <p className="mono text-xs text-success/70 mb-1">
                                            → Por que isso quebra o padrão:
                                        </p>
                                        <p className="mono text-xs text-muted italic">
                                            {item.why}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Warning Box */}
                <div className="mt-12 p-6 border border-danger/30 bg-danger/5">
                    <p className="mono text-xs text-danger uppercase tracking-widest mb-2">
                        ⚠ Aviso Final
                    </p>
                    <p className="mono text-sm text-danger/80">
                        Este plano foi construído para atacar os padrões psicológicos específicos de @{handle}.
                        Cada dia quebra uma proteção inconsciente. O desconforto é intencional.
                    </p>
                </div>

                {/* Footer Action */}
                <div className="mt-12 text-center">
                    <button onClick={onReset} className="brutal-btn">
                        ENCERRAR SESSÃO
                    </button>
                </div>
            </div>
        </div>
    );
};
