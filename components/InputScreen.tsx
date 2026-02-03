import React, { useState } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string) => void;
  isLoading: boolean;
}

export const InputScreen: React.FC<InputScreenProps> = ({ onAnalyze, isLoading }) => {
  const [handle, setHandle] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = handle.trim().replace('@', '');
    if (cleanHandle) {
      onAnalyze(cleanHandle);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="spinner"></div>
            <span className="mono text-muted uppercase tracking-wide">Processando</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight glitch-text">
            ANALISANDO @{handle.replace('@', '')}
          </h2>

          <div className="space-y-2 mono text-xs text-subtle">
            <p className="animate-pulse">→ Identificando padrões psicológicos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-input">
      <div className="container text-center">
        {/* Hero Title */}
        <h1 className="hero-title">
          AUTÓPSIA
          <span className="highlight">BRUTAL</span>
        </h1>

        <p className="mono text-muted text-sm md:text-base mb-8 max-w-md mx-auto">
          Análise de padrões psicológicos que travam seu crescimento no Instagram
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="input-container">
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="@seu_perfil"
              className="brutal-input text-center"
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <button
            type="submit"
            className="brutal-btn w-full md:w-auto"
            disabled={!handle.trim()}
          >
            INICIAR AUTÓPSIA
          </button>
        </form>

        {/* Warning */}
        <div className="mt-12 p-4 border border-dashed border-danger/30">
          <p className="mono text-xs text-danger/70 uppercase tracking-wide">
            ⚠ Aviso: Esta análise não será agradável.
            <br />
            O objetivo é expor verdades, não validar egos.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-16">
          <p className="mono text-xs text-subtle">
            Análise baseada em psicologia de consumo e posicionamento de mercado
          </p>
        </footer>
      </div>
    </div>
  );
};
