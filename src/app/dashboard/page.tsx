'use client';

import { useDashboardMetrics, useProjects, useBudgetEntries, useRisksIssues, useMilestones } from '@/lib/hooks';
import { Navigation } from '@/components/navigation';
import { DashboardMetrics } from '@/components/dashboard/metrics';
import { StatusChart } from '@/components/dashboard/status-chart';
import { BudgetChart } from '@/components/dashboard/budget-chart';
import { RiskHeatmap } from '@/components/dashboard/risk-heatmap';
import { UpcomingMilestones } from '@/components/dashboard/upcoming-milestones';
import { LoadingPage } from '@/components/ui/loading';

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: budgetEntries = [], isLoading: budgetLoading } = useBudgetEntries();
  const { data: risks = [], isLoading: risksLoading } = useRisksIssues();
  const { data: milestones = [], isLoading: milestonesLoading } = useMilestones();

  if (metricsLoading || projectsLoading || budgetLoading || risksLoading || milestonesLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of all projects, budgets, and risks
          </p>
        </div>

        <div className="space-y-6">
          {/* Metrics */}
          {metrics && <DashboardMetrics metrics={metrics} />}

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <StatusChart projects={projects} />
            <BudgetChart budgetEntries={budgetEntries} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <RiskHeatmap risks={risks} />
            <UpcomingMilestones milestones={milestones} />
          </div>
        </div>
      </main>
    </div>
  );
}
