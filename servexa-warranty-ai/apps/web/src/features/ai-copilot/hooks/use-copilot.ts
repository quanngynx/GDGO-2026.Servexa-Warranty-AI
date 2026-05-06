import { useChat } from '@ai-sdk/react';
import { env } from '@servexa-warranty-ai/env/web';
import { DefaultChatTransport } from 'ai';
import { useCallback, useMemo, useState } from 'react';
import type { AIAction, AISource, CopilotMessage, PageContext } from '../types';
import { usePageContext } from './use-page-context';

// Mock sources for demo - will be replaced with real RAG responses
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
  {
    id: 'src-3',
    type: 'knowledge_base',
    title: 'Technician Notes',
    snippet: 'Common pitfall: ensure flex cable is properly seated',
  },
];

const mockActions: AIAction[] = [
  { id: 'act-1', label: 'Create Task', action: 'create_task', variant: 'default' },
  { id: 'act-2', label: 'Escalate', action: 'escalate', variant: 'destructive' },
  { id: 'act-3', label: 'View Similar Cases', action: 'view_similar', variant: 'outline' },
];

export function useCopilot() {
  const pageContext = usePageContext();
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const { messages: rawMessages, sendMessage, status, error, reload } = useChat({
    transport: new DefaultChatTransport({
      api: `${env.VITE_SERVER_URL}/ai`,
    }),
  });

  // Transform raw messages to CopilotMessage format with mock enrichment
  const messages: CopilotMessage[] = useMemo(() => {
    return rawMessages.map((msg, index) => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.parts?.map(p => p.type === 'text' ? p.text : '').join('') || '',
      // Add mock sources and actions to assistant messages for demo
      sources: msg.role === 'assistant' ? mockSources : undefined,
      actions: msg.role === 'assistant' ? mockActions : undefined,
      confidence: msg.role === 'assistant' ? 0.87 : undefined,
      timestamp: new Date(),
      isStreaming: status === 'streaming' && index === rawMessages.length - 1 && msg.role === 'assistant',
    }));
  }, [rawMessages, status]);

  const send = useCallback((text: string) => {
    if (!text.trim()) return;
    
    // In production, we'd include pageContext in the request
    sendMessage({ 
      text,
      // Can extend with context: JSON.stringify(pageContext) in the actual API
    });
  }, [sendMessage]);

  const handleAction = useCallback((action: AIAction) => {
    // Handle actions - in production this would trigger real operations
    console.log('[v0] Action triggered:', action);
    
    switch (action.action) {
      case 'create_task':
        // Would open task creation modal
        break;
      case 'escalate':
        // Would trigger escalation flow
        break;
      case 'view_similar':
        // Would navigate to similar cases
        break;
      default:
        break;
    }
  }, []);

  const suggestedQueries = useMemo(() => {
    switch (pageContext.type) {
      case 'dashboard':
        return [
          'What repairs are at risk of SLA breach?',
          'Show me today\'s critical alerts',
          'Which technicians are overloaded?',
        ];
      case 'repair_case':
        return [
          'What are similar past cases?',
          'Recommended repair steps',
          'Estimated completion time',
        ];
      case 'inventory':
        return [
          'Parts at risk of stockout',
          'Reorder recommendations',
          'Supplier lead times',
        ];
      default:
        return [
          'Show operational summary',
          'What needs my attention?',
          'Generate report',
        ];
    }
  }, [pageContext.type]);

  return {
    // State
    isOpen,
    isExpanded,
    pageContext,
    messages,
    isLoading: status === 'streaming' || status === 'submitted',
    error,
    suggestedQueries,
    
    // Actions
    setIsOpen,
    setIsExpanded,
    send,
    reload,
    handleAction,
  };
}
