import React from 'react';
import { AnalysisResult } from '../services/aiService';

interface DiagnosisScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
    onNext: () => void;
}

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ handle, result, onReset, onNext }) => {
    if (!result) return null;

    const getBlockClass = (score: string) => {
        switch (score) {
            case 'fraco': return 'status-fraco';
            case 'medio': return 'status-medio';
            case 'forte': return 'status-forte';
            default: return '';
        }
    };

    const getBadgeClass = (score: string) => {
        switch (score) {
            case 'fraco': return 'badge badge-fraco';
            case 'medio': return 'badge badge-medio';
            case 'forte': return 'badge badge-forte';
            default: return 'badge';
        }
    };

    return (
        <div className="min-h-screen py-12 md:py-16">
            <div className="container">
                {/* Header */}
                <header className="mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="pulse-dot"></div>
                        <span className="mono text-xs text-muted">Diagnóstico completo</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                        @{handle}
                    </h1>

                    <p className="text-secondary text-sm">
                        Análise de padrões psicológicos que afetam seu posicionamento
                    </p>
                </header>

                {/* Blocks */}
                <div className="space-y-4 stagger-children">
                    {result.blocks.map((block, index) => (
                        <div key={index} className={`analysis-block ${getBlockClass(block.score)}`}>
                            {/* Block Header */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <h3 className="text-base font-semibold">
                                    {block.title}
                                </h3>
                                <span className={getBadgeClass(block.score)}>
                                    {block.score}
                                </span>
                            </div>

                            {/* Acusação */}
                            {block.acusacao && (
                                <p className="text-sm text-primary leading-relaxed mb-4">
                                    {block.acusacao}
                                </p>
                            )}

                            {/* Details */}
                            <div className="grid gap-3 md:grid-cols-2">
                                {block.medo && (
                                    <div className="p-3 rounded-md bg-subtle">
                                        <p className="mono text-xs text-muted mb-1">O medo por trás</p>
                                        <p className="text-xs text-secondary">{block.medo}</p>
                                    </div>
                                )}

                                {block.custo && (
                                    <div className="p-3 rounded-md bg-subtle border-l-2 border-danger/30">
                                        <p className="mono text-xs text-danger mb-1">Custo real</p>
                                        <p className="text-xs text-secondary">{block.custo}</p>
                                    </div>
                                )}
                            </div>

                            {/* Prova */}
                            {block.prova && (
                                <div className="mt-3 pt-3 border-t border-light">
                                    <p className="mono text-xs text-muted mb-1">Prova observável</p>
                                    <p className="text-xs text-muted">{block.prova}</p>
                                </div>
                            )}

                            {/* Fallback */}
                            {!block.acusacao && block.content && (
                                <p className="text-sm text-secondary">{block.content}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Verdict */}
                <div className="mt-10 p-8 rounded-xl bg-card border border-light text-center animate-scale-in" style={{ animationDelay: '300ms' }}>
                    <p className="mono text-xs text-muted uppercase tracking-wider mb-3">
                        Conclusão
                    </p>
                    <h2 className="text-xl md:text-2xl font-semibold mb-8">
                        {result.verdict}
                    </h2>

                    <button onClick={onNext} className="btn btn-primary">
                        Ver plano de 7 dias →
                    </button>
                </div>

                {/* Secondary Action */}
                <div className="text-center mt-6">
                    <button onClick={onReset} className="btn btn-ghost">
                        Analisar outro perfil
                    </button>
                </div>
            </div>
        </div>
    );
};
