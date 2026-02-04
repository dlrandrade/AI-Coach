import React, { useState } from 'react';
import { InputScreen } from './components/InputScreen';
import { DiagnosisScreen } from './components/DiagnosisScreen';
import { SevenDayPlanScreen } from './components/SevenDayPlanScreen';
import { analyzeProfile, AnalysisResult } from './services/aiService';
import { scrapeInstagramProfile, formatProfileForAI, InstagramProfileData } from './services/instagramService';

type Screen = 'INPUT' | 'LOADING' | 'DIAGNOSIS' | 'PLAN';

function App() {
  const [screen, setScreen] = useState<Screen>('INPUT');
  const [handle, setHandle] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [rawScrapedData, setRawScrapedData] = useState<InstagramProfileData | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState(false);

  const handleAnalyze = async (inputHandle: string, planDays: 7 | 30, objective: number) => {
    setHandle(inputHandle);
    setScreen('LOADING');

    try {
      // Step 1: Scrape Instagram profile
      console.log('[LuzzIA] Scraping Instagram profile...');
      const profileData = await scrapeInstagramProfile(inputHandle);
      setRawScrapedData(profileData); // Save raw data for debug display
      console.log('[LuzzIA] RAW Profile Data:', JSON.stringify(profileData, null, 2));

      const formattedProfile = formatProfileForAI(profileData);
      console.log('[LuzzIA] Formatted for AI:', formattedProfile);

      // Step 2: Analyze with AI (passing real profile data)
      const minDelay = new Promise(resolve => setTimeout(resolve, 8000));
      const [analysisResult] = await Promise.all([
        analyzeProfile(inputHandle, planDays, objective, formattedProfile),
        minDelay
      ]);

      setResult(analysisResult);
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
