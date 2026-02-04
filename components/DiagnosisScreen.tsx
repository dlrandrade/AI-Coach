import React, { useState } from 'react';
import { AnalysisResult } from '../services/aiService';
import { InstagramProfileData } from '../services/instagramService';

interface DiagnosisScreenProps {
    handle: string;
    result: AnalysisResult | null;
    rawScrapedData?: InstagramProfileData | null;
    onReset: () => void;
    onNext: () => void;
}

const getStatusColor = (status: string) => {
    if (status === 'alavanca') return '#059669';
    if (status === 'neutro') return '#D97706';
    return '#DC2626';
};

const getStatusLabel = (status: string) => {
    if (status === 'alavanca') return 'ALAVANCA';
    if (status === 'neutro') return 'NEUTRO';
    return 'SABOTADOR';
};

const getPositionLabel = (pos: string) => {
    const map: Record<string, string> = {
        commodity: 'COMMODITY',
        aspirante: 'ASPIRANTE',
        autoridade: 'AUTORIDADE',
        dominador: 'DOMINADOR'
    };
    return map[pos] || pos.toUpperCase();
};

const getPositionColor = (pos: string) => {
    if (pos === 'dominador') return '#059669';
    if (pos === 'autoridade') return '#0EA5E9';
    if (pos === 'aspirante') return '#D97706';
    return '#DC2626';
};

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ handle, result, rawScrapedData, onReset, onNext }) => {
    const [showDebug, setShowDebug] = useState(true);

    if (!result) return null;
    const { diagnosis, plan } = result;

    const dissecacaoItems = [
        { key: 'bio', label: 'BIO', ...diagnosis.dissecacao.bio },
        { key: 'feed', label: 'FEED', ...diagnosis.dissecacao.feed },
        { key: 'stories', label: 'STORIES', ...diagnosis.dissecacao.stories },
        { key: 'provas', label: 'PROVAS', ...diagnosis.dissecacao.provas },
        { key: 'ofertas', label: 'OFERTAS', ...diagnosis.dissecacao.ofertas },
        { key: 'linguagem', label: 'LINGUAGEM', ...diagnosis.dissecacao.linguagem },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="h-16 md:h-24"></div>

            <div className="container-neurelic space-y-12 reveal">

                {/* DEBUG: DADOS RAW DO INSTAGRAM (PROVISÓRIO) */}
                {showDebug && rawScrapedData && (
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="micro-label text-green-600">DEBUG: DADOS RAW DO INSTAGRAM (SCRAPING REAL)</span>
                            <button
                                onClick={() => setShowDebug(false)}
                                className="text-xs font-mono text-gray-400 hover:text-red-600"
                            >
                                [ESCONDER]
                            </button>
                        </div>
                        <div className="debug-section custom-scrollbar">
                            <pre>{JSON.stringify(rawScrapedData, null, 2)}</pre>
                        </div>
                        {rawScrapedData.error && (
                            <div className="p-4 bg-red-50 border-2 border-red-500 text-red-700 font-mono text-sm">
                                ⚠️ ERRO: {rawScrapedData.error}
                            </div>
                        )}
                    </section>
                )}

                {/* HEADER */}
                <header className="space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="tech-label">{diagnosis.objetivo_ativo}</span>
                        <span className="micro-label">@{handle.toUpperCase()}</span>
                    </div>

                    <h1 className="hero-title leading-none">
                        DIAGNÓSTICO<br /><span>COMPLETO</span>
                    </h1>

                    <div className="max-w-3xl p-6 bg-gray-100 border-l-4 border-red-600">
                        <p className="text-xl text-black font-bold leading-relaxed">
                            "{diagnosis.sentenca}"
                        </p>
                    </div>
                </header>

                {/* POSICIONAMENTO */}
                <div className="h-px bg-gray-200"></div>

                <section className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <span className="micro-label">POSICIONAMENTO ATUAL</span>
                        <div
                            className="text-5xl font-extrabold tracking-tighter"
                            style={{ color: getPositionColor(diagnosis.posicionamento) }}
                        >
                            {getPositionLabel(diagnosis.posicionamento)}
                        </div>
                        {diagnosis.modo_falha && (
                            <div className="inline-block tech-label" style={{ background: '#D97706' }}>
                                MODO: {diagnosis.modo_falha.toUpperCase().replace('_', ' ')}
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <span className="micro-label">AÇÃO DE MAIOR ALAVANCAGEM</span>
                        <p className="text-lg text-black font-medium leading-relaxed">
                            {diagnosis.acao_alavancagem}
                        </p>
                    </div>
                </section>

                {/* PECADO & CONFLITO */}
                <div className="h-px bg-gray-200"></div>

                <section className="grid md:grid-cols-2 gap-6">
                    <div className="card-tech border-l-4 border-l-red-600 space-y-3">
                        <span className="micro-label text-red-600">PECADO CAPITAL</span>
                        <p className="text-gray-800 leading-relaxed">{diagnosis.pecado_capital}</p>
                    </div>
                    <div className="card-tech border-l-4 border-l-amber-500 space-y-3">
                        <span className="micro-label text-amber-600">CONFLITO OCULTO</span>
                        <p className="text-gray-800 leading-relaxed">{diagnosis.conflito_oculto}</p>
                    </div>
                </section>

                {/* DISSECAÇÃO */}
                <div className="h-px bg-gray-200"></div>

                <section className="space-y-6">
                    <h2 className="section-title">DISSECAÇÃO</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dissecacaoItems.map((item) => (
                            <div key={item.key} className="card-tech space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-black text-sm">{item.label}</h3>
                                    <span
                                        className="text-xs font-bold px-3 py-1"
                                        style={{
                                            backgroundColor: getStatusColor(item.status),
                                            color: 'white'
                                        }}
                                    >
                                        {getStatusLabel(item.status)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{item.veredicto}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FOOTER - Thumb zone optimized */}
                <div className="h-px bg-gray-200"></div>

                <footer className="flex flex-col gap-4 justify-center items-stretch py-8 px-4 md:px-0 md:flex-row md:items-center">
                    <button
                        onClick={onNext}
                        className="btn-neurelic w-full md:w-auto md:min-w-[280px] min-h-[56px] active:scale-[0.98]"
                    >
                        VER PLANO DE {plan.length} DIAS
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>

                    <button
                        onClick={onReset}
                        className="btn-outline w-full md:w-auto min-h-[56px] active:scale-[0.98]"
                    >
                        DESCARTAR
                    </button>
                </footer>
            </div>

            <div className="h-16 md:h-24 pb-safe"></div>
        </div>
    );
};
