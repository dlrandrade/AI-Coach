import React from 'react';
import { AnalysisResult } from '../services/aiService';

interface DiagnosisScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
    onNext: () => void;
}

const getScoreColor = (score: number) => {
    if (score <= 4) return '#EA580C';
    if (score <= 7) return '#CA8A04';
    return '#059669';
};

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ handle, result, onReset, onNext }) => {
    if (!result) return null;
    const { diagnosis, plan } = result;

    return (
        <div className="min-h-screen bg-white">
            {/* Top spacing */}
            <div className="h-24 md:h-32"></div>

            <div className="container-neurelic space-y-20 reveal">

                {/* HEADER */}
                <header className="grid md:grid-cols-[1fr_auto] gap-12 items-end">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="tech-label" style={{ background: '#FEF3C7', color: '#B45309' }}>ANÁLISE CRÍTICA</span>
                            <span className="micro-label">ALVO: @{handle.toUpperCase()}</span>
                        </div>

                        <h1 className="hero-title leading-none">
                            RELATÓRIO<br />DIAGNÓSTICO
                        </h1>

                        <p className="text-gray-500 text-xl max-w-xl leading-relaxed pl-6 border-l-4 border-gray-200 italic">
                            "{diagnosis.verdict}"
                        </p>
                    </div>

                    <div className="text-center p-8 border border-gray-200 rounded-2xl min-w-[200px]">
                        <span className="micro-label block mb-2">ÍNDICE DE SAÚDE</span>
                        <div className="text-6xl font-extrabold tracking-tighter" style={{ color: getScoreColor(diagnosis.overall_score / 10) }}>
                            {diagnosis.overall_score}
                        </div>
                        <div className="score-track mt-4">
                            <div className="score-fill" style={{ width: `${diagnosis.overall_score}%`, backgroundColor: getScoreColor(diagnosis.overall_score / 10) }}></div>
                        </div>
                    </div>
                </header>

                {/* Divider */}
                <div className="h-px bg-gray-200"></div>

                {/* MATRIX */}
                <section className="space-y-10">
                    <div className="flex justify-between items-end">
                        <h2 className="section-title">MATRIZ DIMENSIONAL</h2>
                        <span className="micro-label">6 SETORES</span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {diagnosis.dimensions.map((dim, i) => (
                            <div key={i} className="card-tech space-y-6">
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-400 font-mono text-sm">0{i + 1}</span>
                                    <span className="font-mono text-2xl font-bold" style={{ color: getScoreColor(dim.score) }}>
                                        {dim.score}/10
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-gray-900 uppercase">{dim.name}</h3>
                                    <div className="w-12 h-1 rounded-full" style={{ backgroundColor: getScoreColor(dim.score) }}></div>
                                </div>

                                <div className="space-y-5 pt-4 border-t border-gray-100">
                                    <div>
                                        <span className="micro-label" style={{ color: '#EA580C' }}>FALHA</span>
                                        <p className="text-gray-700 leading-relaxed mt-2">{dim.problem}</p>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex gap-3">
                                            <span className="text-gray-400 font-mono text-xs shrink-0 w-14">TRAVA:</span>
                                            <span className="text-gray-600">{dim.fear}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-gray-400 font-mono text-xs shrink-0 w-14">CUSTO:</span>
                                            <span className="text-gray-600">{dim.cost}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-5 mt-5 border-t border-gray-100 bg-gray-50 -mx-8 -mb-8 px-8 py-6 rounded-b-2xl">
                                    <span className="micro-label text-green-600">CORREÇÃO IMEDIATA</span>
                                    <p className="text-gray-700 mt-2 font-medium">{dim.quick_fix}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Divider */}
                <div className="h-px bg-gray-200"></div>

                {/* FOOTER */}
                <footer className="flex flex-col md:flex-row gap-6 justify-center items-center py-8">
                    <button onClick={onNext} className="btn-neurelic min-w-[280px]">
                        INICIAR PROTOCOLO DE {plan.length} DIAS
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>

                    <button onClick={onReset} className="btn-outline">
                        DESCARTAR
                    </button>
                </footer>
            </div>

            {/* Bottom spacing */}
            <div className="h-24 md:h-32"></div>
        </div>
    );
};
