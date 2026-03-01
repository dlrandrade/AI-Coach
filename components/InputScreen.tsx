import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UsageInfo } from '../services/aiService';

interface InputScreenProps {
  onAnalyze: (handle: string, planDays: 7 | 30, objective: number) => void;
  isLoading: boolean;
  errorMessage?: string;
  showPaywall?: boolean;
  usageInfo?: UsageInfo | null;
  clientId?: string;
  onClosePaywall?: () => void;
  onRefreshUsage?: () => void;
}

const OBJECTIVES = [
  { id: 1, label: 'DOMINAR UM TERRITÓRIO MENTAL', short: 'AUTORIDADE', desc: 'Aumentar domínio ideológico e referência mental' },
  { id: 2, label: 'CLAREZA ABSOLUTA DE POSICIONAMENTO', short: 'POSICIONAMENTO', desc: 'Tornar o perfil impossível de confundir' },
  { id: 3, label: 'ATRAIR O PÚBLICO CERTO', short: 'QUALIFICAÇÃO', desc: 'Afastar curiosos e aproximar decisores' },
  { id: 4, label: 'CONSTRUIR PROVA E CREDIBILIDADE', short: 'PROVA', desc: 'Aumentar confiança sem inflar promessa' },
  { id: 5, label: 'PREPARAR MONETIZAÇÃO', short: 'PRÉ-VENDA', desc: 'Educar desejo e preparar transação futura' },
  { id: 6, label: 'AUMENTAR PERCEPÇÃO DE VALOR', short: 'STATUS', desc: 'Elevar respeito percebido e filtrar acesso irrelevante' },
  { id: 7, label: 'QUEBRAR ESTAGNAÇÃO', short: 'RESET', desc: 'Quebrar padrão atual de forma visível' },
];

const SYSTEM_MESSAGES = [
  "Iniciando protocolo de análise...",
  "Conectando ao Instagram...",
  "Lendo bio do perfil...",
  "Escaneando últimos posts...",
  "Analisando padrão de conteúdo...",
  "Verificando stories recentes...",
  "Mapeando destaques...",
  "Detectando sinais de autoridade...",
  "Procurando provas de resultado...",
  "Avaliando estrutura de oferta...",
];

const LUZZIA_MESSAGES = [
  "Hmm... Interessante.",
  "Isso aqui está confuso.",
  "Vejo um padrão problemático.",
  "Achei. Isso explica muita coisa.",
  "Você está deixando dinheiro na mesa.",
  "Esse erro é mais comum do que parece.",
  "Falta coragem nessa comunicação.",
  "A mensagem está fragmentada.",
  "Aqui precisa de cirurgia.",
  "O público não entende isso.",
];

const ONBOARDING_STEPS = [
  { title: "ENGINE DE DOMÍNIO", desc: "Sistema de diagnóstico e reprogramação de perfis de Instagram." },
  { title: "ESCOLHA UM OBJETIVO", desc: "Cada diagnóstico é focado em UM objetivo primário. Sem dispersão." },
  { title: "EXECUTE O PLANO", desc: "Receba ações diárias com prompts executáveis em qualquer IA." },
];

