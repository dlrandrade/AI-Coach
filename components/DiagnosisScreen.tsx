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

    const getScoreClass = (score: string) => {
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
        <div className="min-h-screen py-8 md:py-16">
            <div className="container">
                {/* Header */}
                <header className="mb-12 pb-6 border-b-2 border-default">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                        <div>
                            <p className="mono text-xs text-danger uppercase tracking-widest mb-2">
                                [ AUTÓPSIA COMPLETA ]
                            </p>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                @{handle}
                            </h1>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="pulse-dot"></div>
                                <span className="mono text-xs text-muted">Diagnóstico neural ativo</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="mono text-xs text-subtle">
                                {new Date().toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Blocks */}
                <div className="space-y-8">
                    {result.blocks.map((block, index) => (
                        <div key={index} className={`brutal-block ${getScoreClass(block.score)}`}>
                            {/* Block Header */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold uppercase tracking-wide">
                                    {block.title}
                                </h3>
                                <span className={getBadgeClass(block.score)}>
                                    {block.score}
                                </span>
                            </div>

                            {/* Acusação */}
                            {block.acusacao && (
                                <p className="text-base md:text-lg text-white leading-relaxed mb-4">
                                    {block.acusacao}
                                </p>
                            )}

                            {/* Details Grid */}
                            <div className="grid gap-4 md:grid-cols-2 mt-4">
                                {/* Medo */}
                                {block.medo && (
                                    <div className="p-3 bg-black/30 border-l-2 border-subtle">
                                        <p className="mono text-xs text-subtle uppercase mb-1">O medo por trás:</p>
                                        <p className="mono text-sm text-muted">{block.medo}</p>
                                    </div>
                                )}

                                {/* Custo */}
                                {block.custo && (
                                    <div className="p-3 bg-danger/5 border-l-2 border-danger">
                                        <p className="mono text-xs text-danger/70 uppercase mb-1">Custo real:</p>
                                        <p className="mono text-sm text-danger/90">{block.custo}</p>
                                    </div>
                                )}
                            </div>

                            {/* Prova */}
                            {block.prova && (
                                <div className="mt-4 pt-4 border-t border-default">
                                    <p className="mono text-xs text-subtle uppercase mb-1">Prova observável:</p>
                                    <p className="mono text-sm text-subtle">{block.prova}</p>
                                </div>
                            )}

                            {/* Fallback for old format */}
                            {!block.acusacao && block.content && (
                                <p className="mono text-sm text-muted">{block.content}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Verdict */}
                <div className="verdict-box mt-16">
                    <p className="mono text-xs text-subtle uppercase tracking-widest mb-4">
                        Sentença Final
                    </p>
                    <h2 className="text-xl md:text-3xl font-bold uppercase leading-tight mb-8">
                        "{result.verdict}"
                    </h2>

                    <button onClick={onNext} className="brutal-btn">
                        VER PLANO DE 7 DIAS →
                    </button>
                </div>

                {/* Secondary Action */}
                <div className="text-center mt-8">
                    <button onClick={onReset} className="brutal-btn-ghost">
                        [ ANALISAR OUTRO PERFIL ]
                    </button>
                </div>
            </div>
        </div>
    );
};
