'use client';

import { useBudgetEntries, useProjects } from '@/lib/hooks';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingPage } from '@/components/ui/loading';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function BudgetPage() {
  const { data: budgetEntries = [], isLoading } = useBudgetEntries();
  const { data: projects = [] } = useProjects();

  if (isLoading) {
    return <LoadingPage />;
  }

  const totalPlanned = budgetEntries
    .filter((e) => e.type === 'planned')
    .reduce((sum, e) => sum + parseFloat(String(e.amount)), 0);

  const totalActual = budgetEntries
    .filter((e) => e.type === 'actual')
    .reduce((sum, e) => sum + parseFloat(String(e.amount)), 0);

  const variance = totalPlanned - totalActual;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Budget Tracking</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage project budgets
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Planned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPlanned)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalActual)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(variance))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {variance >= 0 ? 'Under budget' : 'Over budget'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Budget Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgetEntries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No budget entries found
                      </td>
                    </tr>
                  ) : (
                    budgetEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Badge variant={entry.type === 'actual' ? 'green' : entry.type === 'planned' ? 'blue' : 'yellow'}>
                            {entry.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{entry.category.toUpperCase()}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {formatCurrency(parseFloat(String(entry.amount)))}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(entry.date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{entry.notes || '-'}</td>
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
