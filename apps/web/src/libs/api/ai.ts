import { mockSLARisks, mockStockoutPredictions, mockAIAlerts, mockTechnicianLoads, mockRepairBottlenecks } from '@/features/(GENERAL)/dashboard/data/mock-data';
import { mockSearchResults } from '@/features/ai-search/mock-data';
import type { PageContext, AIInsight, AISource, AIAction } from '@/features/ai/types';
import type { SearchResult } from '@/features/ai-search/types';

/**
 * AI API Abstraction Layer
 * This layer bridges between the frontend and backend AI services.
 * It provides mock data for demo and can be replaced with real API calls.
 */

export const aiApi = {
  /**
   * Query the AI with context awareness
   */
  query: async (prompt: string, context: PageContext): Promise<{
    answer: string;
    sources: AISource[];
    actions: AIAction[];
    confidence: number;
  }> => {
    // In production, this would call the backend AI endpoint
    // For now, return mock responses based on context

    const mockSources: AISource[] = [
      {
        id: 'src-1',
        type: 'repair_case',
        title: 'Similar Case RC-2024-0892',
        snippet: 'iPhone 15 Pro display replacement - resolved in 2 hours',
      },
      {
        id: 'src-2',
        type: 'manual',
        title: 'Service Manual: Display Assembly',
        snippet: 'Section 4.2 - OLED replacement procedure',
      },
    ];

    const mockActions: AIAction[] = [
      { id: 'act-1', label: 'Create Task', action: 'create_task', variant: 'default' },
      { id: 'act-2', label: 'Escalate', action: 'escalate', variant: 'destructive' },
    ];

    return {
      answer: `Based on context (${context.type}): ${prompt}`,
      sources: mockSources,
      actions: mockActions,
      confidence: 0.85,
    };
  },

  /**
   * Global semantic search across all entity types
   */
  search: async (query: string): Promise<SearchResult[]> => {
    // In production, this would call a semantic search backend
    // For now, filter mock data
    return mockSearchResults.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.subtitle?.toLowerCase().includes(query.toLowerCase())
    );
  },

  /**
   * Get insights for a specific repair case
   */
  getCaseInsights: async (caseId: string): Promise<AIInsight[]> => {
    // In production, this would fetch case-specific insights from the backend
    return [
      {
        id: 'insight-1',
        content: 'This case has similar components to RC-2024-0887. Consider cross-referencing repair procedures.',
        confidence: 0.92,
        sources: [
          {
            id: 'case-ref',
            type: 'repair_case',
            title: 'RC-2024-0887',
            snippet: 'MacBook Pro logic board repair - 3 days resolution time',
          },
        ],
        actions: [
          {
            id: 'view-similar',
            label: 'View Similar Cases',
            action: 'view_similar',
            variant: 'outline',
          },
        ],
        timestamp: new Date(),
      },
    ];
  },

  /**
   * Get all active alerts
   */
  getAlerts: async () => {
    return mockAIAlerts;
  },

  /**
   * Get SLA risk predictions
   */
  getSLARisks: async () => {
    return mockSLARisks;
  },

  /**
   * Get supply chain alerts
   */
  getSupplyChainAlerts: async () => {
    return mockStockoutPredictions;
  },

  /**
   * Get technician workload insights
   */
  getTechnicianLoads: async () => {
    return mockTechnicianLoads;
  },

  /**
   * Get repair bottleneck analysis
   */
  getBottlenecks: async () => {
    return mockRepairBottlenecks;
  },

  /**
   * Generate actionable recommendations
   */
  getRecommendations: async (context: PageContext): Promise<{
    insights: AIInsight[];
    actions: AIAction[];
  }> => {
    return {
      insights: [],
      actions: [
        {
          id: 'action-1',
          label: 'Rebalance Workload',
          action: 'rebalance_workload',
          variant: 'default',
        },
        {
          id: 'action-2',
          label: 'Order Parts',
          action: 'order_parts',
          variant: 'default',
        },
      ],
    };
  },

  /**
   * Stream AI response for real-time updates
   * (Can be replaced with Server-Sent Events or WebSocket)
   */
  streamQuery: async (
    prompt: string,
    context: PageContext,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    // Simulate streaming response
    const response = `Based on context (${context.type}): ${prompt}`;
    for (const char of response) {
      onChunk(char);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  },
};

export type { PageContext, AIInsight, AISource, AIAction };
export type { SearchResult };