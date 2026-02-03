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
                    <p className="label-meta">Error: Plan_Not_Found</p>
                    <button onClick={onReset} className="btn-optikka">RESTART_SYSTEM</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container-optikka py-20 space-y-24">

                {/* Protocol Header */}
                <header className="space-y-6 pb-12 border-b-2 border-soft-black reveal">
                    <div className="flex items-center gap-3">
                        <span className="label-meta text-accent-coral">LuzzIA_Action_Protocol</span>
                        <span className="text-neutral-grey opacity-20">/</span>
                        <span className="label-meta">Subject: @{handle}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl max-w-2xl">
                        Protocolo de Intervenção <span className="text-accent-coral">Tática</span>
                    </h1>
                    <p className="text-dim text-lg max-w-xl font-light">
                        Sequência estratégica de 7 dias para neutralizar falhas de autoridade e reconstruir sua presença digital.
                    </p>
                </header>

                {/* Plan Content */}
                <div className="border border-technical bg-white reveal">
                    {plan.map((item, idx) => (
                        <div
                            key={item.day}
                            className={`grid md:grid-cols-[120px_1fr_380px] border-b border-technical last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-sand/10'}`}
                        >
                            {/* Day Index */}
                            <div className="p-8 border-r border-technical flex flex-col items-center justify-center text-center">
                                <p className="label-meta text-[10px] mb-2">Day</p>
                                <p className="text-5xl font-semibold tracking-tighter">0{item.day}</p>
                            </div>

                            {/* Task Description */}
                            <div className="p-10 space-y-8 flex flex-col justify-center">
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <span className="badge-optikka !bg-soft-black !text-white !rounded-none !px-3 !py-1">
                                            {item.format.toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-medium leading-tight text-soft-black">
                                        {item.action}
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="label-meta tracking-wider text-accent-coral">Psychology_Basis</p>
                                    <p className="text-sm text-dim italic leading-relaxed">
                                        "{item.why}"
                                    </p>
                                </div>
                            </div>

                            {/* Prompt Control */}
                            <div className="p-8 bg-neutral-warm/20 border-l border-technical flex flex-col space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="label-meta">Instruction_set</p>
                                    <button
                                        onClick={() => copyPrompt(item.prompt, item.day)}
                                        className={`px-3 py-1 font-mono text-[10px] border transition-all duration-300 ${copiedDay === item.day
                                                ? 'bg-accent-coral border-accent-coral text-white'
                                                : 'border-heavy text-soft-black hover:bg-soft-black hover:text-white'
                                            }`}
                                    >
                                        {copiedDay === item.day ? 'DATA_COPIED' : 'COPY_PROMPT'}
                                    </button>
                                </div>
                                <div className="prompt-container h-full">
                                    {item.prompt}
                                </div>
                                <p className="label-meta text-[9px] opacity-40 text-center">
                                    Paste_into_ChatGPT_to_Execute
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Footer */}
                <footer className="py-20 flex flex-col items-center space-y-12 text-center reveal">
                    <div className="space-y-3">
                        <p className="label-meta text-accent-coral">Protocol_Closure</p>
                        <h2 className="text-3xl font-medium max-w-lg mx-auto">
                            A estratégia sem execução é o diagnóstico da estagnação.
                        </h2>
                    </div>

                    <div className="flex gap-6">
                        <button onClick={onReset} className="btn-optikka bg-soft-black">
                            INICIAR NOVA AUTÓPSIA
                        </button>
                    </div>

                    <div className="pt-12 flex items-center justify-center gap-10 border-t border-technical w-full max-w-xl">
                        <div className="text-left">
                            <p className="label-meta text-[9px]">ENGINE</p>
                            <p className="text-[10px] font-medium">LUZZIA_CORE_v1.0</p>
                        </div>
                        <div className="text-left">
                            <p className="label-meta text-[9px]">SECURITY</p>
                            <p className="text-[10px] font-medium">ENCRYPTED_ADRIFT</p>
                        </div>
                        <div className="text-left">
                            <p className="label-meta text-[9px]">STATUS</p>
                            <p className="text-[10px] font-medium text-green-600">MISSION_READY</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
