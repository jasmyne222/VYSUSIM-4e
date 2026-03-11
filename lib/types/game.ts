// Game State & Types for Vysual HR

export type GameScreen = 'welcome' | 'team' | 'restaurant' | 'mission-julie';

export interface Employee {
  id: string;
  name: string;
  role: string;
  contractType: 'CDI' | 'CDD' | 'Stage';
  age: number;
  startDate: string;
  timekeepingMethod: 'badge' | 'manual' | 'app';
  avatarConfig: {
    color?: string;
    expression?: string;
  };
}

export interface DecisionOption {
  id: string;
  text: string;
  icon: string;
  consequence?: string;
  hrLearning?: string;
}

export interface GameMission {
  id: string;
  characterName: string;
  characterRole: string;
  situation: string;
  decisions: DecisionOption[];
  context?: string;
}

export interface GameDecision {
  id: string;
  sessionId: string;
  missionId: string;
  characterName: string;
  decisions: Record<string, string>;
  createdAt: string;
}

export interface GameSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'in_progress' | 'completed';
  currentScreen: GameScreen;
  teamConfig: Employee[];
  decisions: GameDecision[];
  metadata: Record<string, any>;
}

export interface GameState {
  session: GameSession | null;
  currentScreen: GameScreen;
  loading: boolean;
  error: string | null;
}
