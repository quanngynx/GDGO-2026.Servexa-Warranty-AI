import { Badge } from '@servexa-warranty-ai/ui/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@servexa-warranty-ai/ui/components/card';
import { GitBranch, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { mockRepairBottlenecks, type RepairBottleneck } from '../data/mock-data';

const trendIcons: Record<RepairBottleneck['trend'], React.ReactNode> = {
  increasing: <TrendingUp className="w-3 h-3 text-alert-critical" />,
  stable: <Minus className="w-3 h-3 text-muted-foreground" />,
  decreasing: <TrendingDown className="w-3 h-3 text-alert-success" />,
};

const trendLabels: Record<RepairBottleneck['trend'], { text: string; color: string }> = {
  increasing: { text: 'Worsening', color: 'text-alert-critical' },
  stable: { text: 'Stable', color: 'text-muted-foreground' },
  decreasing: { text: 'Improving', color: 'text-alert-success' },
};

export function RepairBottlenecksWidget() {
  const totalBlocked = mockRepairBottlenecks.reduce((sum, b) => sum + b.casesBlocked, 0);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ai-primary/20">
            <GitBranch className="w-4 h-4 text-ai-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Repair Bottlenecks</CardTitle>
            <p className="text-xs text-muted-foreground">{totalBlocked} cases blocked</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockRepairBottlenecks.map((bottleneck, index) => {
          const trend = trendLabels[bottleneck.trend];
          
          return (
            <div 
              key={bottleneck.id}
              className="p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-ai-primary/20 text-ai-primary text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium">{bottleneck.stage}</span>
                </div>
                <div className="flex items-center gap-1">
                  {trendIcons[bottleneck.trend]}
                  <span className={`text-[10px] ${trend.color}`}>
                    {trend.text}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {bottleneck.casesBlocked} cases
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Avg {bottleneck.avgWaitTime}h wait</span>
                </div>
              </div>
              
              <p className="text-[11px] text-muted-foreground mt-2">
                Top cause: {bottleneck.topCause}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
