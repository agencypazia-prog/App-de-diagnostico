export type EvidenceStatus = 'V' | 'D' | 'E' | 'P'; // Verificado, Declarado, Estimado, Pendiente

export interface Question {
  id: string;
  text: string;
  options?: string[]; // Opciones de respuesta estandarizadas para agilizar la captura en planta
}

export interface Section {
  title: string;
  questions: Question[];
}

export interface InstrumentDefinition {
  id: string; // '01', '02', '03', '04', '05', '06'
  filename: string;
  title: string;
  subtitle: string;
  role: string;
  function: string;
  sections: Section[];
  rubricDimensions: string[];
}

export interface QuestionResponse {
  status: EvidenceStatus;
  selectedOption?: string; // Opción múltiple seleccionada
  notes: string; // Observación libre / aclaración en vivo con el encargado
}

export interface DimensionScore {
  score: number; // 0 a 5
  mainEvidence: string;
  priorityGap: string;
}

export interface InstrumentResponse {
  instrumentId: string;
  responses: Record<string, QuestionResponse>; // key: question id (e.g. 'G01')
  scores: Record<string, DimensionScore>; // key: dimension name
  generalNotes?: string;
  completed: boolean;
}

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: 'image' | 'document';
  mimeType: string;
  dataUrl?: string;
  url?: string;
  uploadedAt: string;
}

export interface FinancialCostBreakdown {
  directWasteMonthly?: string; // Mermas, productos no conformes, fallos directos
  indirectHoursWeekly?: string; // Horas hombre perdidas a la semana en reprocesos/Excel
  indirectCostMonthly?: string; // Coste monetario de esas horas
  opportunityLossAnnual?: string; // Multas, descuentos forzados, clientes perdidos
  totalMonthlyBleed?: string; // Fuga mensual estimada
  totalAnnualBleed?: string; // Fuga anual estimada
  clientObservations?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  options?: string[]; // Botones de selección rápida
  attachments?: ChatAttachment[];
  isFinalConfirmation?: boolean;
  stageId?: string;
}

export interface ChatSessionState {
  currentStageIndex: number;
  messages: ChatMessage[];
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  sector: string;
  employees: string;
  costBreakdown: FinancialCostBreakdown;
  attachments: ChatAttachment[];
  isCompleted: boolean;
  isSubmitted: boolean;
  submittedAt?: string;
  empresaId?: string;
  conversacionId?: string;
  instrumentAnswers?: Record<string, QuestionResponse>;
  activeQuestionIds?: string[];
  phase?: 'identity' | 'contact' | 'instrument' | 'done';
}

export interface CompanyProfile {
  id: string;
  name: string;
  contactEmail: string;
  sector: string;
  customSector?: string;
  employees: string;
  location?: string;
  consultantName: string;
  accessCode: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'in_progress' | 'completed' | 'analyzed';
  source?: 'in_plant_audit' | 'conversational_bot';
  submittedByClient?: boolean;
  chatSession?: ChatSessionState;
  costBreakdown?: FinancialCostBreakdown;
  attachments?: ChatAttachment[];
  instruments: Record<string, InstrumentResponse>;
  diagnosticResult?: DiagnosticResult;
}

export interface OpportunityItem {
  id: string;
  process: string;
  problem: string;
  proposedAI: string;
  category: 'Automatización' | 'Chatbot / RAG' | 'Agentes Autónomos' | 'Visión Artificial' | 'Legal Tech / PAZ' | 'Gobernanza ISO 42001';
  impact: 'Alto' | 'Medio' | 'Crítico';
  risk: 'Bajo' | 'Medio' | 'Controlado';
  estimatedCost: string;
  estimatedBenefit: string;
  priority: 'P1 - Inmediata (0-90d)' | 'P2 - Mediano plazo (3-6m)' | 'P3 - Maduración (6-12m)';
  landAndExpandStage: 'Land (Quick Win)' | 'Expand (Core)' | 'Control Center';
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  timeframe: string;
  objective: string;
  deliverables: string[];
  pazSolutions: string[];
  keyKPI: string;
}

export interface FinancialScenario {
  name: 'Conservador' | 'Esperado' | 'Optimista';
  monthlySavings: string;
  annualSavings: string;
  estimatedInvestment: string;
  estimatedPaybackMonths: number;
  estimatedROI: string;
  keyAssumptions: string;
}

export interface DiagnosticResult {
  generatedAt: string;
  companyName: string;
  executiveSummary: string;
  globalMaturityScore: number; // 0-100
  overallRiskLevel: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  dimensionScores: {
    dimension: string;
    score: number; // 0-100
    level: string;
    finding: string;
  }[];
  criticalBottlenecks: {
    area: string;
    description: string;
    consequence: string;
    aiRemedy: string;
  }[];
  opportunitiesMatrix: OpportunityItem[];
  roadmap: RoadmapPhase[];
  financialScenarios: FinancialScenario[];
  governanceAndComplianceNotes: {
    iso42001Gaps: string[];
    nistAiRmfGaps: string[];
    privacyAndDataGaps: string[];
    humanInTheLoopRequirements: string[];
  };
  recommendedServicePackage: {
    title: string;
    shortDescription: string;
    includedModules: string[];
    nextStepRecommendation: string;
  };
}
