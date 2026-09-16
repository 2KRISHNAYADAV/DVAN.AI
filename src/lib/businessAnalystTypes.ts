export interface BusinessContext {
  industry: string;
  companyType: string;
  primaryGoal: string;
  importantKPIs: string[];
  analysisPeriod: string;
}

export interface KPICard {
  id: string;
  title: string;
  currentValue: number | string;
  previousValue?: number | string;
  percentChange?: number;
  trend: 'up' | 'down' | 'flat' | null;
  status: 'Healthy' | 'Needs Attention' | 'High Risk' | 'Unknown';
  format?: 'currency' | 'percentage' | 'number';
}

export interface AIInsight {
  id: string;
  insight: string;
  evidence: string;
  businessImpact: 'High' | 'Medium' | 'Low';
  confidence: number;
  recommendedAction: string;
  type: 'Observed' | 'Calculated' | 'AI Interpretation' | 'Recommendation';
}

export interface RootCause {
  id: string;
  kpi: string;
  primaryFactors: string[];
  secondaryFactors: string[];
  affectedSegments: string[];
  trendDescription: string;
  evidence: string;
  treeData: any; // Could be a structured tree object
}

export interface Recommendation {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  problem: string;
  recommendation: string;
  expectedImpact: string;
  effort: 'High' | 'Medium' | 'Low';
  owner: string;
  timeline: string;
}

export interface ActionItem {
  id: string;
  action: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  expectedOutcome: string;
}

export interface ScenarioConfig {
  id: string;
  name: string;
  adjustments: Record<string, number>; // e.g. { 'staffing': 10, 'processing_time': -15 }
}

export interface DataQualityIssue {
  id: string;
  column?: string;
  issue: string;
  severity: 'High' | 'Medium' | 'Low';
  affectedRows: number;
  suggestedFix: string;
}

export interface IndustryAgent {
  id: string;
  name: string;
  description: string;
  systemPromptAddendum: string;
  suggestedKPIs: string[];
}

export interface AnalystMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface DatasetHealth {
  rows: number;
  columns: number;
  missingValuesPercent: number;
  duplicatesPercent: number;
  dataQualityScore: number;
}
