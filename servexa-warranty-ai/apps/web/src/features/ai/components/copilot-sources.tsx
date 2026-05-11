import { Badge } from '@servexa-warranty-ai/ui/components/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@servexa-warranty-ai/ui/components/collapsible';
import { 
  Wrench, 
  BookOpen, 
  AlertCircle, 
  Package, 
  User, 
  FileText,
  ChevronDown 
} from 'lucide-react';
import { useState } from 'react';
import type { AISource } from '../types';

interface CopilotSourcesProps {
  sources: AISource[];
  confidence?: number;
}

const sourceIcons: Record<AISource['type'], React.ReactNode> = {
  repair_case: <Wrench className="w-3.5 h-3.5" />,
  manual: <BookOpen className="w-3.5 h-3.5" />,
  error_code: <AlertCircle className="w-3.5 h-3.5" />,
  inventory: <Package className="w-3.5 h-3.5" />,
  customer: <User className="w-3.5 h-3.5" />,
  knowledge_base: <FileText className="w-3.5 h-3.5" />,
};

const sourceLabels: Record<AISource['type'], string> = {
  repair_case: 'Case',
  manual: 'Manual',
  error_code: 'Error',
  inventory: 'Inventory',
  customer: 'Customer',
  knowledge_base: 'KB',
};

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'bg-alert-success/20 text-alert-success';
  if (confidence >= 0.6) return 'bg-alert-warning/20 text-alert-warning';
  return 'bg-muted text-muted-foreground';
}

export function CopilotSources({ sources, confidence }: CopilotSourcesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (sources.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
      <div className="flex items-center gap-2">
        <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <span>{sources.length} sources</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        
        {confidence !== undefined && (
          <Badge 
            variant="secondary" 
            className={`text-[10px] px-1.5 py-0 h-4 ${getConfidenceColor(confidence)}`}
          >
            {Math.round(confidence * 100)}% confidence
          </Badge>
        )}
      </div>

      <CollapsibleContent className="mt-2 space-y-1.5">
        {sources.map((source) => (
          <div
            key={source.id}
            className="flex items-start gap-2 p-2 rounded-md bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-center w-5 h-5 rounded bg-ai-primary/10 text-ai-primary shrink-0 mt-0.5">
              {sourceIcons[source.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground truncate">
                  {source.title}
                </span>
                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 shrink-0">
                  {sourceLabels[source.type]}
                </Badge>
              </div>
              {source.snippet && (
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {source.snippet}
                </p>
              )}
            </div>
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-ai-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm"
              >
                Open
              </a>
            ) : null}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}