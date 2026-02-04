import React, { useState, useEffect, useMemo } from 'react';

interface InputScreenProps {
  onAnalyze: (handle: string, planDays: 7 | 30, objective: number) => void;
  isLoading: boolean;
}

const OBJECTIVES = [
  { id: 1, label: "DOMINAR TERRITÓRIO MENTAL", short: "AUTORIDADE", desc: "Tornar-se referência ideológica do nicho" },
  { id: 2, label: "CLAREZA DE POSICIONAMENTO", short: "POSICIONAMENTO", desc: "Ser impossível de confundir ou comparar" },
  { id: 3, label: "ATRAIR PÚBLICO CERTO", short: "QUALIFICAÇÃO", desc: "Menos curiosos, mais decisores reais" },
  { id: 4, label: "CONSTRUIR PROVA", short: "CREDIBILIDADE", desc: "Aumentar confiança sem prometer resultado" },
  { id: 5, label: "PREPARAR MONETIZAÇÃO", short: "PRÉ-VENDA", desc: "Educar desejo antes da oferta" },
  { id: 6, label: "PERCEPÇÃO DE VALOR", short: "STATUS", desc: "Elevar respeito, reduzir acesso irrelevante" },
  { id: 7, label: "QUEBRAR ESTAGNAÇÃO", short: "RESET", desc: "Mudança visível e irreversível" },
];

const LUZZIA_BASE_OBSERVATIONS = [
  "Iniciando varredura neural...",
  "Decodificando camadas de posicionamento...",
  "Lendo entrelinhas da bio...",
  "Escaneando padrões de conteúdo...",
  "Detectando vazamentos de autoridade...",
  "Analisando coerência de linguagem...",
  "Identificando pontos de fricção...",
  "Procurando provas de resultado...",
  "Mapeando arquitetura de ofertas...",
  "Avaliando tensão narrativa...",
  "Calculando custo de oportunidade...",
  "Dissecando hierarquia de prioridades...",
];

const LUZZIA_PROVOCATIONS = [
  "Isso aqui está confuso...",
  "Hmm, interessante escolha.",
  "Vejo um padrão se repetindo...",
  "Aqui tem um problema sério.",
  "Achei. Isso explica muita coisa.",
  "Você está deixando dinheiro na mesa.",
  "Esse erro é mais comum do que parece.",
  "O público não entende isso ainda...",
  "Falta coragem nessa comunicação.",
  "Aqui precisa de cirurgia, não band-aid.",
  "Você está competindo com você mesmo.",
  "A mensagem está fragmentada."
];

const ONBOARDING_STEPS = [
  { title: "BEM-VINDO AO ENGINE", desc: "Sistema de diagnóstico e dominação para Instagram." },
  { title: "ESCOLHA SEU OBJETIVO", desc: "Cada diagnóstico é focado em UM objetivo primário." },
  { title: "RECEBA O PLANO", desc: "Ações diárias com prompts executáveis em qualquer IA." },
];