export const InputScreen: React.FC<InputScreenProps> = ({
  onAnalyze,
  isLoading,
  errorMessage,
  showPaywall = false,
  usageInfo = null,
  clientId = '',
  onClosePaywall,
  onRefreshUsage
}) => {
  const checkoutUrls: Record<3 | 10 | 30, string> = {
    3: import.meta.env.VITE_CHECKOUT_URL_3 || '',
    10: import.meta.env.VITE_CHECKOUT_URL_10 || '',
    30: import.meta.env.VITE_CHECKOUT_URL_30 || ''
  };
  const [handle, setHandle] = useState('');
  const [planDays, setPlanDays] = useState<7 | 30>(7);
  const [selectedObjective, setSelectedObjective] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompactMobile, setIsCompactMobile] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLuzziaMessage, setIsLuzziaMessage] = useState(false);
  const glitchCountRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('luzzia_visited_v2');
    if (!hasVisited) {
      setShowOnboarding(true);
    }
  }, []);

  // Compact mobile mode to reduce vertical scrolling
  useEffect(() => {
    const update = () => setIsCompactMobile(window.innerWidth <= 430);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Shuffle and generate unique messages
  const allMessages = useMemo(() => {
    const combined = [
      ...SYSTEM_MESSAGES.map(m => ({ text: m, type: 'system' })),
      ...LUZZIA_MESSAGES.map(m => ({ text: m, type: 'luzzia' }))
    ];
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined;
  }, [isLoading]);

  // Loading state management with punctual glitch
  useEffect(() => {
    if (isLoading) {
      glitchCountRef.current = 0;
      let msgIndex = 0;
      const msgInterval = setInterval(() => {
        const msg = allMessages[msgIndex % allMessages.length];
        setCurrentMessage(msg.text);
        setIsLuzziaMessage(msg.type === 'luzzia');
        msgIndex++;
      }, 2000);

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 0.7, 99));
      }, 100);

      // Punctual glitch effect - 3 times max
      const glitchTimes = [3000, 7000, 12000];
      const glitchTimeouts = glitchTimes.map((time, i) =>
        setTimeout(() => {
          if (glitchCountRef.current < 3 && containerRef.current) {
            containerRef.current.classList.add('glitch-trigger');
            setTimeout(() => {
              containerRef.current?.classList.remove('glitch-trigger');
            }, 150);
            glitchCountRef.current += 1;
          }
        }, time)
      );

      return () => {
        clearInterval(msgInterval);
        clearInterval(progressInterval);
        glitchTimeouts.forEach(t => clearTimeout(t));
      };
    } else {
      setProgress(0);
      setCurrentMessage('');
      glitchCountRef.current = 0;
    }
  }, [isLoading, allMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim().replace('@', '');
    if (clean && selectedObjective) onAnalyze(clean, planDays, selectedObjective);
  };

  const completeOnboarding = () => {
    localStorage.setItem('luzzia_visited_v2', 'true');
    setShowOnboarding(false);
  };

  const nextOnboardingStep = () => {
    if (onboardingStep < ONBOARDING_STEPS.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  // ONBOARDING
  if (showOnboarding) {
    const step = ONBOARDING_STEPS[onboardingStep];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-white">
        <div className="w-full max-w-md text-center space-y-12">
          <div className="credit-label">PASSO {onboardingStep + 1} / {ONBOARDING_STEPS.length}</div>

          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-black tracking-tight">{step.title}</h1>
            <p className="text-gray-600 text-lg">{step.desc}</p>
          </div>

          <div className="flex gap-2 justify-center">
            {ONBOARDING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 transition-all ${i === onboardingStep ? 'w-8 bg-black' : 'w-2 bg-gray-300'}`}
              />
            ))}
          </div>

          <button onClick={nextOnboardingStep} className="btn-neurelic w-full">
            {onboardingStep < ONBOARDING_STEPS.length - 1 ? 'PRÓXIMO' : 'COMEÇAR'}
          </button>

          <button onClick={completeOnboarding} className="text-gray-400 text-xs hover:text-black transition-colors">
            Pular introdução
          </button>
        </div>
      </div>
    );
  }

  // LOADING STATE
  if (isLoading) {
    return (
      <div ref={containerRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-white">
        <div className="scan-line active"></div>

        <div className="w-full max-w-lg space-y-12">
          <div className="flex justify-between items-center">
            <span className="tech-label" style={{ background: '#DC2626' }}>ANALISANDO</span>
            <span className="font-mono text-xl font-bold text-black">{progress.toFixed(0)}%</span>
          </div>

          <div className="min-h-[100px] space-y-4">
            <p className={`text-2xl leading-relaxed transition-all duration-300 ${isLuzziaMessage ? 'text-black font-bold' : 'text-gray-500'}`}>
              {currentMessage}
            </p>
            {isLuzziaMessage && (
              <span className="text-sm font-mono text-green-600">— LUZZIA</span>
            )}
          </div>

          <div className="space-y-6">
            <div className="score-track">
              <div className="score-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs font-mono text-gray-500">
              <span>ALVO: @{handle.toUpperCase()}</span>
              <span>OBJETIVO: {OBJECTIVES.find(o => o.id === selectedObjective)?.short}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN FORM
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-16 bg-white">
      <div className="w-full max-w-xl text-center space-y-8 md:space-y-12 reveal">

        {/* Header */}
        <header className="space-y-6">
          <div className="flex justify-center items-center gap-4">
            <span className="tech-label">LUZZIA</span>
            <span className="w-12 h-0.5 bg-black"></span>
            <span className="micro-label">ENGINE v2.1</span>
          </div>

          <h1 className="hero-title">
            DIAGNÓSTICO<br /><span>DE DOMÍNIO</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            Sistema de julgamento para Instagram.<br />
            Um objetivo. Um plano. Zero desculpas.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 text-left">

          {/* Handle Input */}
          <div className="space-y-3">
            <label className="micro-label block">IDENTIFICADOR DO ALVO</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@usuario"
              className="input-neurelic text-center"
              autoComplete="off"
            />
          </div>

          {/* Objective Selection */}
          <div className="space-y-3">
            <label className="micro-label block">OBJETIVO PRIMÁRIO <span className="text-red-600">*</span></label>

            {isCompactMobile ? (
              <select
                value={selectedObjective || ''}
                onChange={(e) => setSelectedObjective(Number(e.target.value) || null)}
                className="input-neurelic h-14 text-base"
              >
                <option value="">Selecione um objetivo</option>
                {OBJECTIVES.map((obj) => (
                  <option key={obj.id} value={obj.id}>{obj.label} — {obj.desc}</option>
                ))}
              </select>
            ) : (
              <div className="grid gap-3">
                {OBJECTIVES.map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => setSelectedObjective(obj.id)}
                    className={`p-4 min-h-[56px] border-2 transition-all text-left flex justify-between items-center active:scale-[0.98] ${selectedObjective === obj.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-black'
                      }`}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <span className={`font-bold text-sm block ${selectedObjective === obj.id ? 'text-white' : 'text-black'}`}>
                        {obj.label}
                      </span>
                      <p className={`text-xs mt-1 leading-snug ${selectedObjective === obj.id ? 'text-gray-300' : 'text-gray-500'}`}>
                        {obj.desc}
                      </p>
                    </div>
                    <div className={`w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center ${selectedObjective === obj.id
                      ? 'border-white bg-white'
                      : 'border-gray-400'
                      }`}>
                      {selectedObjective === obj.id && (
                        <div className="w-2.5 h-2.5 bg-black"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Plan Duration */}
          <div className="space-y-3">
            <label className="micro-label block">DURAÇÃO DO PLANO</label>
            <div className="flex border-2 border-black">
              <button
                type="button"
                onClick={() => setPlanDays(7)}
                className={`flex-1 py-4 min-h-[56px] text-sm font-bold transition-all active:scale-[0.98] ${planDays === 7 ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
              >
                7 DIAS
              </button>
              <button
                type="button"
                onClick={() => setPlanDays(30)}
                className={`flex-1 py-4 min-h-[56px] text-sm font-bold transition-all border-l-2 border-black active:scale-[0.98] ${planDays === 30 ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
              >
                30 DIAS
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="btn-neurelic w-full"
              disabled={!handle.trim() || !selectedObjective}
            >
              INICIAR DIAGNÓSTICO
            </button>
            {!selectedObjective && (
              <p className="text-xs text-red-600 mt-2 text-center">Selecione um objetivo primário</p>
            )}
            {!!errorMessage && (
              <div className="mt-3 p-3 border-2 border-red-600 bg-red-50 text-red-700 text-xs leading-relaxed">
                {errorMessage}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <footer className="pt-8">
          <a href="https://instagram.com/danielluzz" target="_blank" rel="noreferrer" className="credit-label hover:text-black transition-colors">
            FEITO POR @DANIELLUZZ
          </a>
        </footer>
      </div>

      {showPaywall && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border-2 border-black p-6 space-y-5">
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-xl font-extrabold text-black">LIMITE DE DIAGNÓSTICOS ATINGIDO</h2>
              <button type="button" onClick={onClosePaywall} className="text-sm font-bold">FECHAR</button>
            </div>
            <p className="text-sm text-gray-700">
              Você já usou o diagnóstico gratuito. Escolha um pacote para continuar.
            </p>
            <div className="text-xs font-mono text-gray-600">
              Cliente: {clientId || 'não identificado'}<br />
              Créditos restantes: {usageInfo?.creditsRemaining ?? 0}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[3, 10, 30].map((amount) => {
                const href = checkoutUrls[amount as 3 | 10 | 30];
                return href ? (
                  <a key={amount} href={href} target="_blank" rel="noreferrer" className="btn-neurelic justify-center min-h-[56px]">
                    {amount} DIAGNÓSTICOS
                  </a>
                ) : (
                  <div key={amount} className="border-2 border-gray-300 p-3 text-center text-xs text-gray-500">
                    {amount} DIAGNÓSTICOS<br />checkout não configurado
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={onRefreshUsage} className="btn-outline h-12 flex-1">
                JÁ PAGUEI, ATUALIZAR ACESSO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
