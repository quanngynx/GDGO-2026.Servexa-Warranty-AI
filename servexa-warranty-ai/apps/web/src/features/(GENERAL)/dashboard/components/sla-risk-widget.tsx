import { Badge } from '@servexa-warranty-ai/ui/components/badge';
import { Button } from '@servexa-warranty-ai/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@servexa-warranty-ai/ui/components/card';
import { Progress } from '@servexa-warranty-ai/ui/components/progress';
import { Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { mockSLARisks, type SLARisk } from '../data/mock-data';

const riskColors: Record<SLARisk['riskLevel'], string> = {
  critical: 'text-alert-critical',
  high: 'text-alert-warning',
  medium: 'text-ai-accent',
  low: 'text-alert-success',
};

const riskBgColors: Record<SLARisk['riskLevel'], string> = {
  critical: 'bg-alert-critical',
  high: 'bg-alert-warning',
  medium: 'bg-ai-accent',
  low: 'bg-alert-success',
};

export function SLARiskWidget() {
  const criticalCount = mockSLARisks.filter(r => r.riskLevel === 'critical').length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-alert-critical/20">
            <Clock className="w-4 h-4 text-alert-critical" />
          </div>
          <div>
            <CardTitle className="text-base">SLA Risk</CardTitle>
            <p className="text-xs text-muted-foreground">Predicted breaches</p>
          </div>
        </div>
        {criticalCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {criticalCount} critical
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {mockSLARisks.slice(0, 3).map((risk) => (
          <div 
            key={risk.id}
            className="p-3 rounded-lg bg-muted/50 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-3.5 h-3.5 ${riskColors[risk.riskLevel]}`} />
                <span className="text-sm font-medium">{risk.caseId}</span>
              </div>
              <Badge variant="outline" className={`text-[10px] ${riskColors[risk.riskLevel]}`}>
                {risk.predictedBreach}h to breach
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">{risk.customerName}</span>
              <span className="shrink-0">•</span>
              <span className="truncate">{risk.device}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">SLA Progress</span>
                <span className={riskColors[risk.riskLevel]}>
                  {Math.round(risk.confidence * 100)}% confidence
                </span>
              </div>
              <Progress 
                value={(1 - risk.predictedBreach / risk.currentSLA) * 100} 
                className="h-1.5"
              />
            </div>
            
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {risk.reason}
            </p>
          </div>
        ))}
        
        <Button variant="ghost" size="sm" className="w-full text-xs gap-1">
          View all {mockSLARisks.length} at-risk cases
          <ArrowRight className="w-3 h-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
