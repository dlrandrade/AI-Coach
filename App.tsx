import React, { useState, useEffect } from 'react';
import { InputScreen } from './components/InputScreen';
import { DiagnosisScreen } from './components/DiagnosisScreen';
import { SevenDayPlanScreen } from './components/SevenDayPlanScreen';
import { analyzeProfile, AnalysisResult } from './services/aiService';

type AppState = 'INPUT' | 'LOADING' | 'ANALYSIS' | 'PLAN';
type Intensity = 'SURGICAL' | 'LETHAL';

interface HistoryItem {
  handle: string;
  intensity: Intensity;
  timestamp: string;
  result: AnalysisResult;
}

function App() {
  const [currentState, setCurrentState] = useState<AppState>('INPUT');
  const [handle, setHandle] = useState('');
  const [intensity, setIntensity] = useState<Intensity>('SURGICAL');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('luzzia_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
  }, []);

  const saveToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history].slice(0, 5); // Keep last 5
    setHistory(newHistory);
    localStorage.setItem('luzzia_history', JSON.stringify(newHistory));
  };

  const handleAnalyze = async (inputHandle: string, selectedIntensity: Intensity) => {
    const cleanHandle = inputHandle.replace('@', '').trim();
    setHandle(cleanHandle);
    setIntensity(selectedIntensity);
    setCurrentState('LOADING');
    setAnalysisResult(null);

    try {
      const delay = new Promise(resolve => setTimeout(resolve, 3500));
      const [result] = await Promise.all([analyzeProfile(cleanHandle, selectedIntensity), delay]);

      const updatedResult = {
        ...result,
        metadata: result.metadata || {
          intensity: selectedIntensity,
          session_id: Math.random().toString(36).substring(7).toUpperCase(),
          timestamp: new Date().toISOString()
        }
      };

      setAnalysisResult(updatedResult);
      saveToHistory({
        handle: cleanHandle,
        intensity: selectedIntensity,
        timestamp: new Date().toISOString(),
        result: updatedResult
      });
      setCurrentState('ANALYSIS');
    } catch (e) {
      console.error(e);
      setCurrentState('INPUT');
    }
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setHandle(item.handle);
    setIntensity(item.intensity);
    setAnalysisResult(item.result);
    setCurrentState('ANALYSIS');
  };

  const handleReset = () => {
    setHandle('');
    setAnalysisResult(null);
    setCurrentState('INPUT');
  };

  return (
    <div className="min-h-screen bg-main relative overflow-x-hidden">
      {/* Background HUD Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] select-none z-0">
        <div className="absolute top-10 left-10 font-mono text-[10px]">LUZZIA_CORE_v2.0.4</div>
        <div className="absolute bottom-10 right-10 font-mono text-[10px]">ENCRYPTED_ADRIFT_MISSION</div>
      </div>

      <main className="relative z-10">
        {(currentState === 'INPUT' || currentState === 'LOADING') && (
          <InputScreen
            onAnalyze={handleAnalyze}
            isLoading={currentState === 'LOADING'}
            history={history}
            onLoadHistory={handleLoadHistory}
          />
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
      </main>

      {/* Global CSS for Printing */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .container-optikka { max-width: 100% !important; padding: 0 !important; }
          .modular-section { border: 1px solid #000 !important; }
          .analysis-cell { border-bottom: 1px solid #000 !important; page-break-inside: avoid; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default App;
