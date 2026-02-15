'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, daysUntil } from '@/lib/utils';

export function UpcomingMilestones({ milestones }: { milestones: any[] }) {
  const upcoming = milestones
    .filter((m) => m.status !== 'completed')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming milestones</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((milestone) => {
              const days = daysUntil(milestone.due_date);
              const isOverdue = days < 0;
              return (
                <div key={milestone.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{milestone.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(milestone.due_date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isOverdue ? 'red' : days <= 7 ? 'yellow' : 'blue'}>
                      {isOverdue ? `${Math.abs(days)}d overdue` : `${days}d`}
                    </Badge>
                    <Badge variant={milestone.status === 'delayed' ? 'red' : 'blue'}>
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
