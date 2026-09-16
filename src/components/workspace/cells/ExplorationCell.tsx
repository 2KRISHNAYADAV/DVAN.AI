import React, { useMemo } from 'react';
import { useNotebookStore } from '@/lib/notebookStore';
import { analyzeDataset } from '@/lib/dataAnalysis';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ExplorationCellProps {
  cellId: string;
  index: number;
}

export const ExplorationCell = ({ index }: ExplorationCellProps) => {
  const { getDatasetForCell } = useNotebookStore();
  
  // The exploration cell analyzes the dataset output from the PREVIOUS cell
  const localData = getDatasetForCell(index);
  
  const summary = useMemo(() => analyzeDataset(localData), [localData]);

  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0E2931] border rounded-lg">
          <p className="text-sm text-[#E2E2E0]/70 font-medium uppercase">Dataset Shape</p>
          <p className="text-2xl font-bold mt-1">{summary.rowCount} rows × {summary.columnCount} cols</p>
        </div>
        <div className="p-4 bg-[#0E2931] border rounded-lg">
          <p className="text-sm text-[#E2E2E0]/70 font-medium uppercase">Total Missing Values</p>
          <p className="text-2xl font-bold mt-1">
            {summary.columns.reduce((acc, col) => acc + col.missingCount, 0)}
          </p>
        </div>
        <div className="p-4 bg-[#0E2931] border rounded-lg">
          <p className="text-sm text-[#E2E2E0]/70 font-medium uppercase">Duplicate Rows</p>
          <p className="text-2xl font-bold mt-1">
             {/* Simple duplicate detection */}
             {localData.length - new Set(localData.map(r => JSON.stringify(r))).size}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-3">Column Information</h4>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-[#0E2931]">
              <TableRow>
                <TableHead>Column Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Missing</TableHead>
                <TableHead>Unique</TableHead>
                <TableHead>Min/Max/Categories</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.columns.map((col) => (
                <TableRow key={col.name}>
                  <TableCell className="font-medium">{col.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      col.type === 'numeric' ? 'bg-blue-100 text-blue-700' :
                      col.type === 'date' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {col.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    {col.missingCount > 0 
                      ? <span className="text-red-600 font-bold">{col.missingCount}</span> 
                      : <span className="text-[#E2E2E0]/60">0</span>}
                  </TableCell>
                  <TableCell>{col.uniqueCount}</TableCell>
                  <TableCell className="text-sm text-[#E2E2E0]/70 truncate max-w-[200px]">
                    {col.type === 'numeric' && col.min !== undefined && col.max !== undefined
                      ? `${col.min.toFixed(2)} → ${col.max.toFixed(2)}`
                      : col.type === 'categorical' && col.topValues
                      ? col.topValues.slice(0, 3).map(v => v.value).join(', ') + '...'
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
