import React, { useState } from 'react';
import { AnalysisResult, PlanDay } from '../services/aiService';

interface SevenDayPlanScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
    isLoadingPlan: boolean; // Prop to trigger loading state
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

    // ChatGPT Deep Link Generator
    const getChatGPTLink = (prompt: string) => {
        return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
    };

    if (isLoadingPlan) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--black-absolute)]">
                <div className="text-center space-y-6 animate-pulse">
                    <h2 className="text-2xl text-[var(--green-core)] font-mono">ARQUITETANDO ESTRATÉGIA...</h2>
                    <p className="text-[var(--gray-muted)]">A LuzzIA está desenhando seu plano de {plan.length || '30'} dias.</p>
                    <div className="w-16 h-1 bg-[var(--green-core)] mx-auto rounded-full"></div>
                </div>
            </div>
        );
    }

    if (plan.length === 0) return null;

    // Grouping logic for layout
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
                className={`card-tech p-0 overflow-hidden cursor-pointer group transition-all duration-300 ${isExpanded ? 'ring-1 ring-[var(--green-core)] bg-[var(--black-deep)]' : 'hover:bg-[var(--black-panel)]'}`}
                onClick={() => setExpandedDay(isExpanded ? null : day.day)}
            >
                {/* Header Row */}
                <div className="flex items-stretch min-h-[80px]">
                    <div className="w-20 bg-[var(--black-absolute)] border-r border-[var(--gray-dark)] flex flex-col items-center justify-center font-mono relative">
                        <span className="text-[var(--gray-muted)] text-[10px]">DIA</span>
                        <span className={`text-2xl font-bold ${isExpanded ? 'text-[var(--green-core)]' : 'text-white'}`}>
                            {day.day.toString().padStart(2, '0')}
                        </span>
                        {isExpanded && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--green-core)]"></div>}
                    </div>

                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex gap-2 items-center">
                                <span className="tech-label text-[10px] py-1 px-2 uppercase">{day.format}</span>
                                <span className="micro-label text-[var(--gray-muted)] uppercase">{day.dimension}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white leading-tight">{day.action}</h3>
                        </div>

                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[var(--green-core)]' : 'text-[var(--gray-dark)]'}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Expanded Content */}
                <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden border-t border-[var(--gray-dark)] bg-[var(--black-absolute)]">
                        <div className="p-8 grid md:grid-cols-[1fr_2fr] gap-8">

                            <div className="space-y-6">
                                <div>
                                    <span className="micro-label text-[var(--orange-action)]">OBJETIVO ESTRATÉGICO</span>
                                    <p className="text-[var(--gray-light)] mt-2 font-light italic leading-relaxed">
                                        "{day.objective}"
                                    </p>
                                </div>

                                {day.example && (
                                    <div>
                                        <span className="micro-label text-[var(--green-core)]">SIMULAÇÃO DE APLICAÇÃO</span>
                                        <div className="mt-2 p-3 bg-[var(--black-panel)] border-l-2 border-[var(--green-core)] text-sm text-[var(--gray-light)] font-mono">
                                            {day.example}
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 border border-[var(--gray-dark)] rounded-lg bg-[var(--black-deep)]">
                                    <span className="micro-label text-[var(--green-muted)]">NOTA DO SISTEMA</span>
                                    <p className="text-xs text-[var(--gray-muted)] mt-1 font-mono">
                                        Preencha os campos em [COLCHETES] no prompt para máxima precisão.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-wrap justify-between items-center gap-2">
                                    <span className="micro-label">PROMPT GENERATIVO</span>
                                    <div className="flex gap-2">
                                        <a
                                            href={getChatGPTLink(day.prompt)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="btn-outline h-8 px-4 text-[10px] flex items-center gap-2 rounded-full hover:bg-[var(--green-muted)] hover:text-white transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.4,3H3.6C1.6,3,0,4.6,0,6.6v10.8c0,2,1.6,3.6,3.6,3.6h8.4l4.8,4.8l0.8-4.8H20.4c2,0,3.6-1.6,3.6-3.6V6.6C24,4.6,22.4,3,20.4,3z" /></svg>
                                            ABRIR NO CHATGPT
                                        </a>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyPrompt(day.prompt, day.day); }}
                                            className={`btn-neurelic h-8 px-4 text-[10px] ${copiedDay === day.day ? 'bg-[var(--white)] text-black' : ''}`}
                                        >
                                            {copiedDay === day.day ? 'COPIADO!' : 'COPIAR PROMPT'}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-[var(--black-panel)] border border-[var(--gray-dark)] rounded-lg p-5 font-mono text-sm text-[var(--gray-light)] leading-relaxed h-[180px] overflow-y-auto custom-scrollbar relative group">
                                    {day.prompt}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--black-panel)] to-transparent pointer-events-none opacity-50"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[var(--black-absolute)] py-20 pb-40">
            <div className="container-neurelic space-y-20 reveal">

                <header className="flex flex-col md:flex-row justify-between items-end gap-8 pb-8 border-b border-[var(--gray-dark)]">
                    <div className="space-y-4">
                        <span className="tech-label">MODO DE EXECUÇÃO</span>
                        <h1 className="hero-title text-5xl md:text-7xl text-white">
                            PLANO DE <br /> AÇÃO
                        </h1>
                    </div>
                    <div className="text-right space-y-2">
                        <p className="micro-label">DURAÇÃO DO ALVO</p>
                        <p className="text-4xl font-mono text-[var(--green-core)]">{plan.length} DIAS</p>
                    </div>
                </header>

                <div className="space-y-16">
                    {weekGroups.map((group, i) => (
                        <div key={i} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-[var(--green-core)] rounded-full"></div>
                                <h2 className="text-xl font-mono text-[var(--gray-muted)] tracking-widest">{group.label}</h2>
                                <div className="h-[1px] flex-1 bg-[var(--gray-dark)]"></div>
                            </div>
                            <div className="space-y-4">
                                {group.days.map(day => <PlanCard key={day.day} day={day} />)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 w-full bg-[var(--black-absolute)] border-t border-[var(--gray-dark)] py-6 z-50">
                    <div className="container-neurelic flex flex-col md:flex-row justify-between items-center gap-4">

                        <a href="https://instagram.com/danielluzz" target="_blank" rel="noreferrer" className="text-[var(--gray-muted)] hover:text-[var(--green-core)] font-mono text-xs transition-colors">
                            Feito com ♥️ por @DanielLuzz
                        </a>

                        <a href="https://github.com/dlrandrade/AI-Coach" target="_blank" rel="noreferrer" className="hidden md:block text-[var(--gray-muted)] font-mono text-xs">
                            SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <button onClick={onReset} className="btn-outline h-12 px-8 rounded-full text-xs font-bold uppercase w-full md:w-auto">
                            REINICIAR MISSÃO
                        </button>
                    </div>
                </div>
            </div>

        </div>
        </div >
    );
};
