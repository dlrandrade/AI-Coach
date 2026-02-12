import React, { useState } from 'react';
import { InputScreen } from './components/InputScreen';
import { DiagnosisScreen } from './components/DiagnosisScreen';
import { SevenDayPlanScreen } from './components/SevenDayPlanScreen';
import { analyzeProfile, AnalysisResult, AnalyzeResponse } from './services/aiService';

type Screen = 'INPUT' | 'LOADING' | 'DIAGNOSIS' | 'PLAN';

function App() {
  const [screen, setScreen] = useState<Screen>('INPUT');
  const [handle, setHandle] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [rawScrapedData, setRawScrapedData] = useState<AnalyzeResponse['rawScrapedData'] | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState(false);

  const handleAnalyze = async (inputHandle: string, planDays: 7 | 30, objective: number) => {
    setHandle(inputHandle);
    setScreen('LOADING');

    try {
      const minDelay = new Promise(resolve => setTimeout(resolve, 8000));
      const [response] = await Promise.all([
        analyzeProfile(inputHandle, planDays, objective),
        minDelay
      ]);

      setResult(response.result);
      setRawScrapedData(response.rawScrapedData || null);
      setScreen('DIAGNOSIS');
    } catch (e) {
      console.error('[LuzzIA] Error:', e);
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
    setScreen('INPUT');
    setIsPlanLoading(false);
  };

  return (
    <div className="min-h-screen">
      {(screen === 'INPUT' || screen === 'LOADING') && (
        <InputScreen
          onAnalyze={handleAnalyze}
          isLoading={screen === 'LOADING'}
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
    </div>
  );
}

export default App;
