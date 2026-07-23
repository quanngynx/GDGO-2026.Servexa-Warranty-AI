import { Badge } from '@servexa-warranty-ai/ui/components/badge';
import { Button } from '@servexa-warranty-ai/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@servexa-warranty-ai/ui/components/card';
import { Package, ShoppingCart } from 'lucide-react';
import { AIInsightCard } from '@/components/ai-insight-card';
import { mockStockoutPredictions } from '../data/mock-data';
import { useTranslation } from "react-i18next";

function getRiskSeverity(days: number): 'critical' | 'warning' | 'info' | 'success' {
  if (days <= 3) return 'critical';
  if (days <= 7) return 'warning';
  return 'info';
}

export function StockoutPredictionWidget() {
    const { t } = useTranslation();
  const criticalCount = mockStockoutPredictions.filter(p => p.daysUntilStockout <= 3).length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-alert-warning/20">
            <Package className="w-4 h-4 text-alert-warning" />
          </div>
          <div>
            <CardTitle className="text-base">{t("Stockout Risk")}</CardTitle>
            <p className="text-xs text-muted-foreground">{t("AI supply chain predictions")}</p>
          </div>
        </div>
        {criticalCount > 0 && (
          <Badge className="text-xs bg-alert-warning text-alert-warning-foreground">
            {criticalCount} {t("critical")}</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {mockStockoutPredictions.slice(0, 3).map((prediction) => (
          <AIInsightCard
            key={prediction.id}
            insight={`${prediction.partName} (${prediction.partNumber}) will stockout in ${prediction.daysUntilStockout} days. Current: ${prediction.currentStock} units, Predicted demand: ${prediction.predictedDemand}, Recommended order: ${prediction.suggestedOrder}`}
            confidence={prediction.confidence}
            severity={getRiskSeverity(prediction.daysUntilStockout)}
            title={prediction.partName}
            compact={true}
            sources={[
              {
                id: `part-${prediction.partNumber}`,
                type: 'inventory',
                title: prediction.partNumber,
                snippet: `Current stock: ${prediction.currentStock} | Predicted demand: ${prediction.predictedDemand}`,
              },
            ]}
            actions={[
              {
                id: 'order-part',
                label: 'Order Now',
                action: 'order_part',
                variant: prediction.daysUntilStockout <= 3 ? 'default' : 'secondary',
                icon: ShoppingCart.name,
              },
              {
                id: 'view-supplier',
                label: 'View Suppliers',
                action: 'view_supplier',
                variant: 'outline',
              },
            ]}
          />
        ))}
        
        <Button variant="ghost" size="sm" className="w-full text-xs gap-1">
          {t("View all")}{mockStockoutPredictions.length} {t("predictions")}</Button>
      </CardContent>
    </Card>
  );
}
