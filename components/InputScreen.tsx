import React, { useState, useEffect } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string, planDays: 7 | 30) => void;
  isLoading: boolean;
}

const LOADING_OBSERVATIONS = [
  { id: "INIT", label: "Estabelecendo link neural...", type: "system" },
  { id: "SCAN", label: "Lendo a bio do perfil...", type: "luzzia" },
  { id: "MM", label: "Hmm... interessante escolha de palavras.", type: "luzzia" },
  { id: "DATA", label: "Extraindo métricas ocultas...", type: "system" },
  { id: "PTRN", label: "Detectando padrão de comportamento passivo...", type: "luzzia" },
  { id: "AUTH", label: "Procurando evidências de autoridade...", type: "system" },
  { id: "MISS", label: "Você está deixando dinheiro na mesa aqui...", type: "luzzia" },
  { id: "COMP", label: "Compilando Matriz Estratégica v5.0...", type: "system" }
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--black-absolute)] relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#0FB355 1px, transparent 1px), linear-gradient(90deg, #0FB355 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="container-neurelic max-w-lg w-full relative z-10">
          <div className="card-tech space-y-8 border-t-4 border-t-[var(--green-core)]">
            <div className="flex justify-between items-end">
              <span className="micro-label text-[var(--orange-action)] animate-pulse">SISTEMA ATIVO</span>
              <span className="micro-label font-mono">{progress.toFixed(1)}%</span>
            </div>

            <div className="space-y-4">
              <div className="min-h-[60px]">
                <h2 className={`text-xl font-mono ${LOADING_OBSERVATIONS[stepIndex].type === 'luzzia' ? 'text-[var(--white)] italic' : 'text-[var(--gray-muted)]'}`}>
                  "{LOADING_OBSERVATIONS[stepIndex].label}"
                </h2>
                {LOADING_OBSERVATIONS[stepIndex].type === 'luzzia' && (
                  <span className="text-xs text-[var(--green-core)] block mt-1">-- LUZZIA AI ARCHITECT</span>
                )}
              </div>
              <p className="text-dim font-mono text-xs">
                ALVO: @{handle.toUpperCase()}
              </p>
            </div>

            <div className="space-y-4">
              <div className="score-track h-2 bg-[var(--black-panel)]">
                <div className="score-fill bg-[var(--green-core)] relative overflow-hidden" style={{ width: `${progress}%` }}>
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_1s_infinite]"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-[var(--gray-dark)]">
                <span>ID: {LOADING_OBSERVATIONS[stepIndex].id}</span>
                <span className="col-span-2 text-center text-[var(--green-core)]">PROCESSANDO...</span>
                <span className="text-right">V.5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--black-absolute)] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--green-core)] to-transparent opacity-50"></div>

      <div className="container-neurelic max-w-3xl w-full relative z-10 space-y-16 reveal flex flex-col items-center text-center">

        <header className="space-y-6 w-full flex flex-col items-center">
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="tech-label">NEURELIC-008</span>
            <span className="w-16 h-[1px] bg-[var(--gray-dark)]"></span>
            <span className="micro-label">SISTEMA DE DIAGNÓSTICO</span>
          </div>

          <h1 className="hero-title text-center">
            INTELIGÊNCIA <br /> DE PERFIL
          </h1>

          <p className="text-dim text-lg max-w-xl mx-auto border-l-2 border-[var(--green-core)] pl-6 text-left font-light">
            Sistema neural de análise estratégica para Instagram.
            Detecta falhas de autoridade e processa correções táticas.
            <br />
            <span className="text-[var(--green-muted)] text-sm mt-2 block">Arquiteta: LuzzIA AI</span>
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-xl mx-auto">
          <div className="grid md:grid-cols-[1fr_200px] gap-6 w-full">
            <div className="space-y-2 text-left">
              <label className="micro-label ml-1">IDENTIFICADOR DO ALVO</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@USUARIO"
                className="input-neurelic text-center md:text-left"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="micro-label ml-1">LINHA DO TEMPO</label>
              <div className="flex bg-[var(--black-panel)] rounded-xl p-1 border border-[var(--gray-dark)] h-[64px]">
                <button
                  type="button"
                  onClick={() => setPlanDays(7)}
                  className={`flex-1 rounded-lg text-sm font-bold transition-all ${planDays === 7 ? 'bg-[var(--green-core)] text-black' : 'text-[var(--gray-muted)] hover:text-white'}`}
                >
                  7D
                </button>
                <button
                  type="button"
                  onClick={() => setPlanDays(30)}
                  className={`flex-1 rounded-lg text-sm font-bold transition-all ${planDays === 30 ? 'bg-[var(--green-core)] text-black' : 'text-[var(--gray-muted)] hover:text-white'}`}
                >
                  30D
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-neurelic w-full h-16 text-lg" disabled={!handle.trim()}>
            <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
            INICIAR VARREDURA
          </button>

        </form>

        <footer className="pt-20 opacity-40 flex flex-col md:flex-row justify-between items-center w-full font-mono text-[10px] text-[var(--gray-muted)] gap-4 md:gap-0">
          <div className="text-center md:text-left space-y-1">
            <p>SYS.VER: 5.0.0</p>
            <p>CORE: LLAMA-3</p>
          </div>

          <a href="https://instagram.com/danielluzz" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[var(--green-core)] transition-colors">
            <span>Feito com ♥️ por @DanielLuzz</span>
          </a>

          <div className="text-center md:text-right space-y-1">
            <p>CONEXÃO SEGURA</p>
            <p>ENCRIPTADO</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
