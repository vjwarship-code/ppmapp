'use client';

import { useResources, useAllocations } from '@/lib/hooks';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingPage } from '@/components/ui/loading';
import { formatCurrency } from '@/lib/utils';

export default function ResourcesPage() {
  const { data: resources = [], isLoading } = useResources();
  const { data: allocations = [] } = useAllocations();

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Resource Management</h1>
          <p className="text-gray-600 mt-1">
            Manage team resources and allocations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No resources found
                      </td>
                    </tr>
                  ) : (
                    resources.map((resource) => {
                      const resourceAllocations = allocations.filter(
                        (a: any) => a.resource_id === resource.id
                      );
                      const totalAllocation = resourceAllocations.reduce(
                        (sum, a: any) => sum + a.allocation_percentage,
                        0
                      );
                      const isOverAllocated = totalAllocation > resource.availability_percent;

                      return (
                        <tr key={resource.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{resource.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{resource.role}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatCurrency(parseFloat(String(resource.cost_rate)))}/hr
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{resource.availability_percent}%</td>
                          <td className="px-4 py-3">
                            {isOverAllocated ? (
                              <Badge variant="red">Over-allocated ({totalAllocation}%)</Badge>
                            ) : (
                              <Badge variant="green">Available</Badge>
                            )}
                          </td>
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
