// Mock data for AI Command Center - structured to match expected API responses

export interface SLARisk {
  id: string;
  caseId: string;
  customerName: string;
  device: string;
  currentSLA: number; // hours remaining
  predictedBreach: number; // hours until predicted breach
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  confidence: number;
}

export interface EscalationRisk {
  id: string;
  caseId: string;
  customerName: string;
  issue: string;
  escalationProbability: number;
  topReasons: string[];
  suggestedAction: string;
}

export interface StockoutPrediction {
  id: string;
  partNumber: string;
  partName: string;
  currentStock: number;
  predictedDemand: number;
  daysUntilStockout: number;
  confidence: number;
  suggestedOrder: number;
}

export interface AIAlert {
  id: string;
  type: 'sla_breach' | 'escalation' | 'stockout' | 'anomaly' | 'recommendation';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  actionLabel?: string;
  actionId?: string;
}

export interface TechnicianLoad {
  id: string;
  name: string;
  avatar?: string;
  activeCases: number;
  capacity: number;
  efficiency: number;
  status: 'available' | 'busy' | 'overloaded';
}

export interface RepairBottleneck {
  id: string;
  stage: string;
  casesBlocked: number;
  avgWaitTime: number; // hours
  topCause: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface ActiveAgent {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'waiting';
  task: string;
  progress?: number;
  lastUpdate: Date;
}

// Mock data
export const mockSLARisks: SLARisk[] = [
  {
    id: 'sla-1',
    caseId: 'RC-2024-0892',
    customerName: 'John Smith',
    device: 'iPhone 15 Pro',
    currentSLA: 4,
    predictedBreach: 2,
    riskLevel: 'critical',
    reason: 'Part awaiting delivery, technician overloaded',
    confidence: 0.92,
  },
  {
    id: 'sla-2',
    caseId: 'RC-2024-0895',
    customerName: 'Sarah Johnson',
    device: 'MacBook Pro 14"',
    currentSLA: 8,
    predictedBreach: 6,
    riskLevel: 'high',
    reason: 'Complex logic board repair, specialist required',
    confidence: 0.78,
  },
  {
    id: 'sla-3',
    caseId: 'RC-2024-0901',
    customerName: 'Mike Chen',
    device: 'iPad Pro 12.9"',
    currentSLA: 12,
    predictedBreach: 10,
    riskLevel: 'medium',
    reason: 'Display assembly delayed from supplier',
    confidence: 0.65,
  },
];

export const mockEscalationRisks: EscalationRisk[] = [
  {
    id: 'esc-1',
    caseId: 'RC-2024-0887',
    customerName: 'Emily Davis',
    issue: 'Repeated failed repairs',
    escalationProbability: 0.89,
    topReasons: ['3rd repair attempt', 'Customer expressed frustration', 'VIP account'],
    suggestedAction: 'Assign senior technician, offer replacement device',
  },
  {
    id: 'esc-2',
    caseId: 'RC-2024-0890',
    customerName: 'Robert Wilson',
    issue: 'Extended wait time',
    escalationProbability: 0.72,
    topReasons: ['14 days since intake', 'No status updates in 5 days'],
    suggestedAction: 'Immediate status call, expedite repair',
  },
];

export const mockStockoutPredictions: StockoutPrediction[] = [
  {
    id: 'stock-1',
    partNumber: 'APL-IP15-DSP',
    partName: 'iPhone 15 Pro Display Assembly',
    currentStock: 12,
    predictedDemand: 45,
    daysUntilStockout: 3,
    confidence: 0.94,
    suggestedOrder: 50,
  },
  {
    id: 'stock-2',
    partNumber: 'APL-MBP-BAT',
    partName: 'MacBook Pro Battery',
    currentStock: 8,
    predictedDemand: 22,
    daysUntilStockout: 5,
    confidence: 0.87,
    suggestedOrder: 30,
  },
  {
    id: 'stock-3',
    partNumber: 'APL-AW-SCR',
    partName: 'Apple Watch Screen',
    currentStock: 25,
    predictedDemand: 35,
    daysUntilStockout: 8,
    confidence: 0.71,
    suggestedOrder: 20,
  },
];

export const mockAIAlerts: AIAlert[] = [
  {
    id: 'alert-1',
    type: 'sla_breach',
    severity: 'critical',
    title: 'SLA Breach Imminent',
    description: 'RC-2024-0892 will breach SLA in 2 hours. Recommend immediate escalation.',
    timestamp: new Date(Date.now() - 5 * 60000),
    actionLabel: 'View Case',
    actionId: 'RC-2024-0892',
  },
  {
    id: 'alert-2',
    type: 'stockout',
    severity: 'warning',
    title: 'Critical Stock Alert',
    description: 'iPhone 15 Pro Display Assembly will stockout in 3 days. 12 pending cases affected.',
    timestamp: new Date(Date.now() - 15 * 60000),
    actionLabel: 'Order Parts',
    actionId: 'APL-IP15-DSP',
  },
  {
    id: 'alert-3',
    type: 'anomaly',
    severity: 'warning',
    title: 'Failure Spike Detected',
    description: 'MacBook Pro keyboard repairs increased 340% this week. Possible batch defect.',
    timestamp: new Date(Date.now() - 45 * 60000),
    actionLabel: 'Investigate',
    actionId: 'anomaly-mbp-kb',
  },
  {
    id: 'alert-4',
    type: 'recommendation',
    severity: 'info',
    title: 'Efficiency Opportunity',
    description: 'Reassigning 3 cases from overloaded technicians could reduce SLA risks by 40%.',
    timestamp: new Date(Date.now() - 120 * 60000),
    actionLabel: 'Review',
    actionId: 'rec-rebalance',
  },
];

export const mockTechnicianLoads: TechnicianLoad[] = [
  { id: 'tech-1', name: 'Alex Thompson', activeCases: 8, capacity: 6, efficiency: 94, status: 'overloaded' },
  { id: 'tech-2', name: 'Maria Garcia', activeCases: 5, capacity: 6, efficiency: 98, status: 'busy' },
  { id: 'tech-3', name: 'James Lee', activeCases: 6, capacity: 6, efficiency: 91, status: 'busy' },
  { id: 'tech-4', name: 'Sophie Brown', activeCases: 3, capacity: 6, efficiency: 96, status: 'available' },
  { id: 'tech-5', name: 'David Kim', activeCases: 4, capacity: 6, efficiency: 89, status: 'available' },
];

export const mockRepairBottlenecks: RepairBottleneck[] = [
  { id: 'bn-1', stage: 'Parts Receiving', casesBlocked: 18, avgWaitTime: 24, topCause: 'Supplier delays', trend: 'increasing' },
  { id: 'bn-2', stage: 'Quality Check', casesBlocked: 12, avgWaitTime: 8, topCause: 'Staff shortage', trend: 'stable' },
  { id: 'bn-3', stage: 'Customer Approval', casesBlocked: 7, avgWaitTime: 48, topCause: 'No response', trend: 'decreasing' },
];

export const mockActiveAgents: ActiveAgent[] = [
  { id: 'agent-1', name: 'SLA Monitor', status: 'running', task: 'Analyzing 156 active cases for SLA risk', progress: 78, lastUpdate: new Date() },
  { id: 'agent-2', name: 'Demand Forecaster', status: 'completed', task: 'Generated 7-day parts demand forecast', lastUpdate: new Date(Date.now() - 30 * 60000) },
  { id: 'agent-3', name: 'Anomaly Detector', status: 'running', task: 'Scanning repair patterns for anomalies', progress: 45, lastUpdate: new Date() },
  { id: 'agent-4', name: 'Knowledge Indexer', status: 'waiting', task: 'Queued: Index new service manuals', lastUpdate: new Date(Date.now() - 60 * 60000) },
];

// Summary stats for dashboard header
export const mockDashboardStats = {
  activeCases: 156,
  slaAtRisk: 8,
  avgResolutionTime: 18.5,
  customerSatisfaction: 94.2,
  partsAtRisk: 3,
  technicianUtilization: 87,
};
