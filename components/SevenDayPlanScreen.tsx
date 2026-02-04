import React, { useState } from 'react';
import { AnalysisResult, PlanDay } from '../services/aiService';

interface SevenDayPlanScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
    isLoadingPlan: boolean;
}

const getTipoLabel = (tipo: string) => {
    const map: Record<string, string> = {
        queima_ponte: '🔥 QUEIMA PONTE',
        excludente: '⛔ EXCLUDENTE',
        tensao_maxima: '⚡ TENSÃO MÁXIMA',
        movimento_dinheiro: '💰 MOVIMENTO $',
        padrao: 'EXECUÇÃO'
    };
    return map[tipo] || tipo.toUpperCase();
};

const getTipoColor = (tipo: string) => {
    const map: Record<string, string> = {
        queima_ponte: '#DC2626',
        excludente: '#7C3AED',
        tensao_maxima: '#D97706',
        movimento_dinheiro: '#059669',
        padrao: '#000000'
    };
    return map[tipo] || '#000000';
};

export const SevenDayPlanScreen: React.FC<SevenDayPlanScreenProps> = ({ handle, result, onReset, isLoadingPlan }) => {
    const plan = result?.plan || [];
    const [copiedDay, setCopiedDay] = useState<number | null>(null);
    const [expandedDay, setExpandedDay] = useState<number | null>(1);

    const copyPrompt = async (prompt: string, day: number) => {
        await navigator.clipboard.writeText(prompt);
        setCopiedDay(day);
        setTimeout(() => setCopiedDay(null), 2000);
    };

    const getChatGPTLink = (prompt: string) => {
        return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
    };

    const downloadPDF = () => {
        const content = generatePDFContent();
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `plano-dominio-${handle}-${plan.length}dias.html`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const generatePDFContent = () => {
        const days = plan.map(day => `
            <div style="page-break-inside: avoid; margin-bottom: 48px; padding: 32px; border: 2px solid #000; ${day.tipo !== 'padrao' ? `border-left: 4px solid ${getTipoColor(day.tipo)};` : ''}">
                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <span style="font-size: 32px; font-weight: 800; color: #000;">DIA ${day.day.toString().padStart(2, '0')}</span>
                    <span style="background: ${getTipoColor(day.tipo)}; color: white; padding: 6px 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em;">${getTipoLabel(day.tipo)}</span>
                    <span style="background: #000; color: white; padding: 6px 14px; font-size: 10px; letter-spacing: 0.1em;">${day.formato.toUpperCase()}</span>
                </div>
                <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">${day.acao}</h3>
                <div style="background: #f5f5f5; padding: 16px; margin-bottom: 24px; border-left: 3px solid #000;">
                    <strong style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666;">Objetivo Psicológico</strong>
                    <p style="margin-top: 8px; font-size: 14px;">${day.objetivo_psicologico}</p>
                </div>
                <div style="background: #1a1a1a; color: #10B981; padding: 24px; font-family: monospace;">
                    <strong style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #10B981;">Prompt de Execução</strong>
                    <pre style="margin-top: 16px; font-size: 12px; white-space: pre-wrap; line-height: 1.6;">${day.prompt}</pre>
                </div>
            </div>
        `).join('');

        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Plano de Domínio ${plan.length} Dias - @${handle}</title>
    <style>
        body { font-family: 'Inter', -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 64px 32px; color: #000; line-height: 1.6; }
        h1 { font-size: 48px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.04em; }
        h2 { font-size: 16px; color: #666; font-weight: 400; margin-bottom: 64px; }
        @media print { body { padding: 24px; } }
    </style>
</head>
<body>
    <h1>PLANO DE DOMÍNIO — ${plan.length} DIAS</h1>
    <h2>Estratégia para @${handle} • Objetivo: ${result?.diagnosis.objetivo_ativo}</h2>
    ${days}
    <footer style="margin-top: 64px; padding-top: 32px; border-top: 2px solid #000; color: #666; font-size: 11px; font-family: monospace;">
        LUZZIA ENGINE v2.1 • @DANIELLUZZ
    </footer>
</body>
</html>`;
    };

    if (isLoadingPlan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-white">
                <div className="text-center space-y-6">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent mx-auto" style={{ animation: 'spin 1s linear infinite' }}></div>
                    <h2 className="text-2xl text-black font-bold">ARQUITETANDO PLANO...</h2>
                    <p className="text-gray-500 font-mono text-sm">Estruturando ações de dominação.</p>
                </div>
            </div>
        );
    }

    if (plan.length === 0) return null;

    const isLongPlan = plan.length > 7;
    const weekGroups = isLongPlan ? [
        { label: "FASE 01 — DECLARAÇÃO", days: plan.slice(0, 7) },
        { label: "FASE 02 — TENSÃO", days: plan.slice(7, 14) },
        { label: "FASE 03 — PROVA", days: plan.slice(14, 21) },
        { label: "FASE 04 — CONVERSÃO", days: plan.slice(21, 30) }
    ] : [{ label: "PROTOCOLO DE DOMINAÇÃO", days: plan }];

    const PlanCard = ({ day }: { day: PlanDay }) => {
        const isExpanded = expandedDay === day.day;
        const isSpecial = day.tipo !== 'padrao';

        return (
            <div
                className={`card-tech p-0 overflow-hidden cursor-pointer transition-all ${isExpanded ? 'card-elevated' : ''}`}
                style={isSpecial ? { borderLeft: `4px solid ${getTipoColor(day.tipo)}` } : {}}
                onClick={() => setExpandedDay(isExpanded ? null : day.day)}
            >
                {/* Header */}
                <div className="flex items-stretch">
                    <div className="w-20 bg-black text-white flex flex-col items-center justify-center py-6">
                        <span className="text-xs font-mono opacity-60">DIA</span>
                        <span className="text-3xl font-extrabold">
                            {day.day.toString().padStart(2, '0')}
                        </span>
                    </div>

                    <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 items-center">
                                <span
                                    className="text-xs font-bold px-3 py-1"
                                    style={{ backgroundColor: getTipoColor(day.tipo), color: 'white' }}
                                >
                                    {getTipoLabel(day.tipo)}
                                </span>
                                <span className="tech-label text-xs">{day.formato.toUpperCase()}</span>
                            </div>
                            <h3 className="text-base font-bold text-black">{day.acao}</h3>
                        </div>

                        <svg className={`w-5 h-5 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Expanded Content */}
                <div className={`grid transition-all duration-200 ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden border-t-2 border-black">
                        <div className="p-6 space-y-6 bg-gray-50">

                            {/* Objetivo */}
                            <div className="p-4 bg-white border-2 border-black border-l-4" style={{ borderLeftColor: getTipoColor(day.tipo) }}>
                                <span className="micro-label text-xs">OBJETIVO PSICOLÓGICO</span>
                                <p className="text-gray-800 mt-2 leading-relaxed">{day.objetivo_psicologico}</p>
                            </div>

                            {/* Prompt */}
                            <div className="space-y-4">
                                <div className="flex flex-wrap justify-between items-center gap-3">
                                    <span className="micro-label text-xs">PROMPT DE EXECUÇÃO</span>
                                    <div className="flex gap-2">
                                        <a
                                            href={getChatGPTLink(day.prompt)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="btn-outline h-10 text-xs"
                                        >
                                            CHATGPT
                                        </a>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyPrompt(day.prompt, day.day); }}
                                            className={`btn-neurelic h-10 text-xs ${copiedDay === day.day ? 'bg-green-600 border-green-600' : ''}`}
                                        >
                                            {copiedDay === day.day ? 'COPIADO!' : 'COPIAR'}
                                        </button>
                                    </div>
                                </div>

                                <div className="debug-section max-h-[350px] custom-scrollbar">
                                    <pre>{day.prompt}</pre>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="h-16 md:h-24"></div>

            <div className="container-neurelic space-y-12 reveal">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-4">
                        <span className="tech-label">{result?.diagnosis.objetivo_ativo}</span>
                        <h1 className="hero-title">PLANO DE<br /><span>DOMÍNIO</span></h1>
                    </div>
                    <div className="text-left md:text-right space-y-1">
                        <p className="micro-label">DURAÇÃO</p>
                        <p className="text-5xl font-extrabold text-black">{plan.length} <span className="text-green-600">DIAS</span></p>
                    </div>
                </header>

                <div className="h-px bg-gray-300"></div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 text-xs">
                    {['queima_ponte', 'excludente', 'tensao_maxima', 'movimento_dinheiro'].map(tipo => (
                        <span
                            key={tipo}
                            className="px-3 py-1 font-bold"
                            style={{ backgroundColor: getTipoColor(tipo), color: 'white' }}
                        >
                            {getTipoLabel(tipo)}
                        </span>
                    ))}
                </div>

                {/* Plan content */}
                <div className="space-y-10">
                    {weekGroups.map((group, i) => (
                        <div key={i} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 bg-black"></div>
                                <h2 className="text-sm font-mono font-bold text-black tracking-widest">{group.label}</h2>
                                <div className="h-0.5 flex-1 bg-black"></div>
                            </div>
                            <div className="space-y-3">
                                {group.days.map(day => <PlanCard key={day.day} day={day} />)}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <div className="h-40"></div>

            {/* Fixed Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 border-black py-4 z-50 no-print">
                <div className="container-neurelic flex flex-col md:flex-row justify-between items-center gap-4">

                    <a href="https://instagram.com/danielluzz" target="_blank" rel="noreferrer" className="credit-label hover:text-black transition-colors">
                        FEITO POR @DANIELLUZZ
                    </a>

                    <div className="flex gap-3">
                        <button onClick={downloadPDF} className="btn-outline h-12">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            BAIXAR
                        </button>
                        <button onClick={onReset} className="btn-neurelic h-12">
                            REINICIAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
