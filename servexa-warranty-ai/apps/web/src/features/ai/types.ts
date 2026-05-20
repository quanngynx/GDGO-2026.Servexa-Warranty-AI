export interface AISource {
  id: string;
  type: AISourceType;
  title: string;
  url?: string;
  snippet?: string;
}

export type AISourceType =
  | 'repair_case'
  | 'manual'
  | 'error_code'
  | 'inventory'
  | 'customer'
  | 'knowledge_base';

export interface AIAction {
  id: string;
  label: string;
  action: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  icon?: string;
}

export interface AIInsight {
  id: string;
  content: string;
  confidence: number; // 0-1
  sources: AISource[];
  actions: AIAction[];
  timestamp: Date;
}

export interface PageContext {
  type: 'dashboard' | 'repair_case' | 'inventory' | 'customer' | 'report' | 'settings';
  entityId?: string;
  entityName?: string;
  additionalContext?: Record<string, unknown>;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: AISource[];
  actions?: AIAction[];
  confidence?: number;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface CopilotState {
  isOpen: boolean;
  isExpanded: boolean;
  pageContext: PageContext;
  messages: CopilotMessage[];
  isLoading: boolean;
}