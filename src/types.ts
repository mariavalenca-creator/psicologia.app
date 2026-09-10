export type RiskLevel = 'baixo' | 'moderado' | 'alto' | 'critico';

export interface AcademicData {
  recentAverage: number; // 0 to 10
  trend: 'Melhorando' | 'Estável' | 'Em Queda' | 'Queda Abrupta';
  absences: number; // faltas recentes
  assignmentSubmissionRate: number; // 0 - 100%
  reportedDifficulties: string[]; // ex: ['Leitura/Decodificação', 'Raciocínio Matemático', 'Desatenção']
  notesHistory?: { date: string; subject: string; score: number }[];
}

export interface SocioemotionalIndicators {
  predominantMood: 'Alegre/Participativo' | 'Neutro' | 'Cabisbaixo/Triste' | 'Ansioso/Irritável' | 'Apatia/Letargia';
  peerInteraction: 'Sociável' | 'Poucos amigos' | 'Isolado/Evita contato' | 'Alvo de zombarias/exclusão';
  frustrationTolerance: 'Alta' | 'Média' | 'Baixa' | 'Reação de choro ou explosão';
  classroomEngagement: 'Alto' | 'Médio' | 'Baixo' | 'Completamente desengajado';
  teacherNotes: string;
}

export interface EarlyWarningForm {
  // Sinais de alerta de sofrimento e prevenção ao suicídio
  isolationSigns: boolean;
  isolationSignsDetails?: string;
  suddenPerformanceDrop: boolean;
  hopelessnessExpressions: boolean;
  hopelessnessExpressionsText?: string;
  behaviorDrasticChange: boolean;
  behaviorChangeDetails?: string;
  givingAwayPossessions: boolean;
  morbidContent: boolean; // em desenhos ou redações
  extremeSelfCriticism: boolean;
  frequentAcheComplaints: boolean; // dores de cabeça/estômago sem causa orgânica
  bullyingHistory: boolean;
  dateFilled: string;
  evaluatorRole: 'Professor Regente' | 'Coordenador Pedagógico' | 'Orientador Educacional' | 'Psicopedagogo';
}

export interface PsychopedagogicalReport {
  riskLevel: RiskLevel;
  riskColor: 'emerald' | 'amber' | 'rose' | 'red';
  summaryTitle: string;
  psychopedagogicalHypothesis: string;
  learningDifficultyProfile: {
    primaryArea: string;
    cognitiveAspects: string;
    classroomImpact: string;
  };
  emotionalSufferingIndicators: {
    alertLevelDescription: string;
    criticalSignalsDetected: string[];
    protectiveFactors: string[];
  };
  pedagogicalInterventions: {
    title: string;
    objective: string;
    howToApplyInClass: string;
    adaptations: string;
  }[];
  socioemotionalInterventions: {
    action: string;
    approach: string;
    avoid: string;
  }[];
  institutionalProtocol: {
    urgency: string;
    steps: string[];
    crisisGuidelines: string;
  };
  generatedAt?: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  classRoom: string;
  academic: AcademicData;
  socioemotional: SocioemotionalIndicators;
  earlyWarning: EarlyWarningForm;
  calculatedRisk: RiskLevel;
  lastReport?: PsychopedagogicalReport;
  avatarColor: string;
  activeProtocols?: string[];
}

export interface DiagnosticActivity {
  id: string;
  title: string;
  targetArea: 'Leitura & Expressão' | 'Raciocínio & Cálculo' | 'Atenção & Funções Executivas' | 'Autoestima & Vínculos';
  estimatedDuration: string;
  description: string;
  materials: string[];
  pedagogicalSteps: { phase: string; description: string }[];
  psychopedagogicalObservationChecklist: string[];
  earlySignsAlertChecklist: string[];
  interventionAdaptation: string;
}
