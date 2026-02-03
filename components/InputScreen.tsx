import React, { useState, useEffect } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string, planDays: 7 | 30) => void;
  isLoading: boolean;
}

const LOADING_OBSERVATIONS = [
  { label: "Estabelecendo conexão neural...", type: "system" },
  { label: "Lendo a bio do perfil...", type: "luzzia" },
  { label: "Hmm... interessante escolha de palavras.", type: "luzzia" },
  { label: "Extraindo métricas ocultas...", type: "system" },
  { label: "Detectando padrão de comportamento...", type: "luzzia" },
  { label: "Procurando evidências de autoridade...", type: "system" },
  { label: "Você está deixando dinheiro na mesa aqui...", type: "luzzia" },
  { label: "Compilando Matriz Estratégica...", type: "system" }
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
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-white">
        <div className="w-full max-w-md">
          {/* No card, no shadow - just clean content */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <span className="micro-label" style={{ color: '#EA580C' }}>ANALISANDO</span>
              <span className="font-mono text-sm text-gray-400">{progress.toFixed(0)}%</span>
            </div>

            <div className="min-h-[100px] space-y-3">
              <p className={`text-2xl leading-relaxed ${LOADING_OBSERVATIONS[stepIndex].type === 'luzzia' ? 'text-gray-900 italic' : 'text-gray-500'}`}>
                "{LOADING_OBSERVATIONS[stepIndex].label}"
              </p>
              {LOADING_OBSERVATIONS[stepIndex].type === 'luzzia' && (
                <span className="text-sm text-green-600 font-medium">— LUZZIA</span>
              )}
            </div>

            <div className="space-y-4 pt-4">
              <div className="score-track">
                <div className="score-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-center text-gray-400 font-mono text-xs tracking-wider">
                ALVO: @{handle.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-white">
      <div className="w-full max-w-lg text-center space-y-16 reveal">

        {/* Header */}
        <header className="space-y-8">
          <div className="flex justify-center items-center gap-4">
            <span className="tech-label">LUZZIA</span>
            <span className="w-8 h-px bg-gray-300"></span>
            <span className="micro-label">AI ARCHITECT</span>
          </div>

          <h1 className="hero-title">
            INTELIGÊNCIA<br />DE PERFIL
          </h1>

          <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
            Sistema de análise estratégica para Instagram.
            Detecta falhas de autoridade e gera correções táticas.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3 text-left">
            <label className="micro-label block">IDENTIFICADOR DO ALVO</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@usuario"
              className="input-neurelic text-center"
              autoComplete="off"
            />
          </div>

          <div className="space-y-3 text-left">
            <label className="micro-label block">DURAÇÃO DO PLANO</label>
            <div className="flex bg-gray-100 rounded-xl p-1.5 h-14">
              <button
                type="button"
                onClick={() => setPlanDays(7)}
                className={`flex-1 rounded-lg text-sm font-bold transition-all ${planDays === 7 ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                7 DIAS
              </button>
              <button
                type="button"
                onClick={() => setPlanDays(30)}
                className={`flex-1 rounded-lg text-sm font-bold transition-all ${planDays === 30 ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                30 DIAS
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="btn-neurelic w-full" disabled={!handle.trim()}>
              INICIAR ANÁLISE
            </button>
          </div>
        </form>

        {/* Footer */}
        <footer className="pt-8">
          <a href="https://instagram.com/danielluzz" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-600 text-sm transition-colors">
            Feito com ♥️ por @DanielLuzz
          </a>
        </footer>
      </div>
    </div>
  );
};
