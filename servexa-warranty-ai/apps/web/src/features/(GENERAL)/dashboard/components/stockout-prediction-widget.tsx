import { Badge } from '@servexa-warranty-ai/ui/components/badge';
import { Button } from '@servexa-warranty-ai/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@servexa-warranty-ai/ui/components/card';
import { Package, TrendingDown, ShoppingCart } from 'lucide-react';
import { mockStockoutPredictions } from '../data/mock-data';

function getRiskLevel(days: number): { color: string; label: string } {
  if (days <= 3) return { color: 'text-alert-critical', label: 'Critical' };
  if (days <= 7) return { color: 'text-alert-warning', label: 'Warning' };
  return { color: 'text-ai-accent', label: 'Monitor' };
}

export function StockoutPredictionWidget() {
  const criticalCount = mockStockoutPredictions.filter(p => p.daysUntilStockout <= 3).length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-alert-warning/20">
            <Package className="w-4 h-4 text-alert-warning" />
          </div>
          <div>
            <CardTitle className="text-base">Stockout Risk</CardTitle>
            <p className="text-xs text-muted-foreground">Supply chain AI</p>
          </div>
        </div>
        {criticalCount > 0 && (
          <Badge className="text-xs bg-alert-warning text-alert-warning-foreground">
            {criticalCount} critical
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {mockStockoutPredictions.map((prediction) => {
          const risk = getRiskLevel(prediction.daysUntilStockout);
          
          return (
            <div 
              key={prediction.id}
              className="p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{prediction.partName}</p>
                  <p className="text-[10px] text-muted-foreground">{prediction.partNumber}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] shrink-0 ${risk.color}`}>
                  {prediction.daysUntilStockout}d left
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-1.5 rounded bg-background/50">
                  <p className="text-lg font-semibold">{prediction.currentStock}</p>
                  <p className="text-[10px] text-muted-foreground">In Stock</p>
                </div>
                <div className="p-1.5 rounded bg-background/50">
                  <p className="text-lg font-semibold text-alert-warning">{prediction.predictedDemand}</p>
                  <p className="text-[10px] text-muted-foreground">Predicted</p>
                </div>
                <div className="p-1.5 rounded bg-background/50">
                  <p className="text-lg font-semibold text-ai-primary">{prediction.suggestedOrder}</p>
                  <p className="text-[10px] text-muted-foreground">Order</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">
                  {Math.round(prediction.confidence * 100)}% confidence
                </span>
                <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 px-2">
                  <ShoppingCart className="w-3 h-3" />
                  Order
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
