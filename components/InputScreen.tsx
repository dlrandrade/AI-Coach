import React, { useState } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string) => void;
  isLoading: boolean;
}

export const InputScreen: React.FC<InputScreenProps> = ({ onAnalyze, isLoading }) => {
  const [handle, setHandle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = handle.trim().replace('@', '');
    if (cleanHandle) {
      onAnalyze(cleanHandle);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="spinner"></div>
            <span className="mono text-muted">Processando análise...</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Analisando @{handle.replace('@', '')}
          </h2>

          <div className="space-y-2 text-sm text-muted">
            <p className="animate-pulse">Identificando padrões psicológicos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="container max-w-md animate-fade-in-up">
        {/* Logo / Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-subtle mb-6">
            <div className="pulse-dot"></div>
            <span className="mono text-xs text-muted">AI-powered analysis</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Autópsia do Instagram
          </h1>

          <p className="text-secondary text-sm max-w-sm mx-auto">
            Análise psicológica de padrões que travam crescimento, autoridade e conversão.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">@</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="seu_perfil"
              className="input pl-8"
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={!handle.trim()}
          >
            Iniciar Análise
          </button>
        </form>

        {/* Info */}
        <div className="mt-8 p-4 rounded-lg bg-subtle border border-light">
          <p className="text-xs text-muted text-center">
            Esta análise expõe padrões inconscientes baseados em psicologia comportamental.
            Você receberá um diagnóstico + plano de 7 dias com prompts prontos para usar.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="mono text-xs text-subtle">
            Desenvolvido para profissionais que querem resultados reais
          </p>
        </footer>
      </div>
    </div>
  );
};
