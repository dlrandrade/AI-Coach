import React from 'react';
import { AnalysisResult } from '../services/aiService';

interface SevenDayPlanScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
}

const formatLabels: Record<string, { label: string; color: string }> = {
    story: { label: 'STORY', color: 'bg-purple-600' },
    stories: { label: 'STORY', color: 'bg-purple-600' },
    reel: { label: 'REEL', color: 'bg-pink-600' },
    reels: { label: 'REEL', color: 'bg-pink-600' },
    carrossel: { label: 'CARROSSEL', color: 'bg-blue-600' },
    carousel: { label: 'CARROSSEL', color: 'bg-blue-600' },
    bio: { label: 'BIO', color: 'bg-green-600' },
    destaque: { label: 'DESTAQUE', color: 'bg-yellow-600' },
    feed: { label: 'FEED', color: 'bg-red-600' },
};

export const SevenDayPlanScreen: React.FC<SevenDayPlanScreenProps> = ({ handle, result, onReset }) => {
    const plan = result?.plan;

    const verdictColor = result?.verdict?.includes('POSICIONAMENTO') ? 'text-red-500' :
        result?.verdict?.includes('ALCANCE') ? 'text-yellow-500' :
            result?.verdict?.includes('VENDAS') ? 'text-green-500' : 'text-blue-500';

    if (!plan || plan.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-gray-400 font-mono mb-4">Plano não disponível</p>
                    <button onClick={onReset} className="brutal-btn">VOLTAR</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto pb-24">
            {/* Header */}
            <header className="mb-12 border-b-2 border-white pb-6">
                <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest">[ PLANO DE AÇÃO ]</h2>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mt-2">
                    PROTOCOLO 7 DIAS
                </h1>
                <p className="mt-3 font-mono text-sm text-gray-400">
                    Plano cirúrgico para <span className="text-white font-bold">@{handle}</span>
                </p>
                <p className={`mt-1 font-mono text-sm ${verdictColor}`}>
                    Foco: {result?.verdict || "RECONSTRUÇÃO"}
                </p>
                <p className="mt-4 text-xs font-mono text-gray-600 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Plano gerado por IA • Baseado nos padrões psicológicos identificados
                </p>
            </header>

            {/* Days */}
            <div className="space-y-6">
                {plan.map((item) => {
                    const formatKey = (item.format || '').toLowerCase();
                    const formatInfo = formatLabels[formatKey] || { label: formatKey.toUpperCase(), color: 'bg-gray-600' };

                    return (
                        <div key={item.day} className="border-2 border-gray-800 hover:border-white transition-all duration-300 group">
                            {/* Day Header */}
                            <div className="flex items-center gap-4 p-4 border-b border-gray-800 bg-gray-900/50">
                                <span className="text-3xl font-bold text-gray-700 group-hover:text-white transition-colors font-mono w-16">
                                    {item.day < 10 ? `0${item.day}` : item.day}
                                </span>
                                {item.format && (
                                    <span className={`${formatInfo.color} text-white text-xs font-mono px-3 py-1 uppercase`}>
                                        {formatInfo.label}
                                    </span>
                                )}
                            </div>

                            {/* Action */}
                            <div className="p-4 md:p-6">
                                <p className="font-mono text-sm md:text-base text-gray-200 leading-relaxed mb-4">
                                    {item.action || item.task}
                                </p>

                                {/* Why - Psychological reason */}
                                {item.why && (
                                    <div className="pt-4 border-t border-gray-800">
                                        <p className="text-xs font-mono text-gray-500 uppercase mb-2">
                                            → Por que isso quebra o padrão:
                                        </p>
                                        <p className="text-sm font-mono text-gray-400 italic">
                                            {item.why}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Warning */}
            <div className="mt-12 border border-red-900 bg-red-950/20 p-6">
                <p className="font-mono text-xs text-red-500 uppercase tracking-widest mb-2">
                    AVISO
                </p>
                <p className="font-mono text-sm text-red-400">
                    Este plano foi construído para atacar os padrões psicológicos específicos de @{handle}.
                    Cada dia quebra uma proteção inconsciente. O desconforto é intencional.
                    Se você pular etapas, volta para o início.
                </p>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center space-y-4">
                <button
                    onClick={onReset}
                    className="brutal-btn w-full md:w-auto bg-white text-black hover:bg-red-600 hover:text-white border-none"
                >
                    ENCERRAR SESSÃO
                </button>
            </div>
        </div>
    );
};
