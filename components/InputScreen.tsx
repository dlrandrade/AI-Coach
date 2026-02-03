import React, { useState, useEffect } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string, planDays: 7 | 30) => void;
  isLoading: boolean;
}

const LOADING_STEPS = [
  "Conectando ao perfil...",
  "Analisando identidade e posicionamento...",
  "Avaliando estratégia de conteúdo...",
  "Mapeando linguagem e tom de voz...",
  "Verificando autoridade e prova social...",
  "Medindo engajamento e comunidade...",
  "Analisando conversão e monetização...",
  "Gerando diagnóstico completo..."
];

export const InputScreen: React.FC<InputScreenProps> = ({ onAnalyze, isLoading }) => {
  const [handle, setHandle] = useState('');
  const [planDays, setPlanDays] = useState<7 | 30>(7);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const stepInterval = setInterval(() => {
        setStep(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
      }, 2000);
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 1, 95));
      }, 150);
      return () => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      };
    } else {
      setStep(0);
      setProgress(0);
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim().replace('@', '');
    if (clean) onAnalyze(clean, planDays);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="container max-w-md text-center space-y-12 fade-in">
          <div className="space-y-4">
            <h2>Analisando @{handle}</h2>
            <p className="text-dim">{LOADING_STEPS[step]}</p>
          </div>
          <div className="space-y-4">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="label">{progress}%</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="container max-w-lg text-center space-y-12 fade-in">
        <header className="space-y-4">
          <p className="label text-accent">LuzzIA</p>
          <h1>Diagnóstico de Instagram</h1>
          <p className="text-dim text-lg">
            Análise completa em 6 dimensões estratégicas.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-4">
            <label className="label block text-left">Seu @ do Instagram</label>
            <div className="flex items-center gap-2">
              <span className="text-3xl text-dim">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="seu_usuario"
                className="input"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="card space-y-4">
            <label className="label block text-left">Duração do Plano</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPlanDays(7)}
                className={`h-14 border-2 font-medium transition-all ${planDays === 7
                    ? 'border-accent bg-accent text-white'
                    : 'border-[var(--border)] hover:border-[var(--dim)]'
                  }`}
              >
                7 dias
              </button>
              <button
                type="button"
                onClick={() => setPlanDays(30)}
                className={`h-14 border-2 font-medium transition-all ${planDays === 30
                    ? 'border-accent bg-accent text-white'
                    : 'border-[var(--border)] hover:border-[var(--dim)]'
                  }`}
              >
                30 dias
              </button>
            </div>
          </div>

          <button type="submit" className="btn w-full" disabled={!handle.trim()}>
            Iniciar Diagnóstico
          </button>
        </form>

        <div className="text-sm text-dim opacity-60 space-y-2">
          <p>6 Dimensões Analisadas:</p>
          <p className="text-xs">Identidade • Conteúdo • Linguagem • Autoridade • Engajamento • Conversão</p>
        </div>
      </div>
    </div>
  );
};
