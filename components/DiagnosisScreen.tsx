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

    const getScoreColor = (score: string) => {
        switch (score) {
            case 'fraco': return { border: 'border-red-600', text: 'text-red-500', bg: 'bg-red-500/10' };
            case 'medio': return { border: 'border-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10' };
            case 'forte': return { border: 'border-green-500', text: 'text-green-500', bg: 'bg-green-500/10' };
            default: return { border: 'border-gray-600', text: 'text-gray-500', bg: 'bg-gray-500/10' };
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-12 pb-24">
            {/* Header */}
            <header className="border-b-2 border-white pb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest">[ AUTÓPSIA COMPLETA ]</h2>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mt-2">
                            @{handle}
                        </h1>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-mono text-gray-600 flex items-center gap-2 justify-end">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Diagnóstico neural
                        </p>
                    </div>
                </div>
                <p className="text-sm font-mono text-gray-500 mt-4">
                    Análise de padrões psicológicos que travam dinheiro, relevância e crescimento.
                </p>
            </header>

            {/* The 5 Blocks - New Structure */}
            <div className="space-y-10">
                {result.blocks.map((block, index) => {
                    const colors = getScoreColor(block.score);
                    return (
                        <div key={index} className={`border-l-4 ${colors.border} pl-6 py-4`}>
                            {/* Block Title */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                                    {block.title}
                                </h3>
                                <span className={`${colors.text} ${colors.bg} text-xs font-mono px-3 py-1 uppercase`}>
                                    {block.score}
                                </span>
                            </div>

                            {/* Acusação Central */}
                            {block.acusacao && (
                                <div className="mb-4">
                                    <p className="text-base md:text-lg text-white font-medium leading-relaxed">
                                        {block.acusacao}
                                    </p>
                                </div>
                            )}

                            {/* Medo */}
                            {block.medo && (
                                <div className="mb-3 pl-4 border-l-2 border-gray-800">
                                    <p className="text-xs font-mono text-gray-500 uppercase mb-1">O medo por trás:</p>
                                    <p className="text-sm text-gray-400 italic">{block.medo}</p>
                                </div>
                            )}

                            {/* Custo */}
                            {block.custo && (
                                <div className="mb-3 pl-4 border-l-2 border-red-900">
                                    <p className="text-xs font-mono text-red-600 uppercase mb-1">Custo real:</p>
                                    <p className="text-sm text-red-400">{block.custo}</p>
                                </div>
                            )}

                            {/* Prova */}
                            {block.prova && (
                                <div className="pl-4 border-l-2 border-gray-800">
                                    <p className="text-xs font-mono text-gray-500 uppercase mb-1">Prova observável:</p>
                                    <p className="text-sm text-gray-500">{block.prova}</p>
                                </div>
                            )}

                            {/* Fallback for old format */}
                            {!block.acusacao && block.content && (
                                <p className="text-sm text-gray-300">{block.content}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* The Verdict */}
            <div className="mt-16 border-2 border-white p-6 md:p-12 text-center">
                <p className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">
                    SENTENÇA FINAL
                </p>
                <h2 className="text-xl md:text-3xl font-bold uppercase leading-tight text-white mb-8">
                    "{result.verdict}"
                </h2>

                <button
                    onClick={onNext}
                    className="brutal-btn w-full md:w-auto text-lg bg-white text-black hover:bg-red-600 hover:text-white border-none"
                >
                    VER PLANO DE 7 DIAS →
                </button>
            </div>

            <div className="text-center">
                <button
                    onClick={onReset}
                    className="text-xs font-mono underline text-gray-600 hover:text-white"
                >
                    [ ANALISAR OUTRO PERFIL ]
                </button>
            </div>
        </div>
    );
};
