'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSeverityColor, getSeverityLabel } from '@/lib/utils';

export function RiskHeatmap({ risks }: { risks: any[] }) {
  // Create 5x5 grid for probability (1-5) x impact (1-5)
  const matrix = Array.from({ length: 5 }, () => Array(5).fill(0));

  risks.forEach((risk) => {
    if (risk.probability && risk.impact && risk.status === 'open') {
      matrix[5 - risk.probability][risk.impact - 1]++;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-6 gap-2">
            <div className="text-xs font-medium flex items-center justify-center">Prob.</div>
            {[1, 2, 3, 4, 5].map((impact) => (
              <div key={impact} className="text-xs font-medium flex items-center justify-center">
                Impact {impact}
              </div>
            ))}
          </div>
          {[5, 4, 3, 2, 1].map((probability, probIdx) => (
            <div key={probability} className="grid grid-cols-6 gap-2">
              <div className="text-xs font-medium flex items-center justify-center h-16">
                {probability}
              </div>
              {[1, 2, 3, 4, 5].map((impact) => {
                const count = matrix[probIdx][impact - 1];
                const severity = probability * impact;
                const color = getSeverityColor(severity);
                return (
                  <div
                    key={impact}
                    className={`h-16 flex items-center justify-center rounded border-2 ${
                      color === 'green'
                        ? 'bg-green-100 border-green-300'
                        : color === 'amber'
                        ? 'bg-amber-100 border-amber-300'
                        : 'bg-red-100 border-red-300'
                    }`}
                  >
                    <span className="text-lg font-bold">{count || ''}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
            <span>Low (1-5)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-amber-100 border-2 border-amber-300 rounded"></div>
            <span>Medium (6-12)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
            <span>High (13-25)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
