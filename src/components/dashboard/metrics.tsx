'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ title, value, description, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-gray-500">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="mt-2">
            {trend === 'up' && <span className="text-green-600 text-xs">↑ Trending up</span>}
            {trend === 'down' && <span className="text-red-600 text-xs">↓ Trending down</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardMetrics({ metrics }: { metrics: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Total Projects"
        value={metrics.total_projects}
        description="All projects in portfolio"
      />
      <MetricCard
        title="Active Projects"
        value={metrics.active_projects}
        description="Currently in progress"
      />
      <MetricCard
        title="Budget Utilization"
        value={formatPercent(metrics.budget_utilization_percent)}
        description="Actual vs Planned"
      />
      <MetricCard
        title="Schedule Variance"
        value={formatPercent(metrics.schedule_variance_percent)}
        description="On-time completion rate"
      />
      <MetricCard
        title="Open Risks"
        value={metrics.risk_count}
        description="Requiring attention"
      />
      <MetricCard
        title="Resource Utilization"
        value={formatPercent(metrics.resource_utilization_percent)}
        description="Average allocation"
      />
    </div>
  );
}
