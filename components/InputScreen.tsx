import React, { useState, useEffect } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string) => void;
  isLoading: boolean;
}

const LOADING_MESSAGES = [
  "Verificando @handle...",
  "Indexando últimas postagens...",
  "Lendo legendas em busca de padrões de linguagem...",
  "Analisando estética visual das imagens...",
  "Escaneando métricas de engajamento...",
  "Correlacionando bio com promessa de mercado...",
  "Mapeando pontos cegos psicológicos...",
  "Sintonizando modelo neural de autópsia...",
  "Finalizando diagnóstico..."
];

export const InputScreen: React.FC<InputScreenProps> = ({ onAnalyze, isLoading }) => {
  const [handle, setHandle] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  // Rotate loading messages
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
      return () => clearInterval(interval);
    } else {
      setMessageIndex(0);
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
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm text-center space-y-12 reveal">
          {/* Scanner Visual */}
          <div className="relative h-48 w-full border border-light bg-subtle overflow-hidden">
            <div className="scanner-line"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="font-mono text-4xl">ANALYSIS_MODE</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[10px] text-subtle tracking-[0.2em]">PROCESSING_NEURAL_SCAN</p>
            <h2 className="text-xl font-medium tracking-tight">
              @{handle.replace('@', '')}
            </h2>
            <div className="h-6 overflow-hidden">
              <p className="text-sm text-dim transition-all duration-500 animate-slide-in" key={messageIndex}>
                {LOADING_MESSAGES[messageIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-16 reveal">
        {/* Brand Section */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent-soft rounded-full">
            <div className="pulse-dot"></div>
            <span className="font-mono text-[10px] tracking-wider text-accent uppercase">
              Doug 2.0 Protocol Active
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-none">
              Autópsia <br /> <span className="text-dim">do Instagram</span>
            </h1>
            <p className="text-dim text-lg max-w-md mx-auto">
              Expondo os padrões invisíveis que travam seu crescimento e autoridade.
            </p>
          </div>
        </header>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="technical-input-wrapper mx-auto">
            <span className="tech-label top-2 left-3">TARGET_HANDLE</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="seu_perfil"
              className="technical-input text-center"
              autoComplete="off"
              spellCheck="false"
            />
            <span className="tech-label bottom-2 right-3">REQUIRED_FIELD</span>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn-premium group"
              disabled={!handle.trim()}
            >
              <span>INICIAR ESCANEAMENTO</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>

        {/* Bottom Metadata */}
        <footer className="pt-12 border-t border-light flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-8">
            <div className="space-y-1">
              <p className="font-mono text-[9px] text-subtle">ACCURACY</p>
              <p className="text-xs font-medium">HIGH_PRECISION</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[9px] text-subtle">MODEL</p>
              <p className="text-xs font-medium">NEURAL_DOUG_v4</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-subtle max-w-[200px] text-center md:text-right italic">
              Esta análise expõe vulnerabilidades psicológicas e falhas de posicionamento estratégico.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
