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

    const metadata = result.metadata;

    const getScoreBadge = (score: string) => {
        const base = "badge-optikka px-3 py-1";
        switch (score) {
            case 'fraco': return `${base} bg-red-100 text-red-600 border border-red-200`;
            case 'medio': return `${base} bg-orange-100 text-orange-600 border border-orange-200`;
            case 'forte': return `${base} bg-green-100 text-green-600 border border-green-200`;
            default: return `${base} bg-gray-100 text-gray-600`;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container-optikka py-16 space-y-24">

                {/* 1. Technical Header Metadata */}
                <div className="flex flex-col md:flex-row justify-between items-center border-y border-technical py-4 space-y-4 md:space-y-0 no-print">
                    <div className="flex gap-12">
                        <div className="space-y-1">
                            <span className="label-meta opacity-50">Protocol_Level</span>
                            <span className="text-xs font-mono font-medium text-accent-coral">{metadata?.intensity || 'SURGICAL'}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="label-meta opacity-50">Session_ID</span>
                            <span className="text-xs font-mono font-medium">{metadata?.session_id}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="btn-optikka !h-10 !px-6 !text-[10px] btn-optikka-ghost"
                    >
                        Export_Report_PDF
                    </button>
                </div>

                {/* 2. Main Identity */}
                <header className="space-y-8 reveal">
                    <div className="space-y-2">
                        <span className="label-meta">Diagnosis_Subject_Identity</span>
                        <h1 className="text-soft-black">@{handle}</h1>
                    </div>
                    <p className="text-dim text-2xl max-w-2xl font-light leading-relaxed">
                        Análise de falhas estruturais de autoridade e inconsistências de percepção estratégica.
                    </p>

                    <div className="flex gap-16 pt-4 border-t border-technical w-max">
                        <div className="space-y-1">
                            <span className="label-meta">Core_Engine</span>
                            <span className="text-sm font-medium">LuzzIA_Neural_v2.1</span>
                        </div>
                        <div className="space-y-1">
                            <span className="label-meta">Assessment_Date</span>
                            <span className="text-sm font-medium">
                                {metadata?.timestamp ? new Date(metadata.timestamp).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    </div>
                </header>

                {/* 3. Diagnostic Grid (The "Meat") */}
                <div className="border border-technical bg-white reveal">
                    {result.blocks.map((block, index) => (
                        <div key={index} className="grid md:grid-cols-[1fr_360px] border-b border-technical last:border-b-0">

                            {/* Left Side: Psychology & Strategy */}
                            <div className="p-10 md:p-14 space-y-12">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-mono opacity-20">SECTION_{index + 1}</span>
                                        <span className="label-meta text-accent-coral">{block.title}</span>
                                    </div>
                                    <span className={getScoreBadge(block.score)}>{block.score}</span>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-3xl md:text-4xl">{block.acusacao}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-3">
                                        <span className="label-meta opacity-40">Root_Fear</span>
                                        <p className="text-base text-dim leading-relaxed font-light italic">"{block.medo}"</p>
                                    </div>
                                    <div className="space-y-3">
                                        <span className="label-meta text-red-500">Authority_Bleed</span>
                                        <p className="text-base text-soft-black leading-relaxed font-medium">{block.custo}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Forensic Proof */}
                            <div className="bg-neutral-sand/20 border-t md:border-t-0 md:border-l border-technical p-10 md:p-14 flex flex-col justify-between">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <span className="label-meta">Forensic_Proof</span>
                                        <p className="text-sm text-dim leading-relaxed font-light bg-white p-6 border border-technical italic">
                                            {block.prova}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <span className="label-meta">Neural_Detections</span>
                                        <div className="space-y-1">
                                            {['Pattern_Inconsistency: HIGH', 'Authority_Signal: DETECTED', 'Niche_Lapse: CRITICAL'].map((det, i) => (
                                                <p key={i} className="text-[10px] font-mono opacity-40">:: {det}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* 4. Sentence */}
                <div className="text-center space-y-16 py-12 reveal" style={{ animationDelay: '0.2s' }}>
                    <div className="space-y-6">
                        <span className="label-meta tracking-[0.3em] text-accent-coral">Strategic_Verdict</span>
                        <h2 className="text-5xl md:text-6xl max-w-4xl mx-auto italic font-medium leading-[1.1]">
                            "{result.verdict}"
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center no-print">
                        <button onClick={onNext} className="btn-optikka bg-soft-black text-white h-16 px-16 group">
                            PROCESSAR PROTOCOLO 7 DIAS
                            <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                        <button onClick={onReset} className="btn-optikka btn-optikka-ghost h-16 px-12 opacity-60 hover:opacity-100">
                            DESCARTAR
                        </button>
                    </div>
                </div>

                {/* 5. System Footer */}
                <footer className="pt-20 border-t border-technical flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
                    <span className="label-meta">LuzzIA Core Engine // Mission_Ready</span>
                    <div className="flex gap-12">
                        <div className="text-right">
                            <span className="label-meta">Encryption</span>
                            <span className="text-[10px] font-medium">RSA_4096_S</span>
                        </div>
                        <div className="text-right">
                            <span className="label-meta">Processing</span>
                            <span className="text-[10px] font-medium">0.42ms_Neural</span>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
};
