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

    const getScoreBadge = (score: string) => {
        const base = "badge-optikka";
        switch (score) {
            case 'fraco': return `${base} badge-status-red`;
            case 'medio': return `${base} badge-status-gold`;
            case 'forte': return `${base} badge-status-green`;
            default: return base;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container-optikka py-20 space-y-24">

                {/* Technical Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-12 border-b-2 border-soft-black reveal">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="label-meta text-accent-coral">LuzzIA_Diagnostic_Report</span>
                            <span className="text-neutral-grey opacity-20">/</span>
                            <span className="label-meta tracking-tighter">ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl">@{handle}</h1>
                        <p className="text-dim text-lg max-w-md font-light">
                            Autópsia estrutural de posicionamento e falhas táticas detectadas.
                        </p>
                    </div>

                    <div className="flex gap-16">
                        <div className="space-y-2">
                            <p className="label-meta">Assessment_Date</p>
                            <p className="text-xl font-medium tracking-tight">{new Date().toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="label-meta">Protocol_Version</p>
                            <p className="text-xl font-medium tracking-tight">LUZZIA_4.0.2</p>
                        </div>
                    </div>
                </header>

                {/* Analysis Grid */}
                <div className="modular-section reveal stagger">
                    {/* Grid Header labels */}
                    <div className="hidden md:grid grid-cols-[1fr_350px] border-b border-technical">
                        <div className="p-4 label-meta">Diagnostic_Observation</div>
                        <div className="p-4 label-meta border-l border-technical">Technical_Forensics</div>
                    </div>

                    {result.blocks.map((block, index) => (
                        <div key={index} className="analysis-cell">
                            {/* Main Diagnosis */}
                            <div className="space-y-8">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-2xl font-medium leading-tight text-soft-black">
                                        {block.title}
                                    </h3>
                                    <span className={getScoreBadge(block.score)}>
                                        {block.score}
                                    </span>
                                </div>

                                <p className="text-xl text-dim leading-relaxed">
                                    {block.acusacao}
                                </p>

                                <div className="grid grid-cols-2 gap-12 pt-4">
                                    <div className="space-y-2">
                                        <p className="label-meta tracking-wider text-accent-coral">Root_Fear</p>
                                        <p className="text-sm text-dim leading-relaxed">{block.medo}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="label-meta tracking-wider text-accent-coral">Estimated_Cost</p>
                                        <p className="text-sm text-dim leading-relaxed font-medium">{block.custo}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Forensic Proof */}
                            <div className="p-8 bg-neutral-warm/30 border-t md:border-t-0 md:border-l border-technical space-y-6">
                                <p className="label-meta">Analysed_Data_Proof</p>
                                <div className="space-y-4">
                                    <p className="text-xs text-dim leading-relaxed italic border-l-2 border-heavy pl-4 py-1">
                                        "{block.prova}"
                                    </p>
                                    <div className="space-y-2">
                                        <p className="label-meta text-[9px] opacity-40">Forensic_Note</p>
                                        <p className="text-[10px] text-neutral-grey leading-tight">
                                            Evidência baseada em análise de padrões recorrentes detectados na Bio e nos últimos posts processados pela LuzzIA.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sentence Section */}
                <div className="reveal space-y-12 py-20 text-center" style={{ animationDelay: '0.4s' }}>
                    <div className="max-w-2xl mx-auto space-y-6">
                        <p className="label-meta text-accent-coral">Final_Verdict</p>
                        <h2 className="text-4xl md:text-5xl font-medium leading-[1.1] text-soft-black">
                            "{result.verdict}"
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <button onClick={onNext} className="btn-optikka bg-accent-coral">
                            APLICAR PROTOCOLO 7 DIAS
                        </button>
                        <button onClick={onReset} className="btn-optikka btn-optikka-ghost">
                            ESCARTAR RELATÓRIO
                        </button>
                    </div>

                    <p className="label-meta text-[10px] opacity-30 mt-8">
                        LuzzIA // Confidential Analysis // Precision: HIGH
                    </p>
                </div>
            </div>
        </div>
    );
};
