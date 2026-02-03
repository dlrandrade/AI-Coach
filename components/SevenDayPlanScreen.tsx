import React, { useState } from 'react';
import { AnalysisResult, PlanDay } from '../services/aiService';

interface SevenDayPlanScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
    isLoadingPlan: boolean;
}

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
        link.download = `plano-${handle}-${plan.length}dias.html`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const generatePDFContent = () => {
        const days = plan.map(day => `
            <div style="page-break-inside: avoid; margin-bottom: 48px; padding: 32px; border: 1px solid #e5e5e5; border-radius: 16px;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                    <span style="font-size: 36px; font-weight: 800; color: #059669;">DIA ${day.day.toString().padStart(2, '0')}</span>
                    <span style="background: #f5f5f5; padding: 6px 16px; border-radius: 8px; font-size: 12px; text-transform: uppercase; font-weight: 600;">${day.format}</span>
                    <span style="color: #737373; font-size: 12px; text-transform: uppercase;">${day.dimension}</span>
                </div>
                <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">${day.action}</h3>
                <p style="color: #525252; margin-bottom: 24px; line-height: 1.6;"><strong>Objetivo:</strong> ${day.objective}</p>
                ${day.example ? `<div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin-bottom: 24px; border-radius: 0 12px 12px 0;">
                    <strong style="color: #059669; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Aplicação Sugerida</strong>
                    <p style="margin-top: 12px; white-space: pre-wrap; line-height: 1.6;">${day.example}</p>
                </div>` : ''}
                <div style="background: #fafafa; padding: 20px; border-radius: 12px;">
                    <strong style="font-size: 11px; text-transform: uppercase; color: #737373; letter-spacing: 0.1em;">Prompt para IA</strong>
                    <p style="margin-top: 12px; font-family: monospace; font-size: 13px; white-space: pre-wrap; line-height: 1.7;">${day.prompt}</p>
                </div>
            </div>
        `).join('');

        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Plano de ${plan.length} Dias - @${handle}</title>
    <style>
        body { font-family: 'Inter', -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 64px 32px; color: #171717; line-height: 1.6; }
        h1 { font-size: 42px; font-weight: 800; color: #059669; margin-bottom: 8px; letter-spacing: -0.03em; }
        h2 { font-size: 20px; color: #525252; font-weight: 400; margin-bottom: 64px; }
        @media print { body { padding: 32px; } }
    </style>
</head>
<body>
    <h1>PLANO DE ${plan.length} DIAS</h1>
    <h2>Estratégia para @${handle} • Gerado por LuzzIA</h2>
    ${days}
    <footer style="margin-top: 64px; padding-top: 32px; border-top: 1px solid #e5e5e5; color: #a3a3a3; font-size: 12px;">
        LuzzIA Architect • Feito com ♥️ por @DanielLuzz
    </footer>
</body>
</html>`;
    };

    if (isLoadingPlan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-white">
                <div className="text-center space-y-6">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <h2 className="text-2xl text-green-600 font-bold">ARQUITETANDO ESTRATÉGIA...</h2>
                    <p className="text-gray-500">A LuzzIA está desenhando seu plano.</p>
                </div>
            </div>
        );
    }

    if (plan.length === 0) return null;

    const isLongPlan = plan.length > 7;
    const weekGroups = isLongPlan ? [
        { label: "FASE 01 // FUNDAÇÃO", days: plan.slice(0, 7) },
        { label: "FASE 02 // CONTEÚDO", days: plan.slice(7, 14) },
        { label: "FASE 03 // ENGAJAMENTO", days: plan.slice(14, 21) },
        { label: "FASE 04 // CONVERSÃO", days: plan.slice(21, 30) }
    ] : [{ label: "FASE 01 // EXECUÇÃO", days: plan }];

    const PlanCard = ({ day }: { day: PlanDay }) => {
        const isExpanded = expandedDay === day.day;

        return (
            <div
                className={`card-tech p-0 overflow-hidden cursor-pointer transition-all ${isExpanded ? 'ring-2 ring-green-600' : ''}`}
                onClick={() => setExpandedDay(isExpanded ? null : day.day)}
            >
                {/* Header */}
                <div className="flex items-stretch">
                    <div className="w-24 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center py-6">
                        <span className="text-gray-400 text-xs font-mono">DIA</span>
                        <span className={`text-3xl font-extrabold ${isExpanded ? 'text-green-600' : 'text-gray-900'}`}>
                            {day.day.toString().padStart(2, '0')}
                        </span>
                    </div>

                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-3 items-center">
                                <span className="tech-label">{day.format}</span>
                                <span className="micro-label">{day.dimension}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{day.action}</h3>
                        </div>

                        <svg className={`w-6 h-6 shrink-0 transition-transform ${isExpanded ? 'rotate-180 text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Expanded Content */}
                <div className={`grid transition-all duration-300 ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden border-t border-gray-200 bg-gray-50">
                        <div className="p-8 space-y-8">

                            {/* Two columns on desktop */}
                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Left column */}
                                <div className="space-y-6">
                                    <div>
                                        <span className="micro-label" style={{ color: '#B45309' }}>OBJETIVO</span>
                                        <p className="text-gray-600 mt-3 italic text-lg leading-relaxed">"{day.objective}"</p>
                                    </div>

                                    {day.example && (
                                        <div>
                                            <span className="micro-label text-green-600">APLICAÇÃO SUGERIDA</span>
                                            <div className="mt-3 p-5 bg-white border-l-4 border-green-600 text-gray-700 leading-relaxed rounded-r-lg">
                                                {day.example}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 border border-gray-200 rounded-xl bg-white">
                                        <span className="micro-label">DICA</span>
                                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                            Preencha os campos em [COLCHETES] para respostas mais precisas.
                                        </p>
                                    </div>
                                </div>

                                {/* Right column */}
                                <div className="space-y-5">
                                    <div className="flex flex-wrap justify-between items-center gap-4">
                                        <span className="micro-label">PROMPT GENERATIVO</span>
                                        <div className="flex gap-3">
                                            <a
                                                href={getChatGPTLink(day.prompt)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="btn-outline h-11 text-xs"
                                            >
                                                ABRIR CHATGPT
                                            </a>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); copyPrompt(day.prompt, day.day); }}
                                                className={`btn-neurelic h-11 text-xs ${copiedDay === day.day ? 'bg-gray-900 border-gray-900' : ''}`}
                                            >
                                                {copiedDay === day.day ? 'COPIADO!' : 'COPIAR'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-xl p-6 font-mono text-sm text-gray-700 leading-relaxed max-h-[280px] overflow-y-auto custom-scrollbar">
                                        {day.prompt}
                                    </div>
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
            {/* Top spacing */}
            <div className="h-24 md:h-32"></div>

            <div className="container-neurelic space-y-16 reveal">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <span className="tech-label">MODO EXECUÇÃO</span>
                        <h1 className="hero-title">PLANO DE AÇÃO</h1>
                    </div>
                    <div className="text-left md:text-right space-y-1">
                        <p className="micro-label">DURAÇÃO</p>
                        <p className="text-5xl font-extrabold text-green-600">{plan.length} DIAS</p>
                    </div>
                </header>

                {/* Divider */}
                <div className="h-px bg-gray-200"></div>

                {/* Plan content */}
                <div className="space-y-16">
                    {weekGroups.map((group, i) => (
                        <div key={i} className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                <h2 className="text-base font-mono text-gray-500 tracking-widest">{group.label}</h2>
                                <div className="h-px flex-1 bg-gray-200"></div>
                            </div>
                            <div className="space-y-6">
                                {group.days.map(day => <PlanCard key={day.day} day={day} />)}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Bottom spacing for fixed footer */}
            <div className="h-48"></div>

            {/* Fixed Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-5 z-50 no-print">
                <div className="container-neurelic flex flex-col md:flex-row justify-between items-center gap-4">

                    <a href="https://instagram.com/danielluzz" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-600 text-sm transition-colors">
                        Feito com ♥️ por @DanielLuzz
                    </a>

                    <div className="flex gap-4">
                        <button onClick={downloadPDF} className="btn-outline h-12">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            BAIXAR PLANO
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
