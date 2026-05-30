export type SearchResultType = 
  | 'repair_case' 
  | 'customer' 
  | 'part' 
  | 'manual' 
  | 'error_code' 
  | 'knowledge_article'
  | 'technician';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  url?: string;
  relevanceScore: number;
  highlight?: string;
  metadata?: Record<string, unknown>;
}

export interface SearchCategory {
  type: SearchResultType;
  label: string;
  results: SearchResult[];
}

export interface AISearchSuggestion {
  id: string;
  query: string;
  description?: string;
  type: 'recent' | 'suggested' | 'quick_action';
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  action: string;
  icon?: string;
  keywords: string[];
}
