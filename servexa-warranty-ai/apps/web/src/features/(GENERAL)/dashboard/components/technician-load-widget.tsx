import { Avatar, AvatarFallback } from '@servexa-warranty-ai/ui/components/avatar';
import { Badge } from '@servexa-warranty-ai/ui/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@servexa-warranty-ai/ui/components/card';
import { Progress } from '@servexa-warranty-ai/ui/components/progress';
import { Users } from 'lucide-react';
import { mockTechnicianLoads, type TechnicianLoad } from '../data/mock-data';

const statusStyles: Record<TechnicianLoad['status'], { color: string; label: string }> = {
  available: { color: 'bg-alert-success', label: 'Available' },
  busy: { color: 'bg-ai-accent', label: 'Busy' },
  overloaded: { color: 'bg-alert-critical', label: 'Overloaded' },
};

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}

export function TechnicianLoadWidget() {
  const overloadedCount = mockTechnicianLoads.filter(t => t.status === 'overloaded').length;
  const avgUtilization = Math.round(
    mockTechnicianLoads.reduce((sum, t) => sum + (t.activeCases / t.capacity) * 100, 0) / mockTechnicianLoads.length
  );
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-operations-teal/20">
            <Users className="w-4 h-4 text-operations-teal" />
          </div>
          <div>
            <CardTitle className="text-base">Technician Load</CardTitle>
            <p className="text-xs text-muted-foreground">{avgUtilization}% avg utilization</p>
          </div>
        </div>
        {overloadedCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {overloadedCount} overloaded
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {mockTechnicianLoads.map((tech) => {
          const utilization = (tech.activeCases / tech.capacity) * 100;
          const status = statusStyles[tech.status];
          
          return (
            <div 
              key={tech.id}
              className="flex items-center gap-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-muted">
                  {getInitials(tech.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{tech.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.color}`} />
                    <span className="text-[10px] text-muted-foreground">
                      {tech.activeCases}/{tech.capacity}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={Math.min(utilization, 100)} 
                  className={`h-1.5 ${utilization > 100 ? '[&>div]:bg-alert-critical' : ''}`}
                />
              </div>
              
              <Badge 
                variant="outline" 
                className="text-[10px] px-1.5 shrink-0"
              >
                {tech.efficiency}%
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
