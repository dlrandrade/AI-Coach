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

  const handleAnalyze = async (inputHandle: string) => {
    setHandle(inputHandle);
    setScreen('LOADING');

    try {
      const [analysisResult] = await Promise.all([
        analyzeProfile(inputHandle),
        new Promise(resolve => setTimeout(resolve, 3000))
      ]);
      setResult(analysisResult);
      setScreen('DIAGNOSIS');
    } catch (e) {
      console.error(e);
      setScreen('INPUT');
    }
  };

  const handleReset = () => {
    setHandle('');
    setResult(null);
    setScreen('INPUT');
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
          onNext={() => setScreen('PLAN')}
        />
      )}
      {screen === 'PLAN' && (
        <SevenDayPlanScreen
          handle={handle}
          result={result}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
