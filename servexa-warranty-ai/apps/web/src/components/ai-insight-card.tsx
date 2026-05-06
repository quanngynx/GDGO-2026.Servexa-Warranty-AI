import { Badge } from '@servexa-warranty-ai/ui/components/badge';
import { Button } from '@servexa-warranty-ai/ui/components/button';
import { Card, CardContent, CardHeader } from '@servexa-warranty-ai/ui/components/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@servexa-warranty-ai/ui/components/collapsible';
import { 
  Sparkles, 
  ChevronDown, 
  ExternalLink,
  Wrench,
  BookOpen,
  AlertCircle,
  Package,
  User,
  FileText,
  ArrowRight,
  Info
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@servexa-warranty-ai/ui/lib/utils';

export type AISourceType = 'repair_case' | 'manual' | 'error_code' | 'inventory' | 'customer' | 'knowledge_base';

export interface AISource {
  id: string;
  type: AISourceType;
  title: string;
  url?: string;
  snippet?: string;
}

export interface AIAction {
  id: string;
  label: string;
  action: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

export interface AIInsightCardProps {
  /** The main insight message */
  insight: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** Evidence sources */
  sources?: AISource[];
  /** Suggested actions */
  actions?: AIAction[];
  /** Severity level for styling */
  severity?: 'info' | 'warning' | 'critical' | 'success';
  /** Optional title */
  title?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
  /** Callback when an action is clicked */
  onAction?: (action: AIAction) => void;
  /** Additional class names */
  className?: string;
}

const sourceIcons: Record<AISourceType, React.ReactNode> = {
  repair_case: <Wrench className="w-3.5 h-3.5" />,
  manual: <BookOpen className="w-3.5 h-3.5" />,
  error_code: <AlertCircle className="w-3.5 h-3.5" />,
  inventory: <Package className="w-3.5 h-3.5" />,
  customer: <User className="w-3.5 h-3.5" />,
  knowledge_base: <FileText className="w-3.5 h-3.5" />,
};

const sourceLabels: Record<AISourceType, string> = {
  repair_case: 'Case',
  manual: 'Manual',
  error_code: 'Error',
  inventory: 'Inventory',
  customer: 'Customer',
  knowledge_base: 'KB',
};

const severityStyles = {
  info: {
    border: 'border-ai-accent/30',
    bg: 'bg-ai-accent/5',
    icon: 'text-ai-accent',
    badge: 'bg-ai-accent/20 text-ai-accent',
  },
  warning: {
    border: 'border-alert-warning/30',
    bg: 'bg-alert-warning/5',
    icon: 'text-alert-warning',
    badge: 'bg-alert-warning/20 text-alert-warning',
  },
  critical: {
    border: 'border-alert-critical/30',
    bg: 'bg-alert-critical/5',
    icon: 'text-alert-critical',
    badge: 'bg-alert-critical/20 text-alert-critical',
  },
  success: {
    border: 'border-alert-success/30',
    bg: 'bg-alert-success/5',
    icon: 'text-alert-success',
    badge: 'bg-alert-success/20 text-alert-success',
  },
};

function getConfidenceLabel(confidence: number): { label: string; color: string } {
  if (confidence >= 0.9) return { label: 'Very High', color: 'text-alert-success' };
  if (confidence >= 0.75) return { label: 'High', color: 'text-ai-accent' };
  if (confidence >= 0.5) return { label: 'Medium', color: 'text-alert-warning' };
  return { label: 'Low', color: 'text-muted-foreground' };
}

export function AIInsightCard({
  insight,
  confidence,
  sources = [],
  actions = [],
  severity = 'info',
  title,
  compact = false,
  onAction,
  className,
}: AIInsightCardProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const styles = severityStyles[severity];
  const confidenceInfo = getConfidenceLabel(confidence);

  if (compact) {
    return (
      <div className={cn(
        'flex items-start gap-3 p-3 rounded-lg border',
        styles.border,
        styles.bg,
        className
      )}>
        <div className={cn('flex items-center justify-center w-7 h-7 rounded-md bg-ai-primary/10 shrink-0', styles.icon)}>
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground">{insight}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className={cn('text-[10px] px-1.5', styles.badge)}>
              {Math.round(confidence * 100)}%
            </Badge>
            {sources.length > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {sources.length} sources
              </span>
            )}
          </div>
        </div>
        {actions.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => onAction?.(actions[0])}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn('overflow-hidden', styles.border, className)}>
      <CardHeader className={cn('pb-3', styles.bg)}>
        <div className="flex items-start gap-3">
          <div className={cn('flex items-center justify-center w-9 h-9 rounded-lg bg-ai-primary/10 shrink-0', styles.icon)}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
            )}
            <p className="text-sm text-foreground leading-relaxed">{insight}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-3 space-y-3">
        {/* Confidence and Sources Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Confidence:</span>
              <span className={cn('text-xs font-medium', confidenceInfo.color)}>
                {Math.round(confidence * 100)}% ({confidenceInfo.label})
              </span>
            </div>
          </div>
        </div>

        {/* Sources */}
        {sources.length > 0 && (
          <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
            <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <span>{sources.length} evidence sources</span>
              <ChevronDown className={cn(
                'w-3.5 h-3.5 transition-transform',
                sourcesOpen && 'rotate-180'
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1.5">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-start gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-ai-primary/10 text-ai-primary shrink-0">
                    {sourceIcons[source.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-foreground truncate">
                        {source.title}
                      </span>
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 shrink-0">
                        {sourceLabels[source.type]}
                      </Badge>
                    </div>
                    {source.snippet && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                        {source.snippet}
                      </p>
                    )}
                  </div>
                  {source.url && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            {actions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant || 'secondary'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => onAction?.(action)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Export a simpler version for inline use
export function AIInsightBadge({ 
  confidence, 
  sourceCount 
}: { 
  confidence: number; 
  sourceCount?: number;
}) {
  const confidenceInfo = getConfidenceLabel(confidence);
  
  return (
    <div className="inline-flex items-center gap-2">
      <Badge variant="secondary" className="text-[10px] gap-1">
        <Sparkles className="w-3 h-3" />
        {Math.round(confidence * 100)}%
      </Badge>
      {sourceCount !== undefined && sourceCount > 0 && (
        <span className="text-[10px] text-muted-foreground">
          {sourceCount} sources
        </span>
      )}
    </div>
  );
}
