import React, { useState, useEffect } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string, planDays: 7 | 30) => void;
  isLoading: boolean;
}

const LOADING_OBSERVATIONS = [
  { id: "INIT", label: "Estabelecendo conexão neural...", type: "system" },
  { id: "SCAN", label: "Lendo a bio do perfil...", type: "luzzia" },
  { id: "MM", label: "Hmm... interessante escolha de palavras.", type: "luzzia" },
  { id: "DATA", label: "Extraindo métricas ocultas...", type: "system" },
  { id: "PTRN", label: "Detectando padrão de comportamento passivo...", type: "luzzia" },
  { id: "AUTH", label: "Procurando evidências de autoridade...", type: "system" },
  { id: "MISS", label: "Você está deixando dinheiro na mesa aqui...", type: "luzzia" },
  { id: "COMP", label: "Compilando Matriz Estratégica...", type: "system" }
];

export const InputScreen: React.FC<InputScreenProps> = ({ onAnalyze, isLoading }) => {
  const [handle, setHandle] = useState('');
  const [planDays, setPlanDays] = useState<7 | 30>(7);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const stepInterval = setInterval(() => {
        setStepIndex(prev => Math.min(prev + 1, LOADING_OBSERVATIONS.length - 1));
      }, 1500);
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 1.2, 99.9));
      }, 100);
      return () => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      };
    } else {
      setStepIndex(0);
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
      <div className="min-h-screen flex items-center justify-center p-[var(--space-xl)] bg-white">
        <div className="max-w-lg w-full space-y-[var(--space-xl)]">
          <div className="card-tech space-y-[var(--space-xl)] border-t-4 border-t-[var(--green-core)]">
            <div className="flex justify-between items-end">
              <span className="micro-label" style={{ color: '#EA580C' }}>ANALISANDO</span>
              <span className="micro-label font-mono">{progress.toFixed(1)}%</span>
            </div>

            <div className="space-y-[var(--space-md)] min-h-[80px]">
              <h2 className={`text-xl ${LOADING_OBSERVATIONS[stepIndex].type === 'luzzia' ? 'text-[var(--gray-900)] italic' : 'text-[var(--gray-500)]'}`}>
                "{LOADING_OBSERVATIONS[stepIndex].label}"
              </h2>
              {LOADING_OBSERVATIONS[stepIndex].type === 'luzzia' && (
                <span className="text-xs text-[var(--green-core)] block font-medium">— LUZZIA AI</span>
              )}
            </div>

            <div className="space-y-[var(--space-md)]">
              <div className="score-track">
                <div className="score-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-[var(--gray-500)] font-mono text-xs text-center">
                ALVO: @{handle.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-[var(--space-xl)] bg-white">
      <div className="max-w-2xl w-full space-y-[var(--space-3xl)] reveal text-center">

        <header className="space-y-[var(--space-xl)]">
          <div className="flex justify-center items-center gap-[var(--space-md)]">
            <span className="tech-label">LUZZIA</span>
            <span className="w-12 h-[1px] bg-[var(--gray-300)]"></span>
            <span className="micro-label">AI ARCHITECT</span>
          </div>

          <h1 className="hero-title">
            INTELIGÊNCIA <br /> DE PERFIL
          </h1>

          <p className="text-[var(--gray-600)] text-lg max-w-lg mx-auto">
            Sistema de análise estratégica para Instagram.
            Detecta falhas de autoridade e gera correções táticas.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-[var(--space-xl)] max-w-md mx-auto">
          <div className="space-y-[var(--space-sm)] text-left">
            <label className="micro-label ml-1">IDENTIFICADOR DO ALVO</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@usuario"
              className="input-neurelic text-center"
              autoComplete="off"
            />
          </div>

          <div className="space-y-[var(--space-sm)] text-left">
            <label className="micro-label ml-1">DURAÇÃO DO PLANO</label>
            <div className="flex bg-[var(--gray-100)] rounded-[var(--radius-md)] p-1 h-14">
              <button
                type="button"
                onClick={() => setPlanDays(7)}
                className={`flex-1 rounded-[var(--radius-sm)] text-sm font-bold transition-all ${planDays === 7 ? 'bg-[var(--green-core)] text-white shadow-sm' : 'text-[var(--gray-500)] hover:text-[var(--gray-900)]'}`}
              >
                7 DIAS
              </button>
              <button
                type="button"
                onClick={() => setPlanDays(30)}
                className={`flex-1 rounded-[var(--radius-sm)] text-sm font-bold transition-all ${planDays === 30 ? 'bg-[var(--green-core)] text-white shadow-sm' : 'text-[var(--gray-500)] hover:text-[var(--gray-900)]'}`}
              >
                30 DIAS
              </button>
            </div>
          </div>

          <button type="submit" className="btn-neurelic w-full h-14 text-base" disabled={!handle.trim()}>
            INICIAR ANÁLISE
          </button>
        </form>

        <footer className="pt-[var(--space-3xl)] opacity-60">
          <a href="https://instagram.com/danielluzz" target="_blank" rel="noreferrer" className="text-[var(--gray-500)] hover:text-[var(--green-core)] font-mono text-xs transition-colors">
            Feito com ♥️ por @DanielLuzz
          </a>
        </footer>
      </div>
    </div>
  );
};
