import React, { useState } from 'react';
import { InputScreen } from './components/InputScreen';
import { DiagnosisScreen } from './components/DiagnosisScreen';
import { SevenDayPlanScreen } from './components/SevenDayPlanScreen';
import { analyzeProfile, AnalysisResult } from './services/aiService';

type Screen = 'INPUT' | 'LOADING' | 'DIAGNOSIS' | 'PLAN';

function App() {
  const [screen, setScreen] = useState<Screen>('INPUT');
  const [handle, setHandle] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState(false);

  const handleAnalyze = async (inputHandle: string, planDays: 7 | 30) => {
    setHandle(inputHandle);
    setScreen('LOADING');

    try {
      // Simulate analysis time + API call
      const minDelay = new Promise(resolve => setTimeout(resolve, 8000)); // Increased time for LuzzIA observations
      const [analysisResult] = await Promise.all([
        analyzeProfile(inputHandle, planDays),
        minDelay
      ]);
      setResult(analysisResult);
      setScreen('DIAGNOSIS');
    } catch (e) {
      console.error(e);
      setScreen('INPUT');
    }
  };

  const handleStartPlan = async () => {
    setScreen('PLAN');
    setIsPlanLoading(true);

    // Simulate "Writing Plan" delay for realism
    setTimeout(() => {
      setIsPlanLoading(false);
    }, 4000);
  };

  const handleReset = () => {
    setHandle('');
    setResult(null);
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
