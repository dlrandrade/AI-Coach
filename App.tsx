import React, { useState } from 'react';
import { InputScreen } from './components/InputScreen';
import { DiagnosisScreen } from './components/DiagnosisScreen';
import { SevenDayPlanScreen } from './components/SevenDayPlanScreen';
import { analyzeProfile, AnalysisResult } from './services/aiService';

type AppState = 'INPUT' | 'ANALYSIS' | 'PLAN';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('INPUT');
  const [handle, setHandle] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (inputHandle: string) => {
    // Normalize handle
    const cleanHandle = inputHandle.replace('@', '').trim();
    setHandle(cleanHandle);
    setCurrentState('ANALYSIS');
    setAnalysisResult(null);

    // Call Service
    try {
      // Add artificial delay for "computing" feel
      const delay = new Promise(resolve => setTimeout(resolve, 2000));
      const [result] = await Promise.all([analyzeProfile(cleanHandle), delay]);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      // Fallback or error state could go here
    }
  };

  const handleReset = () => {
    setHandle('');
    setAnalysisResult(null);
    setCurrentState('INPUT');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white font-mono">
      {currentState === 'INPUT' && (
        <InputScreen onAnalyze={handleAnalyze} />
      )}

      {currentState === 'ANALYSIS' && !analysisResult && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-4xl md:text-6xl font-mono animate-pulse text-red-600 font-bold tracking-tighter text-center">
            ANALISANDO...
          </div>
          <div className="mt-8 font-mono text-sm text-center space-y-2">
            <p className="typing-effect">EXTRAINDO DADOS DE @{handle}</p>
            <p className="text-gray-500 animate-pulse delay-75">BUSCANDO PADRÕES DE FRACASSO...</p>
            <p className="text-gray-600 text-xs mt-4">[PROTOCOLO REALIDADE_BRUTA EM EXECUÇÃO]</p>
          </div>
        </div>
      )}

      {currentState === 'ANALYSIS' && analysisResult && (
        <DiagnosisScreen
          handle={handle}
          result={analysisResult}
          onReset={handleReset}
          onNext={() => setCurrentState('PLAN')}
        />
      )}

      {currentState === 'PLAN' && (
        <SevenDayPlanScreen
          handle={handle}
          result={analysisResult}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
