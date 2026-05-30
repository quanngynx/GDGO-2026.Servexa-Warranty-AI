import { Badge } from '@servexa-warranty-ai/ui/components/badge';
import { Button } from '@servexa-warranty-ai/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@servexa-warranty-ai/ui/components/card';
import { ScrollArea } from '@servexa-warranty-ai/ui/components/scroll-area';
import { 
  AlertTriangle, 
  Clock, 
  Package, 
  TrendingUp, 
  Lightbulb,
  ArrowRight,
  Bell
} from 'lucide-react';
import { mockAIAlerts, type AIAlert } from '../data/mock-data';

const alertIcons: Record<AIAlert['type'], React.ReactNode> = {
  sla_breach: <Clock className="w-4 h-4" />,
  escalation: <AlertTriangle className="w-4 h-4" />,
  stockout: <Package className="w-4 h-4" />,
  anomaly: <TrendingUp className="w-4 h-4" />,
  recommendation: <Lightbulb className="w-4 h-4" />,
};

const severityStyles: Record<AIAlert['severity'], string> = {
  critical: 'bg-alert-critical/10 text-alert-critical border-alert-critical/30',
  warning: 'bg-alert-warning/10 text-alert-warning border-alert-warning/30',
  info: 'bg-ai-accent/10 text-ai-accent border-ai-accent/30',
};

const severityBadgeStyles: Record<AIAlert['severity'], string> = {
  critical: 'bg-alert-critical text-alert-critical-foreground',
  warning: 'bg-alert-warning text-alert-warning-foreground',
  info: 'bg-ai-accent text-background',
};

function formatTimeAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function AIAlertsFeed() {
  return (
    <Card className="col-span-full lg:col-span-1 row-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ai-primary/20">
            <Bell className="w-4 h-4 text-ai-primary" />
          </div>
          <div>
            <CardTitle className="text-base">AI Alerts</CardTitle>
            <p className="text-xs text-muted-foreground">Real-time intelligence</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {mockAIAlerts.filter(a => a.severity === 'critical').length} critical
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 p-4 pt-0">
            {mockAIAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${severityStyles[alert.severity]}`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {alertIcons[alert.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{alert.title}</span>
                      <Badge className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${severityBadgeStyles[alert.severity]}`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-muted-foreground">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                      {alert.actionLabel && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs gap-1 px-2"
                        >
                          {alert.actionLabel}
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
