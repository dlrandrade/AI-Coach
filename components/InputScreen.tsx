import React, { useState, useEffect } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string) => void;
  isLoading: boolean;
}

const LOADING_STEPS = [
  "Conectando ao perfil...",
  "Analisando bio e posicionamento...",
  "Escaneando últimas 12 postagens...",
  "Mapeando padrões de linguagem...",
  "Gerando diagnóstico completo..."
];

export const InputScreen: React.FC<InputScreenProps> = ({ onAnalyze, isLoading }) => {
  const [handle, setHandle] = useState('');
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const stepInterval = setInterval(() => {
        setStep(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
      }, 2500);
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 95));
      }, 200);
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
    if (clean) onAnalyze(clean);
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
      <div className="container max-w-lg text-center space-y-16 fade-in">
        <header className="space-y-6">
          <p className="label text-accent">LuzzIA</p>
          <h1>Autópsia de Posicionamento</h1>
          <p className="text-dim text-lg">
            Descubra o que está travando o crescimento do seu perfil no Instagram.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="card space-y-6">
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
          <button type="submit" className="btn w-full" disabled={!handle.trim()}>
            Iniciar Análise
          </button>
        </form>

        <p className="text-sm text-dim opacity-60">
          Análise baseada em padrões de posicionamento estratégico.
        </p>
      </div>
    </div>
  );
};
