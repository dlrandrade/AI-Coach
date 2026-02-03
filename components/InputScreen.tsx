import React, { useState } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string) => void;
}

export const InputScreen: React.FC<InputScreenProps> = ({ onAnalyze }) => {
  const [handle, setHandle] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim().length > 1) {
      onAnalyze(handle);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor - Semantic Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />

      <div className="z-10 w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl md:text-6xl tracking-tighter">
            AI COACH
          </h1>
          <p className="text-sm font-mono text-gray-400">
            PROTOCOLO: REALIDADE_BRUTA_v1.0
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl transition-colors duration-300 ${isTyping ? 'text-white' : 'text-gray-500'}`}>
              @
            </span>
            <input
              type="text"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(handle.length > 0)}
              placeholder="seu_perfil"
              className="brutal-input pl-10 text-center"
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            className="w-full brutal-btn uppercase tracking-widest text-lg"
            disabled={handle.length < 2}
          >
            Analisar Agora
          </button>
        </form>

        <div className="pt-12 text-center text-xs text-gray-600 font-mono">
          <p>WARNING: THIS ANALYSIS WILL HURT YOUR FEELINGS.</p>
          <p>PROCEED WITH CAUTION.</p>
        </div>
      </div>
    </div>
  );
};
