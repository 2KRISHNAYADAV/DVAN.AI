import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartRecommendation } from '@/lib/chartRecommendations';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Plot from 'react-plotly.js';
import { useDashboardStore } from '@/lib/store';
import { Filter } from 'lucide-react';

interface InteractiveChartProps {
  chart: ChartRecommendation;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c43', '#f95d6a', '#d45087'];

export const InteractiveChart = ({ chart }: InteractiveChartProps) => {
  const { filteredData, addFilter, activeFilters } = useDashboardStore();
  const { id, type, title, xAxis, yAxis, engine } = chart;
  
  const chartData = useMemo(() => {
    if (type === 'bar' || type === 'pie') {
      if (xAxis && yAxis) {
        const aggregated: Record<string, number> = {};
        filteredData.forEach(row => {
          const xVal = String(row[xAxis] || 'Unknown');
          const yVal = Number(row[yAxis] || 0);
          if (!isNaN(yVal)) {
            aggregated[xVal] = (aggregated[xVal] || 0) + yVal;
          }
        });
        return Object.entries(aggregated)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      }
    } else if (type === 'line') {
       return filteredData.slice(0, 50); 
    }
    return filteredData;
  }, [filteredData, type, xAxis, yAxis]);

  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0 && xAxis) {
      const value = data.activePayload[0].payload.name;
      addFilter({ column: xAxis, value });
    }
  };

  const isFiltered = activeFilters.some(f => f.column === xAxis);

  return (
    <Card className="h-[400px] flex flex-col hover:shadow-md transition-shadow overflow-hidden relative">
      {isFiltered && (
        <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center z-10">
          <Filter className="w-3 h-3 mr-1" />
          Filtered
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-[#E2E2E0]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        {engine === 'recharts' ? (
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart data={chartData} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey={xAxis || 'name'} tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey={yAxis || 'value'} stroke="#8b5cf6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            ) : type === 'bar' ? (
              <BarChart data={chartData} onClick={handleChartClick} style={{ cursor: 'pointer' }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : type === 'pie' ? (
              <PieChart onClick={handleChartClick} style={{ cursor: 'pointer' }}>
                 <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                 </Pie>
              </PieChart>
            ) : (
              <div>Unsupported type</div>
            )}
          </ResponsiveContainer>
        ) : (
           <Plot
            data={[
              type === 'scatter' ? {
                x: filteredData.map(d => d[xAxis || '']),
                y: filteredData.map(d => d[yAxis || '']),
                mode: 'markers',
                type: 'scatter',
                marker: { color: '#8b5cf6', size: 8, opacity: 0.7 },
              } : {
                z: [filteredData.map(d => Number(d[yAxis||'']) || 0)],
                type: 'heatmap',
                colorscale: 'Viridis'
              }
            ]}
            layout={{
              autosize: true,
              margin: { t: 10, r: 10, b: 40, l: 40 },
              xaxis: { title: xAxis },
              yaxis: { title: yAxis },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
            config={{ displayModeBar: false }}
          />
        )}
      </CardContent>
    </Card>
  );
};
