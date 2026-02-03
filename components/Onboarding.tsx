
import React, { useState } from 'react';
import type { User } from '../types';
import Button from './common/Button';
import Input from './common/Input';

interface OnboardingProps {
  onComplete: (handle: string) => void;
  user: User | null;
  error: string | null;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, user, error }) => {
  const [instagramHandle, setInstagramHandle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instagramHandle) {
      // Remove '@' if user included it
      const handle = instagramHandle.startsWith('@') ? instagramHandle.substring(1) : instagramHandle;
      onComplete(handle);
    } else {
        alert("Por favor, insira seu @ do Instagram.")
    }
  };


  return (
    <div className="min-h-screen bg-brand-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-brand-primary">Diagnóstico Estratégico</h2>
          <p className="mt-2 text-brand-secondary">
            Olá, {user?.name || 'Criador(a)'}. Forneça seu perfil do Instagram para que LuzzIA possa fazer uma análise completa.
          </p>
        </div>
        <div className="bg-white border border-gray-200 p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100" role="alert">{error}</div>}
            
            <div>
                 <Input 
                    id="instagramHandle" 
                    name="instagramHandle" 
                    label="Seu @ do Instagram" 
                    type="text" 
                    value={instagramHandle} 
                    onChange={(e) => setInstagramHandle(e.target.value)} 
                    required 
                    placeholder="ex: seuusuario" 
                    className="text-center text-lg"
                />
                <p className="text-center text-xs text-gray-400 mt-2">A IA fará uma análise pública do seu perfil para criar a estratégia.</p>
            </div>
           
            <Button type="submit">Analisar Perfil e Ver Planos</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
