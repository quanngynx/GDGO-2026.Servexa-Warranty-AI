import { Button } from '@servexa-warranty-ai/ui/components/button';
import { 
  Plus, 
  AlertTriangle, 
  Eye, 
  ArrowRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { AIAction } from '../types';

interface CopilotActionsProps {
  actions: AIAction[];
  onAction: (action: AIAction) => void;
}

const actionIcons: Record<string, React.ReactNode> = {
  create_task: <Plus className="w-3.5 h-3.5" />,
  escalate: <AlertTriangle className="w-3.5 h-3.5" />,
  view_similar: <Eye className="w-3.5 h-3.5" />,
  approve: <CheckCircle className="w-3.5 h-3.5" />,
  reject: <XCircle className="w-3.5 h-3.5" />,
  default: <ArrowRight className="w-3.5 h-3.5" />,
};

export function CopilotActions({ actions, onAction }: CopilotActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant || 'secondary'}
          size="sm"
          className="h-7 text-xs gap-1.5"
          onClick={() => onAction(action)}
        >
          {actionIcons[action.action] || actionIcons.default}
          {action.label}
        </Button>
      ))}
    </div>
  );
}
