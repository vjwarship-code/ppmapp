'use client';

import { useMilestones } from '@/lib/hooks';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingPage } from '@/components/ui/loading';
import { formatDate, daysUntil } from '@/lib/utils';

export default function MilestonesPage() {
  const { data: milestones = [], isLoading } = useMilestones();

  if (isLoading) {
    return <LoadingPage />;
  }

  const pending = milestones.filter((m) => m.status === 'pending').length;
  const completed = milestones.filter((m) => m.status === 'completed').length;
  const delayed = milestones.filter((m) => m.status === 'delayed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Milestones</h1>
          <p className="text-gray-600 mt-1">
            Track project milestones and deliverables
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Delayed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{delayed}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Until</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {milestones.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No milestones found
                      </td>
                    </tr>
                  ) : (
                    milestones.map((milestone) => {
                      const days = daysUntil(milestone.due_date);
                      const isOverdue = days < 0;

                      return (
                        <tr key={milestone.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{milestone.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(milestone.due_date)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={isOverdue ? 'red' : days <= 7 ? 'yellow' : 'blue'}>
                              {isOverdue ? `${Math.abs(days)}d overdue` : `${days}d`}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                milestone.status === 'completed'
                                  ? 'green'
                                  : milestone.status === 'delayed'
                                  ? 'red'
                                  : 'blue'
                              }
                            >
                              {milestone.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{milestone.notes || '-'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
