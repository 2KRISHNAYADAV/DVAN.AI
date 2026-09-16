import { create } from 'zustand';
import { 
  BusinessContext, 
  KPICard, 
  AIInsight, 
  RootCause, 
  Recommendation, 
  ActionItem, 
  DataQualityIssue, 
  AnalystMessage,
  DatasetHealth
} from './businessAnalystTypes';
import { DatasetSummary } from './dataAnalysis';

interface BusinessAnalystState {
  // Data
  rawDataset: any[];
  datasetSummary: DatasetSummary | null;
  datasetHealth: DatasetHealth | null;
  
  // Context
  businessContext: BusinessContext | null;
  activeIndustryAgentId: string;
  
  // Analysis Output
  kpis: KPICard[];
  insights: AIInsight[];
  rootCauses: RootCause[];
  recommendations: Recommendation[];
  actionPlan: ActionItem[];
  dataQualityIssues: DataQualityIssue[];
  
  // UI State
  activeSection: string;
  chatHistory: AnalystMessage[];
  isDemoMode: boolean;
  
  // Actions
  setRawDataset: (data: any[], summary: DatasetSummary, health: DatasetHealth) => void;
  setBusinessContext: (context: BusinessContext) => void;
  setActiveSection: (section: string) => void;
  setActiveIndustryAgentId: (id: string) => void;
  setKpis: (kpis: KPICard[]) => void;
  setInsights: (insights: AIInsight[]) => void;
  setRootCauses: (causes: RootCause[]) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  setActionPlan: (plan: ActionItem[]) => void;
  setDataQualityIssues: (issues: DataQualityIssue[]) => void;
  addChatMessage: (message: AnalystMessage) => void;
  setIsDemoMode: (isDemo: boolean) => void;
  clearWorkspace: () => void;
}

export const useBAStore = create<BusinessAnalystState>((set) => ({
  rawDataset: [],
  datasetSummary: null,
  datasetHealth: null,
  
  businessContext: null,
  activeIndustryAgentId: 'default',
  
  kpis: [],
  insights: [],
  rootCauses: [],
  recommendations: [],
  actionPlan: [],
  dataQualityIssues: [],
  
  activeSection: 'dashboard',
  chatHistory: [
    { id: 'initial', role: 'assistant', content: 'Hello! I am your AI Business Analyst. Upload some data and I can help you discover KPIs, find root causes of operational issues, and build an execution plan.', timestamp: new Date() }
  ],
  isDemoMode: false,
  
  setRawDataset: (rawDataset, datasetSummary, datasetHealth) => set({ rawDataset, datasetSummary, datasetHealth }),
  setBusinessContext: (businessContext) => set({ businessContext }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setActiveIndustryAgentId: (activeIndustryAgentId) => set({ activeIndustryAgentId }),
  setKpis: (kpis) => set({ kpis }),
  setInsights: (insights) => set({ insights }),
  setRootCauses: (rootCauses) => set({ rootCauses }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setActionPlan: (actionPlan) => set({ actionPlan }),
  setDataQualityIssues: (dataQualityIssues) => set({ dataQualityIssues }),
  addChatMessage: (message) => set((state) => ({ chatHistory: [...state.chatHistory, message] })),
  setIsDemoMode: (isDemoMode) => set({ isDemoMode }),
  
  clearWorkspace: () => set({
    rawDataset: [],
    datasetSummary: null,
    datasetHealth: null,
    businessContext: null,
    kpis: [],
    insights: [],
    rootCauses: [],
    recommendations: [],
    actionPlan: [],
    dataQualityIssues: [],
    activeSection: 'dashboard',
    chatHistory: [
      { id: 'initial', role: 'assistant', content: 'Hello! I am your AI Business Analyst. Upload some data and I can help you discover KPIs, find root causes of operational issues, and build an execution plan.', timestamp: new Date() }
    ],
    isDemoMode: false,
    activeIndustryAgentId: 'default'
  }),
}));
