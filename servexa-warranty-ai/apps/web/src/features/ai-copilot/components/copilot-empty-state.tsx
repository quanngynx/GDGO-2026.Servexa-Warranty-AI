import { Sparkles, Zap, Shield, Brain } from 'lucide-react';
import type { PageContext } from '../types';
import { getContextLabel } from '../hooks/use-page-context';

interface CopilotEmptyStateProps {
  pageContext: PageContext;
}

const capabilities = [
  {
    icon: Brain,
    title: 'RAG-Powered',
    description: 'Answers grounded in your repair data',
  },
  {
    icon: Zap,
    title: 'Context-Aware',
    description: 'Understands your current workspace',
  },
  {
    icon: Shield,
    title: 'Evidence-Based',
    description: 'Shows sources and confidence',
  },
];

export function CopilotEmptyState({ pageContext }: CopilotEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-ai-primary/20 mb-4">
        <Sparkles className="w-6 h-6 text-ai-primary" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-1">
        AI Copilot
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-[240px]">
        Your intelligent assistant for {getContextLabel(pageContext).toLowerCase()} operations
      </p>

      <div className="w-full space-y-3">
        {capabilities.map((cap) => (
          <div 
            key={cap.title}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 text-left"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-ai-accent/10 text-ai-accent shrink-0">
              <cap.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{cap.title}</p>
              <p className="text-xs text-muted-foreground">{cap.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
