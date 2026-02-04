import React from 'react';
import { AnalysisResult } from '../services/aiService';

interface DiagnosisScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
    onNext: () => void;
}

const getStatusColor = (status: string) => {
    if (status === 'alavanca') return '#059669';
    if (status === 'neutro') return '#CA8A04';
    return '#EA580C';
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
    if (pos === 'aspirante') return '#CA8A04';
    return '#EA580C';
};

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ handle, result, onReset, onNext }) => {
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
            <div className="h-24 md:h-32"></div>

            <div className="container-neurelic space-y-16 reveal">

                {/* HEADER */}
                <header className="space-y-8">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="tech-label" style={{ background: '#DCFCE7', color: '#166534' }}>{diagnosis.objetivo_ativo}</span>
                        <span className="micro-label">ALVO: @{handle.toUpperCase()}</span>
                    </div>

                    <h1 className="hero-title leading-none">
                        DIAGNÓSTICO<br />DE DOMÍNIO
                    </h1>

                    <div className="max-w-3xl p-6 bg-gray-50 border-l-4 border-red-500 rounded-r-xl">
                        <p className="text-xl text-gray-900 font-bold leading-relaxed">
                            "{diagnosis.sentenca}"
                        </p>
                    </div>
                </header>

                {/* POSICIONAMENTO ATUAL */}
                <div className="h-px bg-gray-200"></div>

                <section className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <span className="micro-label">POSICIONAMENTO ATUAL</span>
                        <div
                            className="text-4xl font-extrabold tracking-tight"
                            style={{ color: getPositionColor(diagnosis.posicionamento) }}
                        >
                            {getPositionLabel(diagnosis.posicionamento)}
                        </div>
                        {diagnosis.modo_falha && (
                            <div className="inline-block tech-label" style={{ background: '#FEF3C7', color: '#B45309' }}>
                                MODO: {diagnosis.modo_falha.toUpperCase().replace('_', ' ')}
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <span className="micro-label">AÇÃO DE MAIOR ALAVANCAGEM</span>
                        <p className="text-lg text-gray-900 font-medium leading-relaxed">
                            {diagnosis.acao_alavancagem}
                        </p>
                    </div>
                </section>

                {/* PECADO CAPITAL & CONFLITO */}
                <div className="h-px bg-gray-200"></div>

                <section className="grid md:grid-cols-2 gap-8">
                    <div className="card-tech space-y-4 border-l-4 border-l-red-500">
                        <span className="micro-label" style={{ color: '#B91C1C' }}>PECADO CAPITAL</span>
                        <p className="text-gray-700 leading-relaxed">{diagnosis.pecado_capital}</p>
                    </div>
                    <div className="card-tech space-y-4 border-l-4 border-l-amber-500">
                        <span className="micro-label" style={{ color: '#B45309' }}>CONFLITO OCULTO</span>
                        <p className="text-gray-700 leading-relaxed">{diagnosis.conflito_oculto}</p>
                    </div>
                </section>

                {/* DISSECAÇÃO */}
                <div className="h-px bg-gray-200"></div>

                <section className="space-y-8">
                    <h2 className="section-title">DISSECAÇÃO DO PERFIL</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dissecacaoItems.map((item) => (
                            <div key={item.key} className="card-tech space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900">{item.label}</h3>
                                    <span
                                        className="text-xs font-bold px-3 py-1 rounded-full"
                                        style={{
                                            backgroundColor: getStatusColor(item.status) + '20',
                                            color: getStatusColor(item.status)
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

                {/* FOOTER */}
                <div className="h-px bg-gray-200"></div>

                <footer className="flex flex-col md:flex-row gap-6 justify-center items-center py-8">
                    <button onClick={onNext} className="btn-neurelic min-w-[280px]">
                        EXECUTAR PLANO DE {plan.length} DIAS
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>

                    <button onClick={onReset} className="btn-outline">
                        DESCARTAR
                    </button>
                </footer>
            </div>

            <div className="h-24 md:h-32"></div>
        </div>
    );
};
