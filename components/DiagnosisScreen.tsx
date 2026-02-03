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
        const base = "badge-optikka !rounded-none !border-none !px-3 !py-1";
        switch (score) {
            case 'fraco': return `${base} bg-red-500 text-white`;
            case 'medio': return `${base} bg-orange-400 text-white`;
            case 'forte': return `${base} bg-green-500 text-white`;
            default: return base;
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-white print:p-0">
            <div className="container-optikka py-10 md:py-20 space-y-16">

                {/* Meta Bar */}
                <div className="flex justify-between items-center border-b border-technical pb-4 no-print">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-accent-coral"></div>
                            <span className="label-meta">PROT_{metadata?.intensity || 'SURGICAL'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="label-meta opacity-30">ID:</span>
                            <span className="label-meta">{metadata?.session_id}</span>
                        </div>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="label-meta hover:text-accent-coral transition-colors flex items-center gap-2"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Export_Report_PDF
                    </button>
                </div>

                {/* Technical Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 reveal">
                    <div className="space-y-6 flex-1">
                        <div className="space-y-1">
                            <p className="label-meta text-accent-coral">Diagnosis_Subject_Identity</p>
                            <h1 className="text-6xl md:text-8xl tracking-tight leading-[0.9]">@{handle}</h1>
                        </div>
                        <p className="text-dim text-xl max-w-xl font-light leading-relaxed">
                            Autópsia estrutural revelando falhas de percepção, inconsistências táticas e pontos cegos de autoridade.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:block md:space-y-8 gap-8 border-l border-technical pl-8">
                        <div className="space-y-1">
                            <p className="label-meta text-dim">Core_Engine</p>
                            <p className="text-sm font-medium">LuzzIA_Neural_v2.0</p>
                        </div>
                        <div className="space-y-1">
                            <p className="label-meta text-dim">Timestamp</p>
                            <p className="text-sm font-medium">
                                {metadata?.timestamp ? new Date(metadata.timestamp).toLocaleString('pt-BR') : new Date().toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Analysis Grid */}
                <div className="border-t-2 border-soft-black reveal stagger">
                    {result.blocks.map((block, index) => (
                        <div key={index} className="analysis-cell !grid-cols-1 md:!grid-cols-[1fr_320px] !p-0">
                            {/* Main Diagnosis */}
                            <div className="p-10 md:p-14 space-y-10 group">
                                <div className="flex items-center gap-6">
                                    <span className="font-mono text-xs opacity-20 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
                                    <div className="h-px flex-1 bg-technical"></div>
                                    <span className={getScoreBadge(block.score)}>
                                        {block.score.toUpperCase()}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="label-meta text-accent-coral">{block.title}</h3>
                                    <h2 className="text-3xl md:text-4xl font-medium leading-tight text-soft-black">
                                        {block.acusacao}
                                    </h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 bg-neutral-sand/5 p-8 border border-technical">
                                    <div className="space-y-3">
                                        <p className="label-meta text-[10px] tracking-widest opacity-40">Root_Psychology_Fear</p>
                                        <p className="text-base text-dim leading-relaxed font-light">{block.medo}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="label-meta text-[10px] tracking-widest text-red-500">Authority_Bleed_Cost</p>
                                        <p className="text-base text-soft-black leading-relaxed font-medium">{block.custo}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Forensic Proof */}
                            <div className="p-10 md:p-14 bg-neutral-warm/10 md:border-l border-technical space-y-10">
                                <div className="space-y-4">
                                    <p className="label-meta">Forensic_Analysis_Notes</p>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-[11px] text-neutral-grey uppercase font-medium">Observable_Evidence:</p>
                                            <p className="text-sm text-dim leading-relaxed italic border-l-2 border-accent-coral pl-6 py-2">
                                                "{block.prova}"
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[11px] text-neutral-grey uppercase font-medium">AI_Detections:</p>
                                            <ul className="text-[10px] space-y-1 text-neutral-grey font-mono">
                                                <li>• Pattern_Inconsistency: HIGH</li>
                                                <li>• Authority_Signal: {block.score === 'fraco' ? 'FAILED' : 'DEGRADED'}</li>
                                                <li>• Engagement_Lapse: DETECTED</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sentence Section */}
                <div className="reveal space-y-16 py-24 text-center border-t border-technical" style={{ animationDelay: '0.4s' }}>
                    <div className="max-w-3xl mx-auto space-y-8">
                        <p className="label-meta text-accent-coral tracking-[0.2em]">Final_Strategic_Verdict</p>
                        <h2 className="text-4xl md:text-6xl font-medium leading-[1.05] text-soft-black">
                            "{result.verdict}"
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center no-print">
                        <button onClick={onNext} className="btn-optikka h-16 px-16 text-lg">
                            APLICAR PROTOCOLO 7 DIAS
                        </button>
                        <button onClick={onReset} className="btn-optikka btn-optikka-ghost h-16 px-12">
                            DESCARTAR E REINICIAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
