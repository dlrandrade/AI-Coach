import React, { useEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { InputScreen } from './components/InputScreen';
import { DiagnosisScreen } from './components/DiagnosisScreen';
import { SevenDayPlanScreen } from './components/SevenDayPlanScreen';
import { RuntimeStatusPill } from './components/RuntimeStatusPill';
import { AdminMetricsPanel } from './components/AdminMetricsPanel';
import { LeadUnlockModal } from './components/LeadUnlockModal';
import { analyzeProfile, AnalysisResult, AnalyzeResponse, ApiError, UsageInfo, getUsage, getHealth, saveLead } from './services/aiService';

type Screen = 'LANDING' | 'INPUT' | 'LOADING' | 'DIAGNOSIS' | 'PLAN';

function App() {
  const [screen, setScreen] = useState<Screen>('LANDING');
  const [handle, setHandle] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [rawScrapedData, setRawScrapedData] = useState<AnalyzeResponse['rawScrapedData'] | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null);
  const [clientId, setClientId] = useState('');
  const [apiOnline, setApiOnline] = useState(true);
  const [analysisMeta, setAnalysisMeta] = useState<AnalyzeResponse['meta'] | null>(null);
  const [genericScore, setGenericScore] = useState<number>(0);
  const [selectedPlanDays, setSelectedPlanDays] = useState<7 | 30>(7);
  const [selectedObjective, setSelectedObjective] = useState<number>(1);
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const [leadUnlocked, setLeadUnlocked] = useState(false);

  const computeGenericScore = (r: AnalysisResult) => {
    const prompts = (r?.plan || []).map((p) => (p.prompt || '').trim().toLowerCase()).filter(Boolean);
    if (!prompts.length) return 0;
    const uniq = new Set(prompts).size;
    return Math.round((uniq / prompts.length) * 100);
  };

  useEffect(() => {
    getHealth().then(() => setApiOnline(true)).catch(() => setApiOnline(false));
  }, []);

  const handleAnalyze = async (inputHandle: string, planDays: 7 | 30, objective: number) => {
    setHandle(inputHandle);
    setSelectedPlanDays(planDays);
    setSelectedObjective(objective);
    setErrorMessage('');
    setScreen('LOADING');

    try {
      const response = await analyzeProfile(inputHandle, planDays, objective);

      setResult(response.result);
      setRawScrapedData(response.rawScrapedData || null);
      setUsageInfo(response.usage || null);
      setClientId(response.clientId || '');
      setAnalysisMeta(response.meta || null);
      setGenericScore(computeGenericScore(response.result));
      setApiOnline(true);
      setScreen('DIAGNOSIS');
    } catch (e) {
      console.error('[LuzzIA] Error:', e);
      setApiOnline(false);
      if (e instanceof ApiError && e.code === 'QUOTA_EXCEEDED') {
        setUsageInfo(e.usage || null);
        setClientId(e.clientId || '');
        setShowPaywall(true);
      } else {
        const fallback = 'Falha ao processar diagnóstico. Verifique se o servidor backend está ativo em http://localhost:8787.';
        setErrorMessage(e instanceof Error ? e.message : fallback);
      }
      setScreen('INPUT');
    }
  };

  const handleStartPlan = async () => {
    if (!leadUnlocked) {
      setLeadGateOpen(true);
      return;
    }
    setScreen('PLAN');
    setIsPlanLoading(true);

    setTimeout(() => {
      setIsPlanLoading(false);
    }, 1200);
  };

  const handleLeadSubmit = async (lead: { name: string; email: string; whatsapp: string; consent: boolean }) => {
    await saveLead({
      ...lead,
      handle,
      objective: result?.diagnosis?.objetivo_ativo || String(selectedObjective),
      planDays: selectedPlanDays
    });
    setLeadUnlocked(true);
    setLeadGateOpen(false);
    setScreen('PLAN');
    setIsPlanLoading(true);
    setTimeout(() => setIsPlanLoading(false), 900);
  };

  const handleReset = () => {
    setHandle('');
    setResult(null);
    setRawScrapedData(null);
    setErrorMessage('');
    setShowPaywall(false);
    setAnalysisMeta(null);
    setGenericScore(0);
    setLeadUnlocked(false);
    setLeadGateOpen(false);
    setScreen('LANDING');
    setIsPlanLoading(false);
  };

  const refreshUsage = async () => {
    try {
      const usage = await getUsage();
      setClientId(usage.clientId);
      setUsageInfo(usage.usage);
      if (usage.usage.creditsRemaining > 0 || !usage.usage.freeUsed) {
        setShowPaywall(false);
      }
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Erro ao consultar créditos');
    }
  };

  return (
    <div className="min-h-screen">
      {screen === 'LANDING' && (
        <LandingPage onStart={() => setScreen('INPUT')} />
      )}

      {(screen === 'INPUT' || screen === 'LOADING') && (
        <InputScreen
          onAnalyze={handleAnalyze}
          isLoading={screen === 'LOADING'}
          errorMessage={errorMessage}
          showPaywall={showPaywall}
          usageInfo={usageInfo}
          clientId={clientId}
          onClosePaywall={() => setShowPaywall(false)}
          onRefreshUsage={refreshUsage}
        />
      )}
      {screen === 'DIAGNOSIS' && (
        <DiagnosisScreen
          handle={handle}
          result={result}
          rawScrapedData={rawScrapedData}
          onReset={handleReset}
          onNext={handleStartPlan}
        />
      )}
      {screen === 'PLAN' && (
        <SevenDayPlanScreen
          handle={handle}
          result={result}
          onReset={handleReset}
          isLoadingPlan={isPlanLoading}
        />
      )}

      <RuntimeStatusPill
        online={apiOnline}
        loading={screen === 'LOADING' || isPlanLoading}
        modelUsed={analysisMeta?.modelUsed}
        requestId={analysisMeta?.requestId}
        genericScore={genericScore}
        generationMode={analysisMeta?.generationMode}
      />
      {import.meta.env.VITE_ENABLE_OPS_PANEL === 'true' && <AdminMetricsPanel />}

      <LeadUnlockModal
        open={leadGateOpen}
        handle={handle}
        objective={result?.diagnosis?.objetivo_ativo || String(selectedObjective)}
        planDays={selectedPlanDays}
        onSubmit={handleLeadSubmit}
        onClose={() => setLeadGateOpen(false)}
      />

      <a
        href="https://instagram.com/danielluzz"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-2 right-2 text-[10px] text-gray-300 hover:text-gray-500 transition-colors no-print"
        aria-label="Desenvolvido por @DanielLuzz"
      >
        por @DanielLuzz
      </a>
    </div>
  );
}

export default App;
