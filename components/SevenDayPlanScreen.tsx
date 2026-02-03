import React, { useState } from 'react';
import { AnalysisResult } from '../services/aiService';

interface SevenDayPlanScreenProps {
    handle: string;
    result: AnalysisResult | null;
    onReset: () => void;
}

const formatLabels: Record<string, string> = {
    story: 'story',
    stories: 'story',
    reel: 'reel',
    reels: 'reel',
    carrossel: 'carrossel',
    carousel: 'carrossel',
    bio: 'bio',
    destaque: 'destaque',
    feed: 'feed',
};

export const SevenDayPlanScreen: React.FC<SevenDayPlanScreenProps> = ({ handle, result, onReset }) => {
    const plan = result?.plan;
    const [expandedPrompts, setExpandedPrompts] = useState<Set<number>>(new Set());
    const [copiedDay, setCopiedDay] = useState<number | null>(null);

    const togglePrompt = (day: number) => {
        const newExpanded = new Set(expandedPrompts);
        if (newExpanded.has(day)) {
            newExpanded.delete(day);
        } else {
            newExpanded.add(day);
        }
        setExpandedPrompts(newExpanded);
    };

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted mb-4">Plano não disponível</p>
                    <button onClick={onReset} className="btn btn-primary">Voltar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 md:py-16">
            <div className="container">
                {/* Header */}
                <header className="mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="pulse-dot"></div>
                        <span className="mono text-xs text-muted">Plano personalizado</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                        Protocolo de 7 dias
                    </h1>

                    <p className="text-secondary text-sm">
                        Plano estratégico para <span className="font-medium text-primary">@{handle}</span>
                    </p>

                    <p className="mono text-xs text-muted mt-3">
                        Cada dia inclui um prompt completo para o ChatGPT gerar seu conteúdo
                    </p>
                </header>

                {/* Days */}
                <div className="space-y-4 stagger-children">
                    {plan.map((item) => {
                        const formatKey = (item.format || '').toLowerCase();
                        const formatClass = formatLabels[formatKey] || formatKey;
                        const isExpanded = expandedPrompts.has(item.day);
                        const isCopied = copiedDay === item.day;

                        return (
                            <div key={item.day} className="card">
                                {/* Day Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="mono text-2xl font-semibold text-muted">
                                        {item.day < 10 ? `0${item.day}` : item.day}
                                    </span>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {item.format && (
                                                <span className={`badge badge-format ${formatClass}`}>
                                                    {formatClass}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <p className="text-sm text-primary leading-relaxed mb-4">
                                    {item.action || item.task}
                                </p>

                                {/* Why */}
                                {item.why && (
                                    <div className="p-3 rounded-lg bg-subtle mb-4">
                                        <p className="mono text-xs text-success mb-1">Por que isso funciona</p>
                                        <p className="text-xs text-secondary">{item.why}</p>
                                    </div>
                                )}

                                {/* Prompt Section */}
                                {item.prompt && (
                                    <div className="prompt-box">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="mono text-xs text-muted">
                                                Prompt para o ChatGPT
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => togglePrompt(item.day)}
                                                    className="copy-btn"
                                                >
                                                    {isExpanded ? 'Recolher' : 'Expandir'}
                                                </button>
                                                <button
                                                    onClick={() => copyPrompt(item.prompt, item.day)}
                                                    className={`copy-btn ${isCopied ? 'copied' : ''}`}
                                                >
                                                    {isCopied ? '✓ Copiado!' : 'Copiar'}
                                                </button>
                                            </div>
                                        </div>
                                        <pre className={isExpanded ? 'max-h-none' : ''}>
                                            {item.prompt}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Info Box */}
                <div className="mt-10 p-6 rounded-xl bg-subtle border border-light animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <h3 className="text-sm font-semibold mb-2">Como usar os prompts</h3>
                    <ol className="text-xs text-secondary space-y-2">
                        <li>1. Clique em "Copiar" no prompt do dia</li>
                        <li>2. Cole no ChatGPT (ou Claude)</li>
                        <li>3. O conteúdo será gerado baseado no seu diagnóstico específico</li>
                        <li>4. Adapte conforme necessário e publique</li>
                    </ol>
                </div>

                {/* Footer Actions */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={onReset} className="btn btn-primary">
                        Nova Análise
                    </button>
                    <button onClick={onReset} className="btn btn-secondary">
                        Voltar ao início
                    </button>
                </div>

                {/* Disclaimer */}
                <footer className="mt-12 text-center">
                    <p className="mono text-xs text-subtle">
                        Este plano foi gerado por IA com base nos padrões identificados.
                        A execução consistente é essencial para resultados.
                    </p>
                </footer>
            </div>
        </div>
    );
};
