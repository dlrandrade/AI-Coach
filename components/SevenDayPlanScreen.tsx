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
                <div className="text-center space-y-6 reveal">
                    <span className="label-meta text-accent-coral">System_Error: Missing_Data_Stream</span>
                    <button onClick={onReset} className="btn-optikka">RESTART_PROCESS</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container-optikka py-16 space-y-20">

                {/* 1. Technical Info Bar */}
                <div className="flex justify-between items-center border-y border-technical py-4 no-print">
                    <div className="flex gap-10">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="label-meta">Strategy_Deployment: ACTIVE</span>
                        </div>
                        <span className="label-meta opacity-30">// SUBJECT: @{handle}</span>
                    </div>
                    <span className="label-meta opacity-50 font-mono">LuzzIA_v2.1_Stable</span>
                </div>

                {/* 2. Header Section */}
                <header className="space-y-8 reveal">
                    <div className="space-y-2">
                        <span className="label-meta text-accent-coral tracking-[0.2em]">Action_Protocol</span>
                        <h1 className="text-soft-black max-w-3xl">Protocolo de Intervenção <span className="opacity-40 italic">Tática</span></h1>
                    </div>
                    <p className="text-dim text-2xl max-w-2xl font-light leading-relaxed">
                        Sequência estratégica de 7 dias desenhada para quebrar a inércia e estabelecer autoridade clínica no seu nicho.
                    </p>
                </header>

                {/* 3. The Central Strategy Grid */}
                <div className="border border-technical bg-white reveal">
                    {plan.map((item, idx) => (
                        <div
                            key={item.day}
                            className="grid md:grid-cols-[160px_1fr_420px] border-b border-technical last:border-b-0 group"
                        >
                            {/* Col 1: Chronology */}
                            <div className="p-10 border-r border-technical flex flex-col justify-center items-center bg-neutral-sand/10">
                                <span className="label-meta opacity-40 mb-2">Strat_Day</span>
                                <span className="text-7xl font-semibold tracking-tighter text-soft-black">0{item.day}</span>
                            </div>

                            {/* Col 2: Tactical Instruction */}
                            <div className="p-10 md:p-14 space-y-12">
                                <div className="space-y-6">
                                    <div className="inline-block px-3 py-1 bg-soft-black text-white label-meta text-[9px]">
                                        FORMAT::{item.format.toUpperCase()}
                                    </div>
                                    <h3 className="text-3xl font-medium text-soft-black leading-snug">
                                        {item.action}
                                    </h3>
                                </div>
                                <div className="space-y-3 pt-6 border-t border-technical">
                                    <span className="label-meta text-accent-coral">Psychology_Anchor</span>
                                    <p className="text-base text-dim italic leading-relaxed font-light">
                                        "{item.why}"
                                    </p>
                                </div>
                            </div>

                            {/* Col 3: ChatGPT Bridge */}
                            <div className="p-10 md:p-14 bg-neutral-sand/20 md:border-l border-technical flex flex-col justify-between space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="label-meta">Instruction_Set</span>
                                        <button
                                            onClick={() => copyPrompt(item.prompt, item.day)}
                                            className={`px-4 py-2 font-mono text-[10px] border transition-all duration-300 flex items-center gap-2 ${copiedDay === item.day
                                                    ? 'bg-green-600 border-green-600 text-white'
                                                    : 'border-soft-black text-soft-black hover:bg-soft-black hover:text-white'
                                                }`}
                                        >
                                            {copiedDay === item.day ? 'DATA_COPIED' : 'COPY_INSTRUCTIONS'}
                                        </button>
                                    </div>
                                    <div className="h-40 bg-white border border-technical p-5 text-[11px] font-mono leading-relaxed overflow-y-auto no-scrollbar opacity-60 group-hover:opacity-100 transition-opacity">
                                        {item.prompt}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="label-meta text-[9px] opacity-40">GPT_Context_Engine</span>
                                    <p className="text-[10px] text-dim opacity-50 font-mono">:: Injecting Forensic Metadata into AI Prompt...</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 4. Sequence Closure */}
                <footer className="py-24 space-y-16 text-center reveal" style={{ animationDelay: '0.4s' }}>
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <span className="label-meta text-accent-coral tracking-[0.2em]">Protocol_Closure</span>
                        <h2 className="text-4xl italic font-medium leading-tight">
                            "A diferença entre estratégia e ilusão é a velocidade de execução."
                        </h2>
                    </div>

                    <div className="flex justify-center no-print">
                        <button onClick={onReset} className="btn-optikka bg-soft-black px-16 h-16 text-lg">
                            REINICIAR AUTO-SCAN
                        </button>
                    </div>

                    <div className="pt-16 border-t border-technical grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30 text-left">
                        <div className="space-y-1">
                            <span className="label-meta">Security</span>
                            <span className="text-[10px] font-medium">AES_256_ACTIVE</span>
                        </div>
                        <div className="space-y-1">
                            <span className="label-meta">Validation</span>
                            <span className="text-[10px] font-medium">LUZZIA_INTERNAL</span>
                        </div>
                        <div className="space-y-1">
                            <span className="label-meta">System</span>
                            <span className="text-[10px] font-medium">DEPLOY_TAG_04</span>
                        </div>
                        <div className="space-y-1">
                            <span className="label-meta">Stability</span>
                            <span className="text-[10px] font-medium">99.98%_UP</span>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
};
