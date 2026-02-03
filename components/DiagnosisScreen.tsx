import React from 'react';
import { AnalysisResult } from '../services/aiService';

interface DiagnosisScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
    onNext: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'crítico': return 'bg-red-100 text-red-700 border-red-200';
        case 'atenção': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'ok': return 'bg-green-100 text-green-700 border-green-200';
        case 'excelente': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-red-500';
    if (score <= 5) return 'text-orange-500';
    if (score <= 7) return 'text-yellow-600';
    return 'text-green-500';
};

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ handle, result, onReset, onNext }) => {
    if (!result) return null;

    const { diagnosis, plan } = result;

    return (
        <div className="min-h-screen py-12">
            <div className="container space-y-16 fade-in">

                {/* Header */}
                <header className="space-y-6">
                    <p className="label text-accent">Diagnóstico Completo</p>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1>@{handle}</h1>
                            <p className="text-dim text-xl mt-2">{diagnosis.summary}</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="label opacity-60">Score Geral</p>
                            <p className={`text-6xl font-bold ${getScoreColor(diagnosis.overall_score / 10)}`}>
                                {diagnosis.overall_score}
                            </p>
                            <p className="text-sm text-dim">de 100</p>
                        </div>
                    </div>
                </header>

                {/* Dimensions Grid */}
                <div className="space-y-4">
                    <p className="label">6 Dimensões Analisadas</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {diagnosis.dimensions.map((dim, i) => (
                            <div key={i} className="card space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-medium">{dim.name}</p>
                                        <span className={`inline-block text-xs px-2 py-1 border ${getStatusColor(dim.status)}`}>
                                            {dim.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className={`text-3xl font-bold ${getScoreColor(dim.score)}`}>
                                        {dim.score}
                                    </span>
                                </div>

                                <p className="text-lg leading-snug">{dim.problem}</p>

                                <div className="space-y-3 text-sm">
                                    <div className="flex gap-2">
                                        <span className="label min-w-[70px]">Medo:</span>
                                        <span className="text-dim">{dim.fear}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="label min-w-[70px]">Custo:</span>
                                        <span className="font-medium">{dim.cost}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="label min-w-[70px]">Evidência:</span>
                                        <span className="text-dim italic">{dim.evidence}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-[var(--bg)] -mx-4 md:-mx-8 px-4 md:px-8">
                                    <p className="text-sm">
                                        <span className="label mr-2">Fix Rápido:</span>
                                        {dim.quick_fix}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Verdict */}
                <div className="text-center space-y-6 py-8">
                    <p className="label text-accent">Veredito Final</p>
                    <h2 className="text-2xl md:text-4xl max-w-3xl mx-auto leading-tight">
                        "{diagnosis.verdict}"
                    </h2>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-center no-print">
                    <button onClick={onNext} className="btn px-12">
                        Ver Plano de {plan.length} Dias
                    </button>
                    <button onClick={onReset} className="btn btn-outline px-8">
                        Nova Análise
                    </button>
                </div>
            </div>
        </div>
    );
};
