import React, { useState, useEffect } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string) => void;
  isLoading: boolean;
}

const LOADING_STEPS = [
  { label: "INDEXING", desc: "Varrendo banco de dados @handle", progress: 15 },
  { label: "VISUAL_SCAN", desc: "Analisando consistência visual dos últimos posts", progress: 35 },
  { label: "LINGUISTIC_AUDIT", desc: "Lendo legendas e padrões de linguagem na Bio", progress: 55 },
  { label: "NEURAL_MAPPING", desc: "Correlacionando nicho com gatilhos de autoridade", progress: 80 },
  { label: "REPORT_GEN", desc: "Finalizando diagnóstico técnico LuzzIA", progress: 95 }
];

export const InputScreen: React.FC<InputScreenProps> = ({ onAnalyze, isLoading }) => {
  const [handle, setHandle] = useState('');
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setStepIndex(0);
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = handle.trim().replace('@', '');
    if (cleanHandle) {
      onAnalyze(cleanHandle);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 optikka-grid">
        <div className="w-full max-w-md space-y-12 reveal text-center">
          <div className="space-y-2">
            <p className="label-meta">Status: Analysis_In_Progress</p>
            <h2 className="text-3xl font-medium">LuzzIA Escaneando @{handle}...</h2>
          </div>

          <div className="space-y-6">
            <div className="step-bar">
              <div
                className="step-inner"
                style={{ width: `${LOADING_STEPS[stepIndex].progress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 text-left gap-4">
              <div className="space-y-1">
                <p className="label-meta">{LOADING_STEPS[stepIndex].label}</p>
                <p className="text-sm text-dim">{LOADING_STEPS[stepIndex].desc}</p>
              </div>
              <div className="text-right flex items-end justify-end">
                <p className="text-2xl font-mono font-light tracking-tighter">
                  {LOADING_STEPS[stepIndex].progress}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 optikka-grid">
      <div className="container-optikka w-full flex flex-col items-center space-y-20 reveal">

        {/* Header Section */}
        <header className="text-center space-y-10">
          <div className="space-y-2">
            <p className="label-meta">LuzzIA // Technical Positioning System</p>
            <h1 className="max-w-xl mx-auto">
              Autópsia de Posicionamento Estratégico
            </h1>
          </div>

          <p className="text-dim text-lg max-w-sm mx-auto">
            Identifique os pontos cegos que impedem seu perfil de converter autoridade em negócio.
          </p>
        </header>

        {/* Main Action Area */}
        <div className="w-full max-w-xl space-y-8 bg-white p-12 border border-heavy">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-4">
              <label className="label-meta pb-2 block border-b border-technical">Target Profile Handle</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-light text-neutral-grey opacity-30">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="seu_usuario"
                  className="optikka-input pl-8"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="label-meta text-[9px] max-w-[200px] leading-relaxed">
                A análise processa padrões neurais e comportamentais do perfil alvo.
              </p>
              <button
                type="submit"
                className="btn-optikka"
                disabled={!handle.trim()}
              >
                INICIAR AUTÓPSIA
              </button>
            </div>
          </form>
        </div>

        {/* Footer Meta */}
        <footer className="w-full max-w-xl flex justify-between border-t border-technical pt-8 italic">
          <p className="label-meta text-[9px]">Build 1.0.4 // OPTIKKA SYSTEM</p>
          <p className="label-meta text-[9px]">LuzzIA Engine Active</p>
        </footer>
      </div>
    </div>
  );
};
