import { Button } from '@servexa-warranty-ai/ui/components/button';
import { Sparkles, PanelRightClose, PanelRightOpen, RotateCcw } from 'lucide-react';
import type { PageContext } from '../types';
import { getContextLabel } from '../hooks/use-page-context';

interface CopilotHeaderProps {
  pageContext: PageContext;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  onReload: () => void;
  hasMessages: boolean;
}

export function CopilotHeader({
  pageContext,
  isExpanded,
  onToggleExpand,
  onClose,
  onReload,
  hasMessages,
}: CopilotHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-ai-surface/50">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-ai-primary/20">
          <Sparkles className="w-4 h-4 text-ai-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">AI Assist</span>
          <span className="text-xs text-muted-foreground">
            Context: {getContextLabel(pageContext)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {hasMessages && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onReload}
            title="Start new conversation"
            aria-label="Start new conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onToggleExpand}
          title={isExpanded ? 'Collapse' : 'Expand'}
          aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
        >
          {isExpanded ? (
            <PanelRightClose className="w-4 h-4" />
          ) : (
            <PanelRightOpen className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}