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
            <div style="page-break-inside: avoid; margin-bottom: 32px; padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <span style="font-size: 32px; font-weight: 800; color: #059669;">DIA ${day.day.toString().padStart(2, '0')}</span>
                    <span style="background: #f5f5f5; padding: 4px 12px; border-radius: 6px; font-size: 12px; text-transform: uppercase;">${day.format}</span>
                </div>
                <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">${day.action}</h3>
                <p style="color: #525252; margin-bottom: 16px;"><strong>Objetivo:</strong> ${day.objective}</p>
                ${day.example ? `<div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 16px; margin-bottom: 16px;">
                    <strong style="color: #059669; font-size: 12px; text-transform: uppercase;">Exemplo de Aplicação</strong>
                    <p style="margin-top: 8px; white-space: pre-wrap;">${day.example}</p>
                </div>` : ''}
                <div style="background: #f5f5f5; padding: 16px; border-radius: 8px;">
                    <strong style="font-size: 12px; text-transform: uppercase; color: #737373;">Prompt para IA</strong>
                    <p style="margin-top: 8px; font-family: monospace; font-size: 13px; white-space: pre-wrap;">${day.prompt}</p>
                </div>
            </div>
        `).join('');

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Plano de ${plan.length} Dias - @${handle}</title>
    <style>
        body { font-family: 'Inter', -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 48px 24px; color: #171717; }
        h1 { font-size: 36px; font-weight: 800; color: #059669; margin-bottom: 8px; }
        h2 { font-size: 24px; color: #404040; font-weight: 400; margin-bottom: 48px; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <h1>PLANO DE ${plan.length} DIAS</h1>
    <h2>Estratégia para @${handle} • Gerado por LuzzIA</h2>
    ${days}
    <footer style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e5e5; color: #a3a3a3; font-size: 12px;">
        LuzzIA Architect • Feito com ♥️ por @DanielLuzz
    </footer>
</body>
</html>`;
    };

    if (isLoadingPlan) {
        return (
            <div className="min-h-screen flex items-center justify-center p-[var(--space-xl)] bg-white">
                <div className="text-center space-y-[var(--space-lg)]">
                    <div className="w-12 h-12 border-4 border-[var(--green-core)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <h2 className="text-2xl text-[var(--green-core)] font-bold">ARQUITETANDO ESTRATÉGIA...</h2>
                    <p className="text-[var(--gray-500)]">A LuzzIA está desenhando seu plano.</p>
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
                className={`card-tech p-0 overflow-hidden cursor-pointer transition-all ${isExpanded ? 'ring-2 ring-[var(--green-core)]' : ''}`}
                onClick={() => setExpandedDay(isExpanded ? null : day.day)}
            >
                <div className="flex items-stretch min-h-[80px]">
                    <div className="w-20 bg-[var(--gray-50)] border-r border-[var(--gray-200)] flex flex-col items-center justify-center font-mono relative">
                        <span className="text-[var(--gray-400)] text-[10px]">DIA</span>
                        <span className={`text-2xl font-extrabold ${isExpanded ? 'text-[var(--green-core)]' : 'text-[var(--gray-900)]'}`}>
                            {day.day.toString().padStart(2, '0')}
                        </span>
                    </div>

                    <div className="flex-1 p-[var(--space-lg)] flex flex-col md:flex-row md:items-center justify-between gap-[var(--space-md)]">
                        <div className="space-y-[var(--space-xs)]">
                            <div className="flex gap-[var(--space-sm)] items-center">
                                <span className="tech-label">{day.format}</span>
                                <span className="micro-label">{day.dimension}</span>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--gray-900)] leading-tight">{day.action}</h3>
                        </div>

                        <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180 text-[var(--green-core)]' : 'text-[var(--gray-400)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <div className={`grid transition-all duration-300 ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden border-t border-[var(--gray-200)] bg-[var(--gray-50)]">
                        <div className="p-[var(--space-xl)] grid md:grid-cols-[1fr_2fr] gap-[var(--space-xl)]">

                            <div className="space-y-[var(--space-lg)]">
                                <div>
                                    <span className="micro-label" style={{ color: '#CA8A04' }}>OBJETIVO</span>
                                    <p className="text-[var(--gray-600)] mt-2 italic">"{day.objective}"</p>
                                </div>

                                {day.example && (
                                    <div>
                                        <span className="micro-label text-[var(--green-core)]">APLICAÇÃO SUGERIDA</span>
                                        <div className="mt-2 p-[var(--space-md)] bg-white border-l-4 border-[var(--green-core)] text-sm text-[var(--gray-700)]">
                                            {day.example}
                                        </div>
                                    </div>
                                )}

                                <div className="p-[var(--space-md)] border border-[var(--gray-200)] rounded-[var(--radius-md)] bg-white">
                                    <span className="micro-label">DICA</span>
                                    <p className="text-xs text-[var(--gray-500)] mt-1">
                                        Preencha os campos em [COLCHETES] para respostas mais precisas.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-[var(--space-md)]">
                                <div className="flex flex-wrap justify-between items-center gap-[var(--space-sm)]">
                                    <span className="micro-label">PROMPT GENERATIVO</span>
                                    <div className="flex gap-[var(--space-sm)]">
                                        <a
                                            href={getChatGPTLink(day.prompt)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="btn-outline h-10 min-w-[140px] text-xs"
                                        >
                                            ABRIR CHATGPT
                                        </a>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyPrompt(day.prompt, day.day); }}
                                            className={`btn-neurelic h-10 min-w-[140px] text-xs ${copiedDay === day.day ? 'bg-[var(--gray-900)]' : ''}`}
                                        >
                                            {copiedDay === day.day ? 'COPIADO!' : 'COPIAR'}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] p-[var(--space-lg)] font-mono text-sm text-[var(--gray-700)] leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {day.prompt}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white py-[var(--space-4xl)] pb-[200px]">
            <div className="container-neurelic space-y-[var(--space-3xl)] reveal">

                <header className="flex flex-col md:flex-row justify-between items-end gap-[var(--space-xl)] pb-[var(--space-2xl)] border-b border-[var(--gray-200)]">
                    <div className="space-y-[var(--space-md)]">
                        <span className="tech-label">MODO EXECUÇÃO</span>
                        <h1 className="hero-title">
                            PLANO DE AÇÃO
                        </h1>
                    </div>
                    <div className="text-right space-y-[var(--space-xs)]">
                        <p className="micro-label">DURAÇÃO</p>
                        <p className="text-4xl font-extrabold text-[var(--green-core)]">{plan.length} DIAS</p>
                    </div>
                </header>

                <div className="space-y-[var(--space-2xl)]">
                    {weekGroups.map((group, i) => (
                        <div key={i} className="space-y-[var(--space-lg)]">
                            <div className="flex items-center gap-[var(--space-md)]">
                                <div className="w-3 h-3 bg-[var(--green-core)] rounded-full"></div>
                                <h2 className="text-lg font-mono text-[var(--gray-500)] tracking-widest">{group.label}</h2>
                                <div className="h-[1px] flex-1 bg-[var(--gray-200)]"></div>
                            </div>
                            <div className="space-y-[var(--space-md)]">
                                {group.days.map(day => <PlanCard key={day.day} day={day} />)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[var(--gray-200)] py-[var(--space-lg)] z-50 no-print">
                    <div className="container-neurelic flex flex-col md:flex-row justify-between items-center gap-[var(--space-md)]">

                        <a href="https://instagram.com/danielluzz" target="_blank" rel="noreferrer" className="text-[var(--gray-400)] hover:text-[var(--green-core)] font-mono text-xs transition-colors">
                            Feito com ♥️ por @DanielLuzz
                        </a>

                        <div className="flex gap-[var(--space-md)]">
                            <button onClick={downloadPDF} className="btn-outline h-12 min-w-[180px]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                BAIXAR PLANO
                            </button>
                            <button onClick={onReset} className="btn-neurelic h-12 min-w-[180px]">
                                REINICIAR
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
