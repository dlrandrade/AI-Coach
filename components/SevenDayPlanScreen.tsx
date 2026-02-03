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
            <div className="min-h-screen flex items-center justify-center p-6 optikka-grid">
                <div className="text-center space-y-4 reveal">
                    <p className="label-meta tracking-widest text-accent-coral">System_Error: Missing_Data_Stream</p>
                    <button onClick={onReset} className="btn-optikka">RESTART_PROCESS</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container-optikka py-10 md:py-20 space-y-20">

                {/* Meta Indicator */}
                <div className="flex justify-between items-center border-b border-technical pb-4 no-print">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="label-meta">MISSION_STRATEGY: ACTIVE</span>
                        </div>
                        <span className="label-meta opacity-30">// TARGET: @{handle}</span>
                    </div>
                    <p className="label-meta text-dim italic">Protocol_v2.0.4</p>
                </div>

                {/* Protocol Header */}
                <header className="space-y-6 reveal">
                    <div className="space-y-2">
                        <p className="label-meta text-accent-coral tracking-[0.2em]">Deployment_Sequence</p>
                        <h1 className="text-5xl md:text-7xl leading-tight">
                            Protocolo de <span className="text-accent-coral">Intervenção</span>
                        </h1>
                    </div>
                    <p className="text-dim text-xl max-w-2xl font-light leading-relaxed">
                        Execução coordenada de 7 dias desenhada para quebrar a inércia, neutralizar falhas de percepção e estabelecer um novo padrão de autoridade cirúrgica.
                    </p>
                </header>

                {/* Plan Grid */}
                <div className="border-t-2 border-soft-black reveal stagger">
                    {plan.map((item, idx) => (
                        <div
                            key={item.day}
                            className="grid md:grid-cols-[160px_1fr_420px] border-b border-technical group last:border-b-0"
                        >
                            {/* Day Identification */}
                            <div className="p-10 border-r border-technical flex flex-col justify-center items-start md:items-center space-y-1">
                                <p className="label-meta text-[10px] opacity-40">STRAT_DAY</p>
                                <p className="text-6xl font-semibold tracking-tighter leading-none">0{item.day}</p>
                            </div>

                            {/* Tactical Instruction */}
                            <div className="p-10 md:p-14 space-y-10">
                                <div className="space-y-6">
                                    <div className="inline-block bg-soft-black text-white px-4 py-1 font-mono text-[10px] tracking-widest">
                                        ACTION::{item.format.toUpperCase()}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-medium leading-tight text-soft-black max-w-lg">
                                        {item.action}
                                    </h3>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-technical">
                                    <p className="label-meta text-[10px] text-accent-coral">Strategic_Foundation</p>
                                    <p className="text-base text-dim italic leading-relaxed font-light">
                                        "{item.why}"
                                    </p>
                                </div>
                            </div>

                            {/* ChatGPT Bridge */}
                            <div className="p-10 md:p-14 bg-neutral-sand/10 md:border-l border-technical flex flex-col space-y-8">
                                <div className="flex justify-between items-center">
                                    <p className="label-meta">Instruction_Set.xml</p>
                                    <button
                                        onClick={() => copyPrompt(item.prompt, item.day)}
                                        className={`px-4 py-2 font-mono text-[10px] transition-all duration-300 flex items-center gap-2 ${copiedDay === item.day
                                                ? 'bg-green-600 text-white'
                                                : 'border border-soft-black text-soft-black hover:bg-soft-black hover:text-white'
                                            }`}
                                    >
                                        {copiedDay === item.day ? (
                                            <>
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3} /></svg>
                                                PROMPT_LOADED
                                            </>
                                        ) : 'COPY_INSTRUCTIONS'}
                                    </button>
                                </div>

                                <div className="relative flex-1 group">
                                    <div className="prompt-container h-full max-h-40 min-h-[120px] bg-white border border-technical p-6 text-[11px] leading-relaxed scrollbar-thin">
                                        {item.prompt}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-50 pointer-events-none group-hover:opacity-0 transition-opacity"></div>
                                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-neutral-sand text-[8px] font-mono opacity-40">AUTO_CONTEXT_ENABLED</div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-mono text-neutral-grey">LINK_WITH_GPT_v4_OR_CLAUDE_3</p>
                                    <p className="text-[9px] text-dim opacity-50">O prompt inclui contexto injetado baseado no seu diagnóstico.</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Closing Sequence */}
                <footer className="py-24 space-y-16 text-center border-t border-technical reveal">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <p className="label-meta text-accent-coral tracking-[0.2em]">End_of_Sequence</p>
                        <h2 className="text-4xl md:text-5xl font-medium leading-tight">
                            A diferença entre um plano e uma memória é a <span className="text-accent-coral">velocidade de execução.</span>
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center no-print">
                        <button onClick={onReset} className="btn-optikka bg-soft-black h-16 px-16">
                            REINICIAR AUTO-SCAN
                        </button>
                    </div>

                    <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl mx-auto border-t border-technical opacity-40">
                        <div className="text-left space-y-1">
                            <p className="label-meta text-[9px]">MISSION_TAG</p>
                            <p className="text-[10px] font-medium">LUZZIA_EXEC_01</p>
                        </div>
                        <div className="text-left space-y-1">
                            <p className="label-meta text-[9px]">ENCRYPTION</p>
                            <p className="text-[10px] font-medium">RSA_4096_ACTIVE</p>
                        </div>
                        <div className="text-left space-y-1">
                            <p className="label-meta text-[9px]">LATENCY</p>
                            <p className="text-[10px] font-medium">0.86ms</p>
                        </div>
                        <div className="text-left space-y-1">
                            <p className="label-meta text-[9px]">LEGAL</p>
                            <p className="text-[10px] font-medium">PROPRIETARY_SYSTEM</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
