import React, { useState, useMemo, useEffect } from 'react';
import { useNotebookStore } from '@/lib/notebookStore';
import { analyzeDataset } from '@/lib/dataAnalysis';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, CheckCircle } from 'lucide-react';
import cloneDeep from 'lodash/cloneDeep';

interface CleaningCellProps {
  cellId: string;
  index: number;
}

export const CleaningCell = ({ cellId, index }: CleaningCellProps) => {
  const { getDatasetForCell, setCellResult, cells } = useNotebookStore();
  const cell = cells.find(c => c.id === cellId);
  const isApplied = !!cell?.datasetSnapshot;
  
  const localData = getDatasetForCell(index);
  const summary = useMemo(() => analyzeDataset(localData), [localData]);
  
  const [cleaningAction, setCleaningAction] = useState<string>('drop_missing');
  const [targetCol, setTargetCol] = useState<string>('');
  
  // Set default target col
  useEffect(() => {
    if (summary && summary.columns.length > 0 && !targetCol) {
      const colsWithMissing = summary.columns.filter(c => c.missingCount > 0);
      if (colsWithMissing.length > 0) setTargetCol(colsWithMissing[0].name);
      else setTargetCol(summary.columns[0].name);
    }
  }, [summary, targetCol]);

  const handleApply = () => {
    if (!targetCol && cleaningAction !== 'drop_duplicates') return;
    
    let modifiedData = cloneDeep(localData);
    let message = '';
    
    if (cleaningAction === 'drop_missing') {
      const initialCount = modifiedData.length;
      modifiedData = modifiedData.filter(row => row[targetCol] !== null && row[targetCol] !== undefined && row[targetCol] !== '');
      message = `Removed ${initialCount - modifiedData.length} rows with missing values in ${targetCol}.`;
    } 
    else if (cleaningAction === 'fill_mean') {
      const values = modifiedData.map(r => Number(r[targetCol])).filter(n => !isNaN(n));
      const mean = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      let filledCount = 0;
      modifiedData = modifiedData.map(row => {
        if (row[targetCol] === null || row[targetCol] === undefined || row[targetCol] === '') {
          filledCount++;
          return { ...row, [targetCol]: mean };
        }
        return row;
      });
      message = `Filled ${filledCount} missing values in ${targetCol} with mean (${mean.toFixed(2)}).`;
    }
    else if (cleaningAction === 'drop_duplicates') {
      const initialCount = modifiedData.length;
      const seen = new Set();
      modifiedData = modifiedData.filter(row => {
        const str = JSON.stringify(row);
        if (seen.has(str)) return false;
        seen.add(str);
        return true;
      });
      message = `Removed ${initialCount - modifiedData.length} duplicate rows.`;
    }

    setCellResult(cellId, { message, rowsAfter: modifiedData.length }, modifiedData);
  };

  return (
    <div className="space-y-6">
      {!isApplied ? (
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cleaning Action</label>
            <Select value={cleaningAction} onValueChange={setCleaningAction}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drop_missing">Drop Missing Rows</SelectItem>
                <SelectItem value="fill_mean">Fill Missing with Mean</SelectItem>
                <SelectItem value="drop_duplicates">Drop Entire Duplicate Rows</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {cleaningAction !== 'drop_duplicates' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Column</label>
              <Select value={targetCol || undefined} onValueChange={setTargetCol}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Column" />
                </SelectTrigger>
                <SelectContent>
                  {summary?.columns.map(col => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name} {col.missingCount > 0 ? `(${col.missingCount} missing)` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={handleApply} className="bg-orange-600 hover:bg-orange-700">
            <Play className="w-4 h-4 mr-2" />
            Apply Cleaning
          </Button>
        </div>
      ) : (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-orange-600 mr-3" />
          <div>
            <p className="font-medium text-orange-900">Cleaning Step Applied</p>
            <p className="text-sm text-orange-700 mt-1">{cell?.result?.message}</p>
            <p className="text-xs text-orange-500 mt-1">Dataset now has {cell?.result?.rowsAfter} rows.</p>
          </div>
        </div>
      )}
    </div>
  );
};
