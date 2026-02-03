import React, { useState, useEffect } from 'react';

interface HistoryItem {
  handle: string;
  intensity: 'SURGICAL' | 'LETHAL';
  timestamp: string;
  result: any;
}

interface InputScreenProps {
  onAnalyze: (handle: string, intensity: 'SURGICAL' | 'LETHAL') => void;
  isLoading: boolean;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
}

const LOADING_STEPS = [
  { label: "INDEXING", desc: "Varrendo banco de dados @handle", progress: 15 },
  { label: "VISUAL_SCAN", desc: "Analisando consistência visual dos últimos posts", progress: 35 },
  { label: "LINGUISTIC_AUDIT", desc: "Lendo legendas e padrões de linguagem na Bio", progress: 55 },
  { label: "NEURAL_MAPPING", desc: "Correlacionando nicho com gatilhos de autoridade", progress: 80 },
  { label: "REPORT_GEN", desc: "Finalizando diagnóstico técnico LuzzIA", progress: 95 }
];

export const InputScreen: React.FC<InputScreenProps> = ({ onAnalyze, isLoading, history, onLoadHistory }) => {
  const [handle, setHandle] = useState('');
  const [intensity, setIntensity] = useState<'SURGICAL' | 'LETHAL'>('SURGICAL');
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2500);
      return () => clearInterval(interval);
    } else {
      setStepIndex(0);
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = handle.trim().replace('@', '');
    if (cleanHandle) {
      onAnalyze(cleanHandle, intensity);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 optikka-grid">
        <div className="w-full max-w-md space-y-12 reveal text-center">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-accent-coral/10 text-accent-coral label-meta text-[10px] border border-accent-coral/20">
              Protocolo: {intensity}
            </div>
            <h2 className="text-3xl font-medium tracking-tight">LuzzIA Escaneando @{handle}...</h2>
          </div>

          <div className="space-y-8 bg-white p-10 border border-technical shadow-sm">
            <div className="step-bar">
              <div
                className="step-inner"
                style={{ width: `${LOADING_STEPS[stepIndex].progress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-1 text-left gap-6">
              <div className="space-y-2">
                <p className="label-meta text-accent-coral">{LOADING_STEPS[stepIndex].label}</p>
                <p className="text-sm text-dim font-light leading-relaxed h-10">{LOADING_STEPS[stepIndex].desc}</p>
              </div>
              <div className="pt-4 border-t border-technical flex justify-between items-center">
                <p className="label-meta text-dim opacity-50">Precision_Sync</p>
                <p className="text-3xl font-mono font-light tracking-tighter">
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
      <div className="container-optikka w-full flex flex-col items-center space-y-16 reveal">

        {/* Header Section */}
        <header className="text-center space-y-6">
          <div className="space-y-3">
            <p className="label-meta">LuzzIA // Neural Forensic Engine</p>
            <h1 className="max-w-2xl mx-auto text-5xl md:text-6xl tracking-[ -0.05em]">
              Autópsia de <span className="text-accent-coral">Posicionamento</span>
            </h1>
          </div>

          <p className="text-dim text-lg max-w-md mx-auto font-light leading-relaxed">
            Sistema técnico de análise de falhas estruturais de autoridade para profissionais de alto nível.
          </p>
        </header>

        <div className="w-full max-w-3xl grid md:grid-cols-[1fr_280px] gap-px bg-technical border border-technical shadow-md">
          {/* Main Action Area */}
          <div className="bg-white p-12 space-y-12">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-6">
                <label className="label-meta pb-2 block border-b border-technical">Target Profile Handle</label>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-light text-neutral-grey opacity-20">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="usuário"
                    className="optikka-input pl-10 text-3xl h-16 border-none"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="label-meta pb-2 block border-b border-technical">Intensity Protocol</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setIntensity('SURGICAL')}
                    className={`h-12 border font-medium transition-all ${intensity === 'SURGICAL' ? 'bg-soft-black text-white border-soft-black' : 'border-technical text-dim hover:border-heavy'}`}
                  >
                    SURGICAL
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntensity('LETHAL')}
                    className={`h-12 border font-medium transition-all ${intensity === 'LETHAL' ? 'bg-accent-coral text-white border-accent-coral' : 'border-technical text-dim hover:border-heavy'}`}
                  >
                    LETHAL
                  </button>
                </div>
                <p className="text-[10px] text-dim opacity-60 font-mono italic">
                  * LETHAL protocol removes all empathy filters. High ego risk.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="btn-optikka w-full h-14 text-lg"
                  disabled={!handle.trim()}
                >
                  EXECUTAR PROTOCOLO
                </button>
              </div>
            </form>
          </div>

          {/* History Sidebar */}
          <div className="bg-neutral-sand/20 p-8 space-y-6">
            <p className="label-meta border-b border-technical pb-2">Recent_Autopsies</p>
            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => onLoadHistory(item)}
                    className="w-full text-left p-3 border border-technical bg-white hover:border-accent-coral transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm">@{item.handle}</p>
                      <span className={`text-[8px] px-1 border ${item.intensity === 'LETHAL' ? 'border-accent-coral text-accent-coral' : 'border-dim text-dim'}`}>
                        {item.intensity}
                      </span>
                    </div>
                    <p className="text-[9px] text-dim opacity-50 font-mono">
                      {new Date(item.timestamp).toLocaleDateString('pt-BR')}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2 opacity-30">
                <p className="label-meta text-[10px]">No_Data</p>
                <p className="text-[10px] font-mono">Queue is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Meta */}
        <footer className="w-full max-w-3xl flex justify-between border-t border-technical pt-8">
          <p className="label-meta text-[9px] opacity-40 italic">LuzzIA Internal Release 2.0.4-stable</p>
          <div className="flex gap-4">
            <span className="label-meta text-[9px] opacity-40">System_Status: Operational</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </footer>
      </div>
    </div>
  );
};
