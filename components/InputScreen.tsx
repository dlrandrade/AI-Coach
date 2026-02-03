import React, { useState, useEffect } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string, planDays: 7 | 30) => void;
  isLoading: boolean;
}

const LOADING_STEPS = [
  { id: "INIT", label: "INITIALIZING_NEURAL_LINK" },
  { id: "SCAN", label: "SCANNING_PROFILE_ARCHITECTURE" },
  { id: "DATA", label: "EXTRACTING_Q1_METRICS" },
  { id: "NLP", label: "PROCESSING_LINGUISTIC_PATTERNS" },
  { id: "AUTH", label: "MEASURING_AUTHORITY_SIGNAL" },
  { id: "ENG", label: "CALCULATING_ENGAGEMENT_VECTOR" },
  { id: "CONV", label: "ANALYZING_CONVERSION_FUNNEL" },
  { id: "GEN", label: "COMPILING_DIAGNOSTIC_MATRIX" }
];

export const InputScreen: React.FC<InputScreenProps> = ({ onAnalyze, isLoading }) => {
  const [handle, setHandle] = useState('');
  const [planDays, setPlanDays] = useState<7 | 30>(7);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const stepInterval = setInterval(() => {
        setStepIndex(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
      }, 1000);
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 1.5, 99.9));
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
              <span className="micro-label text-[var(--orange-action)] animate-pulse">SYSTEM_ACTIVE</span>
              <span className="micro-label font-mono">{progress.toFixed(1)}%</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-mono text-[var(--white)]">
                {LOADING_STEPS[stepIndex].label}
              </h2>
              <p className="text-dim font-mono text-xs">
                TARGET: @{handle.toUpperCase()}
              </p>
            </div>

            <div className="space-y-4">
              <div className="score-track h-2 bg-[var(--black-panel)]">
                <div className="score-fill bg-[var(--green-core)] relative overflow-hidden" style={{ width: `${progress}%` }}>
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_1s_infinite]"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-[var(--gray-dark)]">
                <span>ID: {LOADING_STEPS[stepIndex].id}</span>
                <span className="col-span-2 text-center text-[var(--green-core)]">PROCESSING...</span>
                <span className="text-right">V.4.0</span>
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

      <div className="container-neurelic max-w-3xl w-full relative z-10 text-center space-y-16 reveal">

        <header className="space-y-6">
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="tech-label">NEURELIC-008</span>
            <span className="w-16 h-[1px] bg-[var(--gray-dark)]"></span>
            <span className="micro-label">DIAGNOSTIC SYSTEM</span>
          </div>

          <h1 className="hero-title">
            PROFILING <br /> INTELLIGENCE
          </h1>

          <p className="text-dim text-lg max-w-xl mx-auto border-l-2 border-[var(--green-core)] pl-6 text-left font-light">
            Sistema neural de análise estratégica para Instagram.
            Detecta falhas de autoridade e processa correções táticas.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-[1fr_200px] gap-6 max-w-2xl mx-auto">
            <div className="space-y-2 text-left">
              <label className="micro-label ml-1">TARGET IDENTIFIER</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@USERNAME"
                className="input-neurelic"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="micro-label ml-1">TIMELINE</label>
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

          <button type="submit" className="btn-neurelic w-full max-w-md h-16 text-lg" disabled={!handle.trim()}>
            <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
            INICIAR VARREDURA
          </button>

        </form>

        <footer className="pt-20 opacity-30 flex justify-between items-end font-mono text-[10px] text-[var(--gray-muted)]">
          <div className="text-left space-y-1">
            <p>SYS.VER: 4.0.2</p>
            <p>CORE: LLAMA-3</p>
          </div>
          <div className="text-right space-y-1">
            <p>SECURE CONN</p>
            <p>ENCRYPTED</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
