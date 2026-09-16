import React from 'react';
import { ChartRecommendation } from '@/lib/chartRecommendations';
import { InteractiveChart } from './InteractiveChart';

interface DynamicChartAreaProps {
  recommendations: ChartRecommendation[];
}

export const DynamicChartArea = ({ recommendations }: DynamicChartAreaProps) => {
  // Filter out KPIs, keep only actual charts
  const charts = recommendations.filter(r => r.type !== 'kpi');

  if (charts.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">No charts available for this dataset.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {charts.map((chart) => (
        <InteractiveChart key={chart.id} chart={chart} />
      ))}
    </div>
  );
};

