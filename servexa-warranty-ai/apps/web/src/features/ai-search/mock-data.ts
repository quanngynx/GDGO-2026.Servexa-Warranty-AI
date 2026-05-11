import type { SearchResult, AISearchSuggestion, QuickAction } from './types';

export const mockSearchResults: SearchResult[] = [
  {
    id: 'case-1',
    type: 'repair_case',
    title: 'RC-2024-0892',
    subtitle: 'iPhone 15 Pro - Display replacement',
    relevanceScore: 0.95,
    highlight: 'Customer: John Smith - Status: In Progress',
    url: '/repair-cases-management/RC-2024-0892',
  },
  {
    id: 'case-2',
    type: 'repair_case',
    title: 'RC-2024-0887',
    subtitle: 'MacBook Pro 14" - Logic board issue',
    relevanceScore: 0.88,
    highlight: 'Customer: Emily Davis - Status: Pending Parts',
    url: '/repair-cases-management/RC-2024-0887',
  },
  {
    id: 'customer-1',
    type: 'customer',
    title: 'John Smith',
    subtitle: 'VIP Customer - 12 repair history',
    relevanceScore: 0.92,
    url: '/users-customers/john-smith',
  },
  {
    id: 'part-1',
    type: 'part',
    title: 'APL-IP15-DSP',
    subtitle: 'iPhone 15 Pro Display Assembly',
    relevanceScore: 0.90,
    highlight: '12 in stock - 3 days until stockout',
    url: '/products-inventory/APL-IP15-DSP',
  },
  {
    id: 'manual-1',
    type: 'manual',
    title: 'iPhone 15 Pro Display Replacement Guide',
    subtitle: 'Service Manual - Section 4.2',
    relevanceScore: 0.85,
    highlight: 'OLED display assembly procedure with adhesive removal',
  },
  {
    id: 'error-1',
    type: 'error_code',
    title: 'ERR-DSP-001',
    subtitle: 'Display flex cable connection failure',
    relevanceScore: 0.82,
    highlight: 'Common fix: Reseat cable, check for debris',
  },
  {
    id: 'kb-1',
    type: 'knowledge_article',
    title: 'iPhone 15 Pro Face ID Calibration',
    subtitle: 'After display replacement',
    relevanceScore: 0.78,
    highlight: 'Requires Apple Service Toolkit 2 calibration',
  },
  {
    id: 'tech-1',
    type: 'technician',
    title: 'Maria Garcia',
    subtitle: 'Senior Technician - iOS Specialist',
    relevanceScore: 0.75,
    highlight: '98% efficiency - 5 active cases',
    url: '/users-customers/technicians/maria-garcia',
  },
];

export const mockSuggestions: AISearchSuggestion[] = [
  { id: 'recent-1', query: 'iPhone 15 Pro display', type: 'recent' },
  { id: 'recent-2', query: 'cases at risk of SLA breach', type: 'recent' },
  { id: 'recent-3', query: 'Maria Garcia availability', type: 'recent' },
  { id: 'suggest-1', query: 'Show all critical alerts', type: 'suggested', description: 'View urgent items' },
  { id: 'suggest-2', query: 'Parts running low', type: 'suggested', description: 'Inventory at risk' },
  { id: 'suggest-3', query: 'Overloaded technicians', type: 'suggested', description: 'Workload balance' },
];

export const quickActions: QuickAction[] = [
  {
    id: 'action-1',
    label: 'Create Repair Case',
    description: 'Start a new repair case',
    action: 'create_case',
    keywords: ['new', 'create', 'repair', 'case', 'ticket'],
  },
  {
    id: 'action-2',
    label: 'Find Available Technician',
    description: 'Search for available tech',
    action: 'find_technician',
    keywords: ['technician', 'available', 'assign', 'free'],
  },
  {
    id: 'action-3',
    label: 'Check Part Availability',
    description: 'Search inventory',
    action: 'check_inventory',
    keywords: ['part', 'stock', 'inventory', 'available'],
  },
  {
    id: 'action-4',
    label: 'Generate Report',
    description: 'Create operations report',
    action: 'generate_report',
    keywords: ['report', 'export', 'analytics', 'data'],
  },
];

// Simulated search function
export function searchMockData(query: string): SearchResult[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockSearchResults
    .filter(result => 
      result.title.toLowerCase().includes(lowerQuery) ||
      result.subtitle?.toLowerCase().includes(lowerQuery) ||
      result.highlight?.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}
