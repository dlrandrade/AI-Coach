import React from 'react';
import { AnalysisResult } from '../services/aiService';

interface SevenDayPlanScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
}

export const SevenDayPlanScreen: React.FC<SevenDayPlanScreenProps> = ({ handle, result, onReset }) => {
    // Use AI-generated plan if available, otherwise show message
    const plan = result?.plan;

    const verdictColor = result?.verdict.includes('POSICIONAMENTO') ? 'text-red-500' :
        result?.verdict.includes('ALCANCE') ? 'text-yellow-500' : 'text-blue-500';

    if (!plan || plan.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-gray-400 font-mono mb-4">Plano não disponível</p>
                    <button onClick={onReset} className="brutal-btn">VOLTAR</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto pb-24">
            <header className="mb-12 border-b-2 border-white pb-6">
                <h2 className="text-xs font-mono text-gray-400">PLANO TÁTICO PERSONALIZADO</h2>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
                    PROTOCOLO: 7 DIAS
                </h1>
                <p className="mt-2 font-mono text-sm text-gray-300">
                    Plano exclusivo para <span className="text-white font-bold">@{handle}</span>
                </p>
                <p className={`mt-1 font-mono text-sm ${verdictColor}`}>
                    FOCO: {result?.verdict || "RECONSTRUÇÃO TOTAL"}
                </p>
                <p className="mt-4 text-xs font-mono text-gray-600 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Plano gerado por IA • Baseado no seu diagnóstico
                </p>
            </header>

            <div className="space-y-6">
                {plan.map((item) => (
                    <div key={item.day} className="border-2 border-gray-800 p-4 md:p-6 hover:border-white transition-colors duration-300 group">
                        <div className="flex flex-col md:flex-row gap-4 md:items-start">
                            <div className="md:w-20 shrink-0">
                                <span className="text-4xl font-bold text-gray-700 group-hover:text-white transition-colors font-mono">
                                    {item.day < 10 ? `0${item.day}` : item.day}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold uppercase text-white mb-3">{item.title}</h3>
                                <p className="font-mono text-sm text-gray-300 leading-relaxed mb-4">
                                    {item.task}
                                </p>

                                {/* Justificativa do dia */}
                                {item.why && (
                                    <div className="pt-3 border-t border-gray-800">
                                        <p className="text-xs font-mono text-gray-500 flex items-start gap-2">
                                            <span className="text-green-600">→</span>
                                            <span className="italic">{item.why}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center space-y-6">
                <div className="border border-gray-800 p-6 bg-gray-900/50">
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">
                        LEMBRETE FINAL
                    </p>
                    <p className="font-mono text-sm text-red-500">
                        Este plano foi criado especificamente para @{handle} com base nos problemas identificados.
                        Cada dia ataca uma fraqueza específica. Não pule etapas.
                    </p>
                </div>

                <button
                    onClick={onReset}
                    className="brutal-btn w-full md:w-auto bg-white text-black hover:bg-red-600 hover:text-white border-none"
                >
                    ENCERRAR SESSÃO
                </button>
            </div>
        </div>
    );
};
