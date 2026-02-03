import React, { useState } from 'react';
import { AnalysisResult } from '../services/aiService';

interface SevenDayPlanScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
}

export const SevenDayPlanScreen: React.FC<SevenDayPlanScreenProps> = ({ handle, result, onReset }) => {
    const plan = result?.plan;
    const [copiedDay, setCopiedDay] = useState<number | null>(null);

    const copyPrompt = async (prompt: string, day: number) => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopiedDay(day);
            setTimeout(() => setCopiedDay(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!plan || plan.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center space-y-4">
                    <p className="font-mono text-xs text-subtle">NULL_PLAN_ERROR</p>
                    <button onClick={onReset} className="btn-premium">VOLTAR</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16 md:py-24">
            <div className="container max-w-4xl space-y-16">
                {/* Header */}
                <header className="space-y-4 pb-12 border-b border-light reveal">
                    <div className="inline-flex items-center gap-2">
                        <span className="font-mono text-[10px] text-accent bg-accent-soft px-2 py-0.5 rounded tracking-widest uppercase">
                            Target: @{handle}
                        </span>
                        <span className="font-mono text-[10px] text-subtle">//</span>
                        <span className="font-mono text-[10px] text-subtle uppercase tracking-widest">
                            Strategic_Reconstruction_v1.0
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                        Protocolo <span className="text-dim">de 7 Dias</span>
                    </h1>
                    <p className="text-dim max-w-lg">
                        Plano de intervenção tática para quebrar padrões psicológicos e reconstruir autoridade.
                    </p>
                </header>

                {/* Plan Days */}
                <div className="space-y-4 stagger">
                    {plan.map((item) => (
                        <div key={item.day} className="autopsy-card reveal flex flex-col md:flex-row gap-8">
                            {/* Day Number Column */}
                            <div className="md:w-32 flex-shrink-0">
                                <p className="font-mono text-[10px] text-subtle mb-1">STRAT_DAY</p>
                                <p className="text-4xl font-semibold text-accent">0{item.day}</p>
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`status-badge !rounded-none !bg-accent !text-white !border-none !px-3`}>
                                            {item.format.toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-medium leading-tight">
                                        {item.action || item.task}
                                    </h3>
                                </div>

                                <div className="space-y-3 p-6 bg-accent-soft border-l-2 border-accent">
                                    <p className="font-mono text-[10px] text-subtle">PSYCH_OBJECTIVE</p>
                                    <p className="text-sm text-dim leading-relaxed italic">
                                        "{item.why}"
                                    </p>
                                </div>

                                {/* Prompt Section */}
                                {item.prompt && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-ultra-light pb-2">
                                            <p className="font-mono text-[10px] text-subtle">CHAT_GPT_PROMPT</p>
                                            <button
                                                onClick={() => copyPrompt(item.prompt, item.day)}
                                                className={`font-mono text-[10px] px-3 py-1 border transition-all duration-300 ${copiedDay === item.day
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'border-light text-subtle hover:text-accent hover:border-accent'
                                                    }`}
                                            >
                                                {copiedDay === item.day ? 'PROMPT_COPIED' : 'COPY_PROMPT'}
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <pre className="text-xs text-subtle bg-white p-4 border border-ultra-light max-h-32 overflow-y-auto font-mono scrollbar-thin">
                                                {item.prompt}
                                            </pre>
                                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none group-hover:opacity-0 transition-opacity"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Footer */}
                <div className="pt-20 border-t border-light flex flex-col items-center gap-8 reveal">
                    <div className="text-center space-y-2">
                        <p className="font-mono text-[10px] text-subtle uppercase tracking-widest">End_of_Protocol</p>
                        <h3 className="text-lg font-medium">A execução é o único diagnóstico real.</h3>
                    </div>

                    <button onClick={onReset} className="btn-premium">
                        FINALIZAR SESSÃO E LIMPAR DADOS
                    </button>

                    <p className="font-mono text-[9px] text-subtle max-w-xs text-center">
                        AI_MODELS: LLAMA_3.3_70B // DOUG_ENGINE v4.0.2 // (c) 2026_NEURAL_AUTOPSY
                    </p>
                </div>
            </div>
        </div>
    );
};
