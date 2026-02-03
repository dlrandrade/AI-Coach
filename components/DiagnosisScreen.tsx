import React from 'react';
import { AnalysisResult } from '../services/aiService';

interface DiagnosisScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
    onNext: () => void;
}

const getScoreColor = (score: number) => {
    if (score <= 4) return 'var(--orange-action)';
    if (score <= 7) return '#FCD34D'; // Yellow-ish
    return 'var(--green-core)';
};

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ handle, result, onReset, onNext }) => {
    if (!result) return null;
    const { diagnosis, plan } = result;

    return (
        <div className="min-h-screen bg-[var(--black-absolute)] py-20">
            <div className="container-neurelic space-y-24 reveal">

                {/* HEAD (HUD) */}
                <header className="grid md:grid-cols-[1fr_auto] gap-12 items-end border-b border-[var(--gray-dark)] pb-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="tech-label text-[var(--orange-action)] border-[var(--orange-action)]">CRITICAL ANALYSIS</span>
                            <span className="micro-label">ID: {handle.toUpperCase()}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9]">
                            DIAGNOSTIC <br /> <span className="text-[var(--green-core)]">REPORT</span>
                        </h1>
                        <p className="text-[var(--gray-muted)] text-xl max-w-2xl font-light pl-6 border-l-2 border-[var(--gray-dark)]">
                            "{diagnosis.verdict}"
                        </p>
                    </div>

                    <div className="card-tech min-w-[300px] text-center space-y-2">
                        <span className="micro-label">OVERALL HEALTH INDEX</span>
                        <div className="text-8xl font-bold text-[var(--white)] tracking-tighter" style={{ color: getScoreColor(diagnosis.overall_score / 10) }}>
                            {diagnosis.overall_score}
                        </div>
                        <div className="w-full h-1 bg-[var(--black-absolute)] mt-4">
                            <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${diagnosis.overall_score}%`, backgroundColor: getScoreColor(diagnosis.overall_score / 10) }}></div>
                        </div>
                    </div>
                </header>

                {/* MATRIX GRID */}
                <div className="space-y-8">
                    <div className="flex justify-between items-end">
                        <h2 className="section-title">DIMENSIONAL BREAKDOWN</h2>
                        <span className="micro-label">6 SECTORS ANALYZED</span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {diagnosis.dimensions.map((dim, i) => (
                            <div key={i} className="card-tech space-y-6 group hover:border-[var(--green-muted)] transition-colors">
                                <div className="flex justify-between items-start">
                                    <span className="micro-label opacity-50">0{i + 1}</span>
                                    <span className="font-mono text-xl font-bold" style={{ color: getScoreColor(dim.score) }}>{dim.score}/10</span>
                                </div>

                                <div className="space-y-2 min-h-[80px]">
                                    <h3 className="text-xl font-bold text-white uppercase leading-tight">{dim.name}</h3>
                                    <div className="w-8 h-[2px]" style={{ backgroundColor: getScoreColor(dim.score) }}></div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                                    <div>
                                        <span className="micro-label text-[var(--orange-action)]">FAILURE</span>
                                        <p className="text-[var(--gray-light)] font-medium leading-snug mt-1">{dim.problem}</p>
                                    </div>

                                    <div className="grid grid-cols-[auto_1fr] gap-3 text-sm">
                                        <span className="text-[var(--gray-muted)] font-mono">FEAR:</span>
                                        <span className="text-[var(--gray-light)]">{dim.fear}</span>

                                        <span className="text-[var(--gray-muted)] font-mono">COST:</span>
                                        <span className="text-[var(--gray-light)]">{dim.cost}</span>
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 bg-[var(--black-absolute)] -mx-8 -mb-8 p-6 border-t border-[var(--gray-dark)] group-hover:bg-[var(--black-deep)] transition-colors">
                                    <span className="micro-label text-[var(--green-core)]">QUICK FIX PROTOCOL</span>
                                    <p className="text-sm text-[var(--gray-light)] mt-2 font-light">
                                        {dim.quick_fix}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center py-12 border-t border-[var(--gray-dark)]">
                    <button onClick={onNext} className="btn-neurelic h-16 px-12 text-lg w-full md:w-auto">
                        INITIALIZE {plan.length}-DAY PLAN
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>

                    <button onClick={onReset} className="text-[var(--gray-muted)] hover:text-white transition-colors font-mono text-xs uppercase tracking-widest border-b border-transparent hover:border-white pb-1">
                        DISCARD_SESSION
                    </button>
                </div>

            </div>
        </div>
    );
};
