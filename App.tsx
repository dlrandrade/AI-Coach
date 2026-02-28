import React, { useEffect, useState } from 'react';
import { InputScreen } from './components/InputScreen';
import { DiagnosisScreen } from './components/DiagnosisScreen';
import { SevenDayPlanScreen } from './components/SevenDayPlanScreen';
import { RuntimeStatusPill } from './components/RuntimeStatusPill';
import { AdminMetricsPanel } from './components/AdminMetricsPanel';
import { analyzeProfile, AnalysisResult, AnalyzeResponse, ApiError, UsageInfo, getUsage, getHealth } from './services/aiService';

type Screen = 'INPUT' | 'LOADING' | 'DIAGNOSIS' | 'PLAN';

function App() {
  const [screen, setScreen] = useState<Screen>('INPUT');
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
    setScreen('PLAN');
    setIsPlanLoading(true);

    setTimeout(() => {
      setIsPlanLoading(false);
    }, 3000);
  };

  const handleReset = () => {
    setHandle('');
    setResult(null);
    setRawScrapedData(null);
    setErrorMessage('');
    setShowPaywall(false);
    setAnalysisMeta(null);
    setGenericScore(0);
    setScreen('INPUT');
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
        isFallback={String(analysisMeta?.modelUsed || '').includes('fallback')}
      />
      <AdminMetricsPanel />
    </div>
  );
}

export default App;
