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
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-12 pb-24">
            {/* Header */}
            <header className="border-b-2 border-white pb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-xs font-mono text-gray-400">ALVO</h2>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                        @{handle}
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-xs font-mono text-red-500 animate-pulse">
                        [AUTÓPSIA COMPLETA]
                    </p>
                </div>
            </header>

            {/* The 5 Blocks */}
            <div className="space-y-8">
                {result.blocks.map((block, index) => (
                    <div key={index} className="group relative">
                        <div className="absolute -left-4 top-0 text-xs font-mono text-gray-600 opacity-50">
                            0{index + 1}
                        </div>

                        <div className={`border-l-4 pl-6 py-2 transition-all duration-300 ${block.score === 'fraco' ? 'border-red-600' :
                            block.score === 'medio' ? 'border-yellow-500' : 'border-blue-600'
                            }`}>
                            <h3 className="text-lg font-bold uppercase tracking-wide mb-2">
                                {block.title}
                            </h3>
                            <p className="font-mono text-sm md:text-base leading-relaxed text-gray-300">
                                {block.content}
                            </p>

                            <div className="mt-2 text-xs font-mono uppercase">
                                STATUS: <span className={`${block.score === 'fraco' ? 'text-red-500' :
                                    block.score === 'medio' ? 'text-yellow-500' : 'text-blue-500'
                                    } font-bold`}>{block.score}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* The Verdict */}
            <div className="mt-16 border-2 border-white p-6 md:p-12 text-center relative overflow-hidden">
                {/* Background diag stripes */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%0)' }} />

                <p className="relative z-10 text-sm font-mono text-gray-400 mb-4">
                    SENTENÇA FINAL
                </p>
                <h2 className="relative z-10 text-2xl md:text-4xl font-bold uppercase leading-tight text-white mb-8">
                    "{result.verdict}"
                </h2>

                <button
                    onClick={onNext}
                    className="relative z-10 brutal-btn w-full md:w-auto text-xl bg-white text-black hover:bg-red-600 hover:text-white border-none"
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
