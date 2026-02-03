
import React, { useState, useCallback } from 'react';
import SignUp from './components/SignUp';
import Onboarding from './components/Onboarding';
import Plans from './components/Plans';
import Dashboard from './components/Dashboard';
import AnalysisReport from './components/AnalysisReport';
import { ContentPlan, User, FullDiagnosis } from './types';
import { generateContentPlan } from './services/geminiService';
import LoadingSpinner from './components/common/LoadingSpinner';

type AppState = 'signup' | 'onboarding' | 'plans' | 'generating' | 'analysis' | 'dashboard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('signup');
  const [user, setUser] = useState<User | null>(null);
  const [instagramHandle, setInstagramHandle] = useState<string | null>(null);
  const [analysisReport, setAnalysisReport] = useState<string | null>(null);
  const [contentPlan, setContentPlan] = useState<ContentPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = useCallback((userData: User) => {
    setUser(userData);
    setAppState('onboarding');
  }, []);

  const handleOnboardingComplete = useCallback((handle: string) => {
    setInstagramHandle(handle);
    setAppState('plans');
  }, []);

  const handlePlanSelection = useCallback(async () => {
    if (!instagramHandle) {
        setError('Ocorreu um erro. Por favor, forneça seu @instagram novamente.');
        setAppState('onboarding');
        return;
    }
    setAppState('generating');
    setError(null);
    try {
      const diagnosis: FullDiagnosis = await generateContentPlan(instagramHandle);
      setAnalysisReport(diagnosis.analysisReport);
      setContentPlan(diagnosis.contentPlan);
      setAppState('analysis');
    } catch (e) {
      console.error(e);
      setError('Falha ao analisar o perfil e gerar o plano. Verifique o @ e tente novamente.');
      setAppState('onboarding'); // Revert to onboarding on failure
    }
  }, [instagramHandle]);
  
  const handleBackToOnboarding = useCallback(() => {
    setAppState('onboarding');
  }, []);

  const handleContinueToDashboard = useCallback(() => {
    setAppState('dashboard');
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'signup':
        return <SignUp onSignUp={handleSignUp} />;
      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} user={user} error={error} />;
      case 'plans':
        return <Plans onPlanSelected={handlePlanSelection} />;
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light p-4 text-center">
            <LoadingSpinner />
            <h2 className="text-2xl font-bold text-brand-primary mt-6">LuzzIA está se conectando à sua frequência...</h2>
            <p className="text-brand-secondary mt-2">Analisando o perfil @{instagramHandle} para decodificar sua estratégia de conteúdo.</p>
          </div>
        );
      case 'analysis':
          return analysisReport && instagramHandle ? (
            <AnalysisReport report={analysisReport} instagramHandle={instagramHandle} onContinue={handleContinueToDashboard} />
          ) : ( <Onboarding onComplete={handleOnboardingComplete} user={user} error={"Erro ao carregar a análise."} /> );
      case 'dashboard':
        return contentPlan && user ? (
          <Dashboard plan={contentPlan} user={user} onRegenerate={handleBackToOnboarding} />
        ) : (
          <SignUp onSignUp={handleSignUp} />
        ); // Fallback to signup if state is inconsistent
      default:
        return <SignUp onSignUp={handleSignUp} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light font-sans text-brand-primary">
      {renderContent()}
    </div>
  );
};

export default App;
