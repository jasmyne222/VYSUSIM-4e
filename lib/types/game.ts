// Game State & Types for Vysual HR - Full Data Collection

export type GameScreen = 
  | 'welcome' 
  | 'team' 
  | 'restaurant' 
  | 'mission-julie' 
  | 'mission-pablo' 
  | 'mission-dismissal' 
  | 'report';

export type ContractType = 'CDI' | 'CDD' | 'Temps partiel' | 'Apprenti';
export type RoleType = 'Gerant' | 'Cuisinier' | 'Serveur' | 'Chef de rang' | 'Livreur' | 'Autre';
export type TimekeepingMethod = 'Timbreuse' | 'Smartphone' | 'Web';

export interface Employee {
  id: string;
  name: string;
  age: number;
  role: RoleType;
  contractType: ContractType;
  drivingLicense: boolean;
  timekeepingMethods: TimekeepingMethod[];
  managerId: string | null;
  startDate: string;
  avatarConfig: {
    color?: string;
    expression?: string;
  };
}

export interface OrgChartNode {
  employeeId: string;
  children: string[];
}

// Mission Julie - Conge maternite
export interface MissionJulieData {
  congeDuree: string;
  congeSalaire: string;
  congeRemplacement: string;
  workflowValidation: string;
}

// Mission Pablo - Accident de travail
export interface MissionPabloData {
  accidentType: string;
  accidentDeclaration: string;
  accidentRemplacement: string;
  accidentSalaire: string;
}

// Mission Licenciement
export interface MissionDismissalData {
  employeeName: string;
  motif: string;
  preavis: string;
  solde: string[];
  signataire: string;
}

export interface GameSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'in_progress' | 'completed';
  currentScreen: GameScreen;
  
  // Team data
  teamConfig: Employee[];
  orgChart: OrgChartNode[];
  
  // Mission data
  missionJulie: MissionJulieData | null;
  missionPablo: MissionPabloData | null;
  missionDismissal: MissionDismissalData | null;
  
  // Metadata
  metadata: Record<string, unknown>;
}

export interface DecisionOption {
  id: string;
  text: string;
  icon: string;
  description?: string;
}

export interface DecisionCard {
  id: string;
  question: string;
  helpText?: string;
  options: DecisionOption[];
  multiSelect?: boolean;
}