export const InputScreen: React.FC<InputScreenProps> = ({ onAnalyze, isLoading }) => {
  const [handle, setHandle] = useState('');
  const [planDays, setPlanDays] = useState<7 | 30>(7);
  const [selectedObjective, setSelectedObjective] = useState<number>(1);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentObservation, setCurrentObservation] = useState('');
  const [isProvocation, setIsProvocation] = useState(false);

  // Check for first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('luzzia_visited');
    if (!hasVisited) {
      setShowOnboarding(true);
    }
  }, []);

  // Generate shuffled observations
  const shuffledObservations = useMemo(() => {
    const all = [...LUZZIA_BASE_OBSERVATIONS, ...LUZZIA_PROVOCATIONS];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      let obsIndex = 0;
      const obsInterval = setInterval(() => {
        const obs = shuffledObservations[obsIndex % shuffledObservations.length];
        setCurrentObservation(obs);
        setIsProvocation(LUZZIA_PROVOCATIONS.includes(obs));
        obsIndex++;
      }, 1800);

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 0.8, 99.5));
      }, 100);

      return () => {
        clearInterval(obsInterval);
        clearInterval(progressInterval);
      };
    } else {
      setProgress(0);
      setCurrentObservation('');
    }
  }, [isLoading, shuffledObservations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim().replace('@', '');
    if (clean && selectedObjective) onAnalyze(clean, planDays, selectedObjective);
  };

  const completeOnboarding = () => {
    localStorage.setItem('luzzia_visited', 'true');
    setShowOnboarding(false);
  };

  const nextOnboardingStep = () => {
    if (onboardingStep < ONBOARDING_STEPS.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  // ONBOARDING MODAL
  if (showOnboarding) {
    const step = ONBOARDING_STEPS[onboardingStep];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-white">
        <div className="w-full max-w-md text-center space-y-12">
          <div className="space-y-2">
            <span className="credit-label">PASSO {onboardingStep + 1} DE {ONBOARDING_STEPS.length}</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{step.title}</h1>
            <p className="text-gray-500 text-lg">{step.desc}</p>
          </div>

          <div className="flex gap-2 justify-center">
            {ONBOARDING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i === onboardingStep ? 'bg-green-600 w-6' : 'bg-gray-300'}`}
              />
            ))}
          </div>

          <button onClick={nextOnboardingStep} className="btn-neurelic w-full">
            {onboardingStep < ONBOARDING_STEPS.length - 1 ? 'PRÓXIMO' : 'COMEÇAR'}
          </button>

          <button onClick={completeOnboarding} className="text-gray-400 text-sm hover:text-gray-600">
            Pular introdução
          </button>
        </div>
      </div>
    );
  }

  // LOADING STATE WITH GLITCH
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-white glitch-container glitch-active">
        {/* Scan line effect */}
        <div className="glitch-line"></div>

        <div className="w-full max-w-lg space-y-12 glitch-flicker">
          <div className="flex justify-between items-center">
            <span className="micro-label" style={{ color: '#EA580C' }}>PROCESSANDO</span>
            <span className="font-mono text-sm text-gray-400">{progress.toFixed(0)}%</span>
          </div>

          <div className="min-h-[120px] space-y-4">
            <p className={`text-2xl leading-relaxed transition-all duration-300 ${isProvocation ? 'text-gray-900 italic font-medium' : 'text-gray-500'}`}>
              "{currentObservation}"
            </p>
            {isProvocation && (
              <span className="text-sm text-green-600 font-medium block">— LUZZIA</span>
            )}
          </div>

          <div className="space-y-6">
            <div className="score-track">
              <div className="score-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-center space-y-2">
              <p className="font-mono text-xs text-gray-400 tracking-wider">
                ALVO: @{handle.toUpperCase()}
              </p>
              <p className="font-mono text-xs text-green-600 tracking-wider">
                OBJETIVO: {OBJECTIVES.find(o => o.id === selectedObjective)?.short}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN FORM
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-white">
      <div className="w-full max-w-lg text-center space-y-12 reveal">

        {/* Header */}
        <header className="space-y-6">
          <div className="flex justify-center items-center gap-4">
            <span className="tech-label">LUZZIA</span>
            <span className="w-8 h-px bg-gray-300"></span>
            <span className="micro-label">ENGINE v2.0</span>
          </div>

          <h1 className="hero-title">
            DIAGNÓSTICO<br />DE DOMÍNIO
          </h1>

          <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed text-center">
            Sistema de julgamento orientado a objetivo para Instagram.
            Escolha um objetivo. Receba um plano de dominação.
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
            <label className="micro-label block">OBJETIVO PRIMÁRIO</label>
            <div className="grid gap-2">
              {OBJECTIVES.map((obj) => (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => setSelectedObjective(obj.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${selectedObjective === obj.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className={`font-bold text-sm ${selectedObjective === obj.id ? 'text-green-700' : 'text-gray-900'}`}>
                        {obj.label}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{obj.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedObjective === obj.id
                        ? 'border-green-600 bg-green-600'
                        : 'border-gray-300'
                      }`}>
                      {selectedObjective === obj.id && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Plan Duration */}
          <div className="space-y-3">
            <label className="micro-label block">DURAÇÃO DO PLANO</label>
            <div className="flex bg-gray-100 rounded-xl p-1.5 h-14">
              <button
                type="button"
                onClick={() => setPlanDays(7)}
                className={`flex-1 rounded-lg text-sm font-bold transition-all ${planDays === 7 ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                7 DIAS
              </button>
              <button
                type="button"
                onClick={() => setPlanDays(30)}
                className={`flex-1 rounded-lg text-sm font-bold transition-all ${planDays === 30 ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
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
          </div>
        </form>

        {/* Footer */}
        <footer className="pt-8">
          <a href="https://instagram.com/danielluzz" target="_blank" rel="noreferrer" className="credit-label hover:text-green-600 transition-colors">
            FEITO COM ♥️ POR @DANIELLUZZ
          </a>
        </footer>
      </div>
    </div>
  );
};
