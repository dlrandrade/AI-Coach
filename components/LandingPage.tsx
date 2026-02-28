import React from 'react';

type Props = {
  onStart: () => void;
};

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 md:px-6 py-8 md:py-16 reveal">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 md:gap-10 items-center">
        <div className="space-y-6">
          <span className="tech-label">LUZZIA • DIAGNÓSTICO DE DOMÍNIO</span>
          <h1 className="hero-title leading-tight">
            Transforme seu Instagram em
            <br />
            <span>AUTORIDADE REAL</span>
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Descubra exatamente onde seu perfil perde força e receba um plano acionável de 7 ou 30 dias com prompts completos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onStart} className="btn-neurelic min-h-[56px] px-8">
              FAZER DIAGNÓSTICO AGORA
            </button>
            <a href="#como-funciona" className="btn-outline min-h-[56px] px-8 text-center">
              COMO FUNCIONA
            </a>
          </div>
        </div>

        <div className="border-2 border-black p-4 md:p-6 space-y-4 bg-gray-50 card-tech">
          <h2 className="section-title text-2xl">O que você recebe</h2>
          <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
            <li>Sentença estratégica do perfil</li>
            <li>Dissecção completa (bio, feed, stories, provas, ofertas, linguagem)</li>
            <li>Plano de execução com prompts contextualizados</li>
            <li>Direção clara para posicionamento e conversão</li>
          </ul>
        </div>
      </div>

      <section id="como-funciona" className="hidden" aria-hidden="true" />
    </div>
  );
};
