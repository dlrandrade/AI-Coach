import React from 'react';
import { AnalysisResult } from '../services/aiService';

interface DiagnosisScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
    onNext: () => void;
}

const getScoreColor = (score: number) => {
    if (score <= 4) return '#EA580C'; // Orange
    if (score <= 7) return '#CA8A04'; // Yellow
    return '#059669'; // Green
};

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ handle, result, onReset, onNext }) => {
    if (!result) return null;
    const { diagnosis, plan } = result;

    return (
        <div className="min-h-screen bg-white py-[var(--space-4xl)]">
            <div className="container-neurelic space-y-[var(--space-3xl)] reveal">

                {/* HEADER */}
                <header className="grid md:grid-cols-[1fr_auto] gap-[var(--space-2xl)] items-end border-b border-[var(--gray-200)] pb-[var(--space-2xl)]">
                    <div className="space-y-[var(--space-lg)]">
                        <div className="flex items-center gap-[var(--space-md)]">
                            <span className="tech-label" style={{ borderColor: '#EA580C', color: '#EA580C' }}>ANÁLISE CRÍTICA</span>
                            <span className="micro-label">ALVO: @{handle.toUpperCase()}</span>
                        </div>
                        <h1 className="hero-title">
                            RELATÓRIO <br /> DIAGNÓSTICO
                        </h1>
                        <p className="text-[var(--gray-600)] text-lg max-w-2xl font-light pl-[var(--space-lg)] border-l-4 border-[var(--gray-200)]">
                            "{diagnosis.verdict}"
                        </p>
                    </div>

                    <div className="card-tech min-w-[280px] text-center space-y-[var(--space-sm)]">
                        <span className="micro-label">ÍNDICE DE SAÚDE</span>
                        <div className="text-7xl font-extrabold tracking-tighter" style={{ color: getScoreColor(diagnosis.overall_score / 10) }}>
                            {diagnosis.overall_score}
                        </div>
                        <div className="score-track mt-[var(--space-md)]">
                            <div className="score-fill" style={{ width: `${diagnosis.overall_score}%`, backgroundColor: getScoreColor(diagnosis.overall_score / 10) }}></div>
                        </div>
                    </div>
                </header>

                {/* MATRIX */}
                <section className="space-y-[var(--space-xl)]">
                    <div className="flex justify-between items-end">
                        <h2 className="section-title">MATRIZ DIMENSIONAL</h2>
                        <span className="micro-label">6 SETORES</span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-lg)]">
                        {diagnosis.dimensions.map((dim, i) => (
                            <div key={i} className="card-tech space-y-[var(--space-lg)] group">
                                <div className="flex justify-between items-start">
                                    <span className="micro-label opacity-60">0{i + 1}</span>
                                    <span className="font-mono text-xl font-bold" style={{ color: getScoreColor(dim.score) }}>{dim.score}/10</span>
                                </div>

                                <div className="space-y-[var(--space-xs)]">
                                    <h3 className="text-lg font-bold text-[var(--gray-900)] uppercase leading-tight">{dim.name}</h3>
                                    <div className="w-10 h-1 rounded-full" style={{ backgroundColor: getScoreColor(dim.score) }}></div>
                                </div>

                                <div className="space-y-[var(--space-md)] pt-[var(--space-md)] border-t border-[var(--gray-100)]">
                                    <div>
                                        <span className="micro-label" style={{ color: '#EA580C' }}>FALHA</span>
                                        <p className="text-[var(--gray-700)] font-medium leading-snug mt-1">{dim.problem}</p>
                                    </div>

                                    <div className="grid grid-cols-[auto_1fr] gap-x-[var(--space-sm)] gap-y-[var(--space-xs)] text-sm">
                                        <span className="text-[var(--gray-500)] font-mono text-xs">TRAVA:</span>
                                        <span className="text-[var(--gray-600)]">{dim.fear}</span>

                                        <span className="text-[var(--gray-500)] font-mono text-xs">CUSTO:</span>
                                        <span className="text-[var(--gray-600)]">{dim.cost}</span>
                                    </div>
                                </div>

                                <div className="pt-[var(--space-md)] mt-[var(--space-md)] bg-[var(--gray-50)] -mx-[var(--space-xl)] -mb-[var(--space-xl)] p-[var(--space-lg)] border-t border-[var(--gray-100)]">
                                    <span className="micro-label text-[var(--green-core)]">CORREÇÃO IMEDIATA</span>
                                    <p className="text-sm text-[var(--gray-700)] mt-2 font-medium">
                                        {dim.quick_fix}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FOOTER ACTIONS */}
                <footer className="flex flex-col md:flex-row gap-[var(--space-lg)] justify-center items-center py-[var(--space-2xl)] border-t border-[var(--gray-200)]">
                    <button onClick={onNext} className="btn-neurelic min-w-[280px]">
                        INICIAR PROTOCOLO DE {plan.length} DIAS
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>

                    <button onClick={onReset} className="btn-outline min-w-[180px]">
                        DESCARTAR
                    </button>
                </footer>

            </div>
        </div>
    );
};
