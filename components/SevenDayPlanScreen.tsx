import React, { useState } from 'react';
import { AnalysisResult } from '../services/aiService';

interface SevenDayPlanScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
}

export const SevenDayPlanScreen: React.FC<SevenDayPlanScreenProps> = ({ handle, result, onReset }) => {
    const plan = result?.plan || [];
    const [copiedDay, setCopiedDay] = useState<number | null>(null);
    const [expandedDay, setExpandedDay] = useState<number | null>(1);

    const copyPrompt = async (prompt: string, day: number) => {
        await navigator.clipboard.writeText(prompt);
        setCopiedDay(day);
        setTimeout(() => setCopiedDay(null), 2000);
    };

    if (plan.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-dim">Plano não disponível.</p>
                    <button onClick={onReset} className="btn">Voltar</button>
                </div>
            </div>
        );
    }

    // Group by week for 30-day plans
    const isLongPlan = plan.length > 7;
    const weeks = isLongPlan ? [
        { label: "Semana 1 - Fundação", days: plan.slice(0, 7) },
        { label: "Semana 2 - Conteúdo", days: plan.slice(7, 14) },
        { label: "Semana 3 - Engajamento", days: plan.slice(14, 21) },
        { label: "Semana 4 - Conversão", days: plan.slice(21, 30) }
    ] : null;

    const renderDay = (day: typeof plan[0]) => (
        <div
            key={day.day}
            className={`card cursor-pointer transition-all ${expandedDay === day.day ? 'ring-2 ring-accent' : ''}`}
            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[var(--bg)] flex items-center justify-center">
                    <span className="text-xl font-semibold">{day.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-[var(--black)] text-white uppercase">
                            {day.format}
                        </span>
                        <span className="text-xs text-dim">{day.dimension}</span>
                    </div>
                    <h3 className="text-lg">{day.action}</h3>
                    <p className="text-sm text-dim mt-1">{day.objective}</p>
                </div>
            </div>

            {expandedDay === day.day && (
                <div className="mt-6 p-4 bg-[var(--bg)] space-y-4 fade-in" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center">
                        <p className="label">Prompt para ChatGPT</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); copyPrompt(day.prompt, day.day); }}
                            className={`text-xs font-medium px-4 py-2 transition-colors ${copiedDay === day.day
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white border border-[var(--border)] hover:bg-[var(--black)] hover:text-white'
                                }`}
                        >
                            {copiedDay === day.day ? '✓ Copiado!' : 'Copiar Prompt'}
                        </button>
                    </div>
                    <p className="text-sm text-dim leading-relaxed whitespace-pre-wrap">
                        {day.prompt}
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen py-12">
            <div className="container space-y-12 fade-in">

                {/* Header */}
                <header className="space-y-4">
                    <p className="label text-accent">Plano de Ação</p>
                    <h1>{plan.length} Dias para @{handle}</h1>
                    <p className="text-dim text-xl">
                        Clique em cada dia para ver o prompt completo.
                    </p>
                </header>

                {/* Plan Content */}
                {weeks ? (
                    // 30-day view with weeks
                    <div className="space-y-12">
                        {weeks.map((week, wi) => (
                            <div key={wi} className="space-y-4">
                                <h2 className="text-xl">{week.label}</h2>
                                <div className="space-y-3">
                                    {week.days.map(renderDay)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // 7-day view
                    <div className="space-y-3">
                        {plan.map(renderDay)}
                    </div>
                )}

                {/* Footer */}
                <div className="text-center space-y-6 py-8 no-print">
                    <p className="text-dim">
                        Execute cada dia na ordem. Copie o prompt e cole no ChatGPT para gerar o conteúdo.
                    </p>
                    <button onClick={onReset} className="btn px-12">
                        Nova Análise
                    </button>
                </div>
            </div>
        </div>
    );
};
