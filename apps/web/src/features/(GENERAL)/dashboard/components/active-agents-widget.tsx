import { Badge } from '@servexa-warranty-ai/ui/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@servexa-warranty-ai/ui/components/card';
import { Progress } from '@servexa-warranty-ai/ui/components/progress';
import { Bot, Play, CheckCircle, Clock } from 'lucide-react';
import { mockActiveAgents, type ActiveAgent } from '../data/mock-data';
import { useTranslation } from "react-i18next";

const statusConfig: Record<ActiveAgent['status'], { icon: React.ReactNode; color: string; label: string }> = {
  running: { 
    icon: <Play className="w-3 h-3" />, 
    color: 'bg-ai-primary text-primary-foreground',
    label: 'Running'
  },
  completed: { 
    icon: <CheckCircle className="w-3 h-3" />, 
    color: 'bg-alert-success text-alert-success-foreground',
    label: 'Done'
  },
  waiting: { 
    icon: <Clock className="w-3 h-3" />, 
    color: 'bg-muted text-muted-foreground',
    label: 'Queued'
  },
};

function formatTimeAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function ActiveAgentsWidget() {
    const { t } = useTranslation();
  const runningCount = mockActiveAgents.filter(a => a.status === 'running').length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ai-glow/20">
            <Bot className="w-4 h-4 text-ai-glow" />
          </div>
          <div>
            <CardTitle className="text-base">{t("AI Agents")}</CardTitle>
            <p className="text-xs text-muted-foreground">{t("Background intelligence")}</p>
          </div>
        </div>
        <Badge className="text-xs bg-ai-primary/20 text-ai-primary">
          {runningCount} {t("active")}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockActiveAgents.map((agent) => {
          const status = statusConfig[agent.status];
          
          return (
            <div 
              key={agent.id}
              className="p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={`text-[10px] px-1.5 gap-1 ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </Badge>
                  <span className="text-sm font-medium">{agent.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {formatTimeAgo(agent.lastUpdate)}
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">
                {agent.task}
              </p>
              
              {agent.progress !== undefined && agent.status === 'running' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">{t("Progress")}</span>
                    <span className="text-ai-primary">{agent.progress}%</span>
                  </div>
                  <Progress value={agent.progress} className="h-1" />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
