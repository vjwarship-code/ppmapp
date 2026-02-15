'use client';

import { useRisksIssues } from '@/lib/hooks';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingPage } from '@/components/ui/loading';
import { getSeverityColor, getSeverityLabel, formatDate } from '@/lib/utils';

export default function RisksPage() {
  const { data: risksIssues = [], isLoading } = useRisksIssues();

  if (isLoading) {
    return <LoadingPage />;
  }

  const risks = risksIssues.filter((r) => r.type === 'risk');
  const issues = risksIssues.filter((r) => r.type === 'issue');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Risks & Issues</h1>
          <p className="text-gray-600 mt-1">
            Track and manage project risks and issues
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Open Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {risks.filter((r) => r.status === 'open').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {issues.filter((i) => i.status === 'open').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Risks & Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {risksIssues.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No risks or issues found
                      </td>
                    </tr>
                  ) : (
                    risksIssues.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Badge variant={item.type === 'risk' ? 'yellow' : 'red'}>
                            {item.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{item.title}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {item.severity && (
                            <Badge variant={getSeverityColor(item.severity)}>
                              {getSeverityLabel(item.severity)} ({item.severity})
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              item.status === 'open'
                                ? 'red'
                                : item.status === 'in-progress'
                                ? 'yellow'
                                : 'green'
                            }
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.due_date ? formatDate(item.due_date) : '-'}
                        </td>
                      </tr>
                    ))
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
