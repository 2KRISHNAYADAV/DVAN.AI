import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/store';
import { DatasetSummary } from '@/lib/dataAnalysis';
import { ChartRecommendation } from '@/lib/chartRecommendations';
import { InteractiveChart } from '@/components/dashboard/InteractiveChart';
import { Plus, LayoutDashboard } from 'lucide-react';

interface DashboardBuilderProps {
  summary: DatasetSummary;
}

export const DashboardBuilder = ({ summary }: DashboardBuilderProps) => {
  const [customCharts, setCustomCharts] = useState<ChartRecommendation[]>([]);
  
  const [chartType, setChartType] = useState<'line'|'bar'|'pie'|'scatter'>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  
  const handleAddChart = () => {
    if (!xAxis || !yAxis) return;
    
    const newChart: ChartRecommendation = {
      id: `custom-${Date.now()}`,
      type: chartType,
      title: `${yAxis} by ${xAxis} (${chartType})`,
      description: 'Custom manual chart',
      xAxis,
      yAxis,
      engine: chartType === 'scatter' ? 'plotly' : 'recharts'
    };
    
    setCustomCharts([...customCharts, newChart]);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-blue-100">
        <CardHeader className="bg-blue-50/50 pb-4">
          <CardTitle className="flex items-center text-lg text-blue-900">
            <LayoutDashboard className="w-5 h-5 mr-2 text-blue-600" />
            Manual Dashboard Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Type</label>
              <Select value={chartType} onValueChange={(val: any) => setChartType(val)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">X-Axis (Dimension)</label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select X Axis" />
                </SelectTrigger>
                <SelectContent>
                  {summary.columns.map(col => (
                    <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Y-Axis (Measure)</label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Y Axis" />
                </SelectTrigger>
                <SelectContent>
                  {summary.columns.filter(c => c.type === 'numeric').map(col => (
                    <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAddChart} disabled={!xAxis || !yAxis} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Chart
            </Button>
          </div>
        </CardContent>
      </Card>

      {customCharts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {customCharts.map(chart => (
            <div key={chart.id} className="relative group">
              <InteractiveChart chart={chart} />
              <Button 
                variant="destructive" 
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setCustomCharts(customCharts.filter(c => c.id !== chart.id))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {customCharts.length === 0 && (
        <div className="border-2 border-dashed border-[#2B7574]/30 rounded-xl p-12 text-center text-[#E2E2E0]/70">
          No custom charts yet. Use the builder above to create your own views.
        </div>
      )}
    </div>
  );
};
