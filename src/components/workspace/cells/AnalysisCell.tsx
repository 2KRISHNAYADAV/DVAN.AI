import React, { useState, useMemo } from 'react';
import { useNotebookStore } from '@/lib/notebookStore';
import { analyzeDataset } from '@/lib/dataAnalysis';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play } from 'lucide-react';

interface AnalysisCellProps {
  cellId: string;
  index: number;
}

export const AnalysisCell = ({ cellId, index }: AnalysisCellProps) => {
  const { getDatasetForCell, setCellResult, cells } = useNotebookStore();
  const cell = cells.find(c => c.id === cellId);
  const localData = getDatasetForCell(index);
  const summary = useMemo(() => analyzeDataset(localData), [localData]);

  const [operation, setOperation] = useState<string>('sum');
  const [targetCol, setTargetCol] = useState<string>('');
  const [groupBy, setGroupBy] = useState<string>('none');

  const handleRun = () => {
    if (!targetCol) return;

    let result;

    if (groupBy && groupBy !== 'none') {
      const grouped: Record<string, number[]> = {};
      localData.forEach(row => {
        const key = String(row[groupBy] || 'Unknown');
        const val = Number(row[targetCol]);
        if (!isNaN(val)) {
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(val);
        }
      });

      result = Object.entries(grouped).map(([key, values]) => {
        let agg = 0;
        if (operation === 'sum') agg = values.reduce((a, b) => a + b, 0);
        if (operation === 'avg') agg = values.reduce((a, b) => a + b, 0) / values.length;
        if (operation === 'max') agg = Math.max(...values);
        if (operation === 'min') agg = Math.min(...values);
        if (operation === 'count') agg = values.length;
        return { group: key, value: agg };
      }).sort((a, b) => b.value - a.value).slice(0, 10);
      
    } else {
      const values = localData.map(r => Number(r[targetCol])).filter(n => !isNaN(n));
      if (operation === 'sum') result = values.reduce((a, b) => a + b, 0);
      if (operation === 'avg') result = values.reduce((a, b) => a + b, 0) / values.length;
      if (operation === 'max') result = Math.max(...values);
      if (operation === 'min') result = Math.min(...values);
      if (operation === 'count') result = values.length;
    }

    setCellResult(cellId, result);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Operation</label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Op" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sum">Sum</SelectItem>
              <SelectItem value="avg">Average</SelectItem>
              <SelectItem value="count">Count</SelectItem>
              <SelectItem value="max">Max</SelectItem>
              <SelectItem value="min">Min</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Target Column</label>
          <Select value={targetCol || undefined} onValueChange={setTargetCol}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              {summary.columns.filter(c => c.type === 'numeric').map(col => (
                <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E2E2E0]/70">Group By (Optional)</label>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {summary.columns.filter(c => c.type === 'categorical' || c.type === 'date').map(col => (
                <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleRun} disabled={!targetCol} className="bg-indigo-600 hover:bg-indigo-700 ml-auto">
          <Play className="w-4 h-4 mr-2" />
          Run Analysis
        </Button>
      </div>

      {cell?.result !== null && cell?.result !== undefined && (
        <div className="mt-4 p-4 bg-[#0E2931] rounded-lg border">
          <div className="text-sm font-semibold text-[#E2E2E0]/70 mb-2 uppercase">Analysis Output</div>
          {Array.isArray(cell.result) ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">{groupBy}</th>
                    <th className="text-right py-2 px-4">{operation.toUpperCase()} of {targetCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {cell.result.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 px-4">{row.group}</td>
                      <td className="text-right font-medium py-2 px-4 text-indigo-700">
                        {row.value > 1000 ? (row.value / 1000).toFixed(1) + 'k' : row.value.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-3xl font-bold text-indigo-700">
              {typeof cell.result === 'number' && cell.result > 1000 
                ? (cell.result / 1000).toFixed(2) + 'k' 
                : typeof cell.result === 'number' ? cell.result.toFixed(2) : cell.result}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
