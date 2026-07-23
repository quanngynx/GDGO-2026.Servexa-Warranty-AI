import { Badge } from '@servexa-warranty-ai/ui/components/badge';
import { Button } from '@servexa-warranty-ai/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@servexa-warranty-ai/ui/components/card';
import { Clock, ArrowRight } from 'lucide-react';
import { AIInsightCard } from '@/components/ai-insight-card';
import { mockSLARisks, type SLARisk } from '../data/mock-data';
import { useTranslation } from "react-i18next";

const severityMap: Record<SLARisk['riskLevel'], 'critical' | 'warning' | 'info' | 'success'> = {
  critical: 'critical',
  high: 'warning',
  medium: 'info',
  low: 'success',
};

export function SLARiskWidget() {
    const { t } = useTranslation();
  const criticalCount = mockSLARisks.filter(r => r.riskLevel === 'critical').length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-alert-critical/20">
            <Clock className="w-4 h-4 text-alert-critical" />
          </div>
          <div>
            <CardTitle className="text-base">{t("SLA Risk")}</CardTitle>
            <p className="text-xs text-muted-foreground">{t("AI-predicted breaches")}</p>
          </div>
        </div>
        {criticalCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {criticalCount} {t("critical")}</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {mockSLARisks.slice(0, 3).map((risk) => (
          <AIInsightCard
            key={risk.id}
            insight={`${risk.caseId} - ${risk.device} for ${risk.customerName} at risk of SLA breach in ${risk.predictedBreach}h`}
            confidence={risk.confidence}
            severity={severityMap[risk.riskLevel]}
            title={`${risk.customerName} - ${risk.device}`}
            compact={true}
            sources={[
              {
                id: `case-${risk.caseId}`,
                type: 'repair_case',
                title: risk.caseId,
                snippet: `Customer: ${risk.customerName} | Device: ${risk.device}`,
              },
            ]}
            actions={[
              {
                id: 'escalate',
                label: 'Escalate',
                action: 'escalate',
                variant: risk.riskLevel === 'critical' ? 'destructive' : 'secondary',
              },
              {
                id: 'view-case',
                label: 'View Case',
                action: 'view_case',
                variant: 'outline',
              },
            ]}
          />
        ))}
        
        <Button variant="ghost" size="sm" className="w-full text-xs gap-1">
          {t("View all")}{mockSLARisks.length} {t("at-risk cases")}<ArrowRight className="w-3 h-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
