'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function BudgetChart({ budgetEntries }: { budgetEntries: any[] }) {
  const categoryTotals = budgetEntries
    .filter((entry) => entry.type === 'actual')
    .reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + parseFloat(entry.amount);
      return acc;
    }, {} as Record<string, number>);

  const data = Object.entries(categoryTotals).map(([category, value]) => ({
    name: category.toUpperCase(),
    value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
