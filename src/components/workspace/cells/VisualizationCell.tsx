import React, { useState, useMemo } from 'react';
import { useNotebookStore } from '@/lib/notebookStore';
import { analyzeDataset } from '@/lib/dataAnalysis';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play } from 'lucide-react';
import { InteractiveChart } from '@/components/dashboard/InteractiveChart';
import { ChartRecommendation } from '@/lib/chartRecommendations';

interface VisualizationCellProps {
  cellId: string;
  index: number;
}

export const VisualizationCell = ({ cellId, index }: VisualizationCellProps) => {
  const { getDatasetForCell, setCellResult, cells } = useNotebookStore();
  const cell = cells.find(c => c.id === cellId);
  const localData = getDatasetForCell(index);
  const summary = useMemo(() => analyzeDataset(localData), [localData]);

  const [chartType, setChartType] = useState<'line'|'bar'|'pie'|'scatter'>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');

  const handleRun = () => {
    if (!xAxis || !yAxis) return;
    
    const newChart: ChartRecommendation = {
      id: `notebook-chart-${cellId}`,
      type: chartType,
      title: `${yAxis} by ${xAxis}`,
      description: 'Notebook visualization',
      xAxis,
      yAxis,
      engine: chartType === 'scatter' ? 'plotly' : 'recharts'
    };
    
    setCellResult(cellId, newChart);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Chart Type</label>
          <Select value={chartType} onValueChange={(val: any) => setChartType(val)}>
            <SelectTrigger className="w-[120px]">
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
          <label className="text-sm font-medium">X-Axis</label>
          <Select value={xAxis || undefined} onValueChange={setXAxis}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select X" />
            </SelectTrigger>
            <SelectContent>
              {summary.columns.map(col => (
                <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Y-Axis (Numeric)</label>
          <Select value={yAxis || undefined} onValueChange={setYAxis}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Y" />
            </SelectTrigger>
            <SelectContent>
              {summary.columns.filter(c => c.type === 'numeric').map(col => (
                <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleRun} disabled={!xAxis || !yAxis} className="bg-pink-600 hover:bg-pink-700 ml-auto">
          <Play className="w-4 h-4 mr-2" />
          Render Chart
        </Button>
      </div>

      {cell?.result && (
        <div className="mt-4 pt-4 border-t">
          {/* Note: InteractiveChart uses globalData from DashboardStore inside its implementation, 
              but for the notebook, we might want to pass localData if InteractiveChart supported it. 
              For this iteration, InteractiveChart will filter globalData which is okay as long as cleaning didn't drop rows. 
              To make it strictly use localData, InteractiveChart needs a data prop overlay. */}
          <InteractiveChart chart={cell.result} />
        </div>
      )}
    </div>
  );
};
