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

    return (
        <div className="min-h-screen py-16">
            <div className="container space-y-16 fade-in">

                {/* Header */}
                <header className="space-y-4">
                    <p className="label text-accent">Plano de Ação</p>
                    <h1>7 Dias para @{handle}</h1>
                    <p className="text-dim text-xl">
                        Estratégia passo a passo para reconstruir seu posicionamento.
                    </p>
                </header>

                {/* Days */}
                <div className="space-y-6">
                    {plan.map((day) => (
                        <div key={day.day} className="card space-y-6">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0 w-16 h-16 bg-[var(--bg)] flex items-center justify-center">
                                    <span className="text-3xl font-semibold">{day.day}</span>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-medium px-2 py-1 bg-[var(--black)] text-white uppercase">
                                            {day.format}
                                        </span>
                                    </div>
                                    <h3>{day.action}</h3>
                                    <p className="text-dim text-sm italic">"{day.why}"</p>
                                </div>
                            </div>

                            <div className="p-4 bg-[var(--bg)] space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="label">Prompt para ChatGPT</p>
                                    <button
                                        onClick={() => copyPrompt(day.prompt, day.day)}
                                        className={`text-xs font-medium px-3 py-1 transition-colors ${copiedDay === day.day
                                                ? 'bg-green-600 text-white'
                                                : 'bg-white border border-[var(--border)] hover:bg-[var(--black)] hover:text-white'
                                            }`}
                                    >
                                        {copiedDay === day.day ? 'Copiado!' : 'Copiar'}
                                    </button>
                                </div>
                                <p className="text-sm text-dim leading-relaxed">
                                    {day.prompt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center space-y-8 py-12 no-print">
                    <p className="text-dim">
                        Execute cada dia na ordem. Consistência é a chave.
                    </p>
                    <button onClick={onReset} className="btn px-12">
                        Nova Análise
                    </button>
                </div>
            </div>
        </div>
    );
};
