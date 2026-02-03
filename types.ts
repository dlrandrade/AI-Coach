
export interface User {
  name: string;
  email: string;
  whatsapp: string;
}

export type MainGoal = 'authority' | 'leads' | 'sales';
export type FocusChannel = 'instagram' | 'linkedin' | 'tiktok';
export type CurrentLevel = 'zero' | 'irregular' | 'consistent';
export type DesiredStyle = 'educational' | 'provocative' | 'behind_the_scenes';

export interface OnboardingData {
  niche: string;
  mainGoal: MainGoal;
  focusChannel: FocusChannel;
  frequency: number;
  currentLevel: CurrentLevel;
  desiredStyles: DesiredStyle[];
  products: string;
  dailyTime: number;
}

export interface DailyTask {
  day: number;
  postType: string;
  topic: string;
  objective: string;
  scriptOrCopy: string;
  visualStructure?: string;
}

export interface ContentPlan {
  contentPillars: string[];
  weeklyFrequency: number;
  postTypes: string[];
  toneOfVoice: string;
  defaultCTA: string;
  schedule: DailyTask[];
}

export interface WhatsAppMessage {
    id: number;
    sender: 'user' | 'luzzia';
    content: string;
    timestamp: string;
}

export interface FullDiagnosis {
  analysisReport: string;
  contentPlan: ContentPlan;
}
