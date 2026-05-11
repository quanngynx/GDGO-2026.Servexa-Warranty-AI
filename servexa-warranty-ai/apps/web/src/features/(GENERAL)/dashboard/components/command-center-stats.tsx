import { Card, CardContent } from '@servexa-warranty-ai/ui/components/card';
import { 
  Wrench, 
  AlertTriangle, 
  Clock, 
  ThumbsUp,
  Package,
  Users
} from 'lucide-react';
import { mockDashboardStats } from '../data/mock-data';

const stats = [
  {
    label: 'Active Cases',
    value: mockDashboardStats.activeCases,
    icon: Wrench,
    color: 'text-ai-primary',
    bgColor: 'bg-ai-primary/10',
  },
  {
    label: 'SLA At Risk',
    value: mockDashboardStats.slaAtRisk,
    icon: AlertTriangle,
    color: 'text-alert-critical',
    bgColor: 'bg-alert-critical/10',
    highlight: true,
  },
  {
    label: 'Avg Resolution',
    value: `${mockDashboardStats.avgResolutionTime}h`,
    icon: Clock,
    color: 'text-operations-teal',
    bgColor: 'bg-operations-teal/10',
  },
  {
    label: 'CSAT Score',
    value: `${mockDashboardStats.customerSatisfaction}%`,
    icon: ThumbsUp,
    color: 'text-alert-success',
    bgColor: 'bg-alert-success/10',
  },
  {
    label: 'Parts At Risk',
    value: mockDashboardStats.partsAtRisk,
    icon: Package,
    color: 'text-alert-warning',
    bgColor: 'bg-alert-warning/10',
  },
  {
    label: 'Tech Utilization',
    value: `${mockDashboardStats.technicianUtilization}%`,
    icon: Users,
    color: 'text-ai-accent',
    bgColor: 'bg-ai-accent/10',
  },
];

export function CommandCenterStats() {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className={stat.highlight ? 'border-alert-critical/30 bg-alert-critical/5' : ''}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${stat.highlight ? stat.color : 'text-foreground'}`}>
              {stat.value}
            </p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
