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

    return (
        <div className="min-h-screen py-16 md:py-24">
            <div className="container max-w-4xl space-y-16">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-light reveal">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2">
                            <span className="font-mono text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded tracking-widest uppercase">
                                Report: Autopsy_Complete
                            </span>
                        </div>
                        <h1 className="text-5xl font-semibold tracking-tight">
                            @{handle}
                        </h1>
                        <p className="text-dim max-w-sm">
                            Identificação de vulnerabilidades estruturais no posicionamento estratégico.
                        </p>
                    </div>

                    <div className="flex gap-10">
                        <div className="text-right">
                            <p className="font-mono text-[9px] text-subtle">DATE</p>
                            <p className="text-xs font-medium">{new Date().toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-[9px] text-subtle">SENSITIVITY</p>
                            <p className="text-xs font-medium text-red-500">LEVEL_HIGH</p>
                        </div>
                    </div>
                </header>

                {/* Analysis Blocks */}
                <div className="space-y-6 stagger">
                    {result.blocks.map((block, index) => (
                        <div key={index} className="autopsy-card reveal">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xs font-mono text-subtle tracking-widest uppercase">
                                    Section_{index + 1}: {block.title}
                                </h3>
                                <span className={`status-badge status-${block.score}`}>
                                    {block.score.toUpperCase()}
                                </span>
                            </div>

                            <div className="space-y-8">
                                <p className="text-xl md:text-2xl text-accent font-medium leading-tight">
                                    {block.acusacao}
                                </p>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <p className="font-mono text-[10px] text-subtle">ROOT_FEAR</p>
                                        <p className="text-sm text-dim leading-relaxed">{block.medo}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-mono text-[10px] text-red-500">ESTIMATED_COST</p>
                                        <p className="text-sm text-dim leading-relaxed">{block.custo}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-ultra-light">
                                    <p className="font-mono text-[10px] text-subtle">OBSERVABLE_EVIDENCE</p>
                                    <p className="text-xs text-subtle italic mt-1">"{block.prova}"</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Verdict */}
                <div className="reveal space-y-8 py-12 text-center" style={{ animationDelay: '0.4s' }}>
                    <div className="inline-block p-12 bg-white border border-accent shadow-premium relative">
                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent"></div>

                        <p className="font-mono text-[10px] text-subtle tracking-widest uppercase mb-6">Final_Verdict</p>
                        <h2 className="text-2xl md:text-3xl font-semibold uppercase mb-10 leading-tight">
                            "{result.verdict}"
                        </h2>

                        <button onClick={onNext} className="btn-premium">
                            PROCESSAR PROTOCOLO DE 7 DIAS
                        </button>
                    </div>

                    <div>
                        <button onClick={onReset} className="font-mono text-[10px] text-subtle hover:text-accent transition-colors underline cursor-pointer">
                            [ DESTROY_SESSION_AND_RESTART ]
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
