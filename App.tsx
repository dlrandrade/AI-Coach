import React, { useState } from 'react';
import { InputScreen } from './components/InputScreen';
import { DiagnosisScreen } from './components/DiagnosisScreen';
import { SevenDayPlanScreen } from './components/SevenDayPlanScreen';
import { analyzeProfile, AnalysisResult } from './services/aiService';

type AppState = 'INPUT' | 'LOADING' | 'ANALYSIS' | 'PLAN';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('INPUT');
  const [handle, setHandle] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (inputHandle: string) => {
    const cleanHandle = inputHandle.replace('@', '').trim();
    setHandle(cleanHandle);
    setCurrentState('LOADING');
    setAnalysisResult(null);

    try {
      // Minimum 2.5s delay for "processing" feel
      const delay = new Promise(resolve => setTimeout(resolve, 2500));
      const [result] = await Promise.all([analyzeProfile(cleanHandle), delay]);
      setAnalysisResult(result);
      setCurrentState('ANALYSIS');
    } catch (e) {
      console.error(e);
      setCurrentState('INPUT');
    }
  };

  const handleReset = () => {
    setHandle('');
    setAnalysisResult(null);
    setCurrentState('INPUT');
  };

  return (
    <>
      {/* Input or Loading */}
      {(currentState === 'INPUT' || currentState === 'LOADING') && (
        <InputScreen
          onAnalyze={handleAnalyze}
          isLoading={currentState === 'LOADING'}
        />
      )}

      {/* Analysis Result */}
      {currentState === 'ANALYSIS' && analysisResult && (
        <DiagnosisScreen
          handle={handle}
          result={analysisResult}
          onReset={handleReset}
          onNext={() => setCurrentState('PLAN')}
        />
      )}

      {/* 7-Day Plan */}
      {currentState === 'PLAN' && (
        <SevenDayPlanScreen
          handle={handle}
          result={analysisResult}
          onReset={handleReset}
        />
      )}
    </>
  );
}

export default App;
