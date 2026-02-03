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
        <div className="min-h-screen py-16">
            <div className="container space-y-20 fade-in">

                {/* Header */}
                <header className="space-y-4">
                    <p className="label text-accent">Diagnóstico</p>
                    <h1>@{handle}</h1>
                    <p className="text-dim text-xl">
                        {result.blocks.length} pontos de atenção identificados.
                    </p>
                </header>

                {/* Blocks */}
                <div className="space-y-8">
                    {result.blocks.map((block, i) => (
                        <div key={i} className="card space-y-8">
                            <div className="flex justify-between items-start">
                                <p className="label">{block.title}</p>
                                <span className="text-sm font-medium text-accent">#{i + 1}</span>
                            </div>

                            <h3 className="text-2xl leading-snug">{block.acusacao}</h3>

                            <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-[var(--border)]">
                                <div className="space-y-2">
                                    <p className="label opacity-60">Medo Raiz</p>
                                    <p className="text-dim">{block.medo}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="label opacity-60">Custo Real</p>
                                    <p className="font-medium">{block.custo}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-[var(--bg)] -mx-4 md:-mx-8">
                                <p className="text-sm text-dim italic">
                                    <span className="label not-italic mr-2">Evidência:</span>
                                    {block.prova}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Verdict */}
                <div className="text-center space-y-8 py-12">
                    <p className="label text-accent">Veredito</p>
                    <h2 className="text-3xl md:text-4xl max-w-2xl mx-auto leading-tight">
                        "{result.verdict}"
                    </h2>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-center no-print">
                    <button onClick={onNext} className="btn px-12">
                        Ver Plano de 7 Dias
                    </button>
                    <button onClick={onReset} className="btn btn-outline px-8">
                        Nova Análise
                    </button>
                </div>
            </div>
        </div>
    );
};
