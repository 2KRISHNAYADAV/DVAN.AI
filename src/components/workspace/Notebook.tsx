import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNotebookStore, CellType } from '@/lib/notebookStore';
import { useDashboardStore } from '@/lib/store';
import { DatasetSummary, analyzeDataset } from '@/lib/dataAnalysis';
import { BookOpen, Plus, Search, Eraser, Calculator, PieChart, BrainCircuit, Sparkles, Type } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CellWrapper } from './CellWrapper';
import { ExplorationCell } from './cells/ExplorationCell';
import { CleaningCell } from './cells/CleaningCell';
import { AnalysisCell } from './cells/AnalysisCell';
import { VisualizationCell } from './cells/VisualizationCell';
import { MLCell } from './cells/MLCell';
import { AICell } from './cells/AICell';
import { NLPCell } from './cells/NLPCell';

interface NotebookProps {
  summary: DatasetSummary; // We pass the initial global summary, but cells will re-analyze their local dataset
}

export const Notebook = ({ summary }: NotebookProps) => {
  const { globalData } = useDashboardStore();
  const { cells, setBaseDataset, addCell, clearNotebook } = useNotebookStore();

  useEffect(() => {
    // Initialize notebook with the global raw data
    if (globalData && globalData.length > 0) {
      setBaseDataset(globalData);
    }
  }, [globalData]);

  const renderCell = (cell: any, index: number) => {
    switch (cell.type) {
      case 'exploration':
        return <ExplorationCell cellId={cell.id} index={index} />;
      case 'cleaning':
        return <CleaningCell cellId={cell.id} index={index} />;
      case 'analysis':
        return <AnalysisCell cellId={cell.id} index={index} />;
      case 'visualization':
        return <VisualizationCell cellId={cell.id} index={index} />;
      case 'ml':
        return <MLCell cellId={cell.id} index={index} />;
      case 'ai':
        return <AICell cellId={cell.id} index={index} />;
      case 'nlp':
        return <NLPCell cellId={cell.id} index={index} />;
      default:
        return <div>Cell type '{cell.type}' not implemented yet.</div>;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center text-[#E2E2E0]">
          <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
          No-Code Data Science Workspace
        </h2>
        
        
        <div className="flex items-center space-x-2">
          {cells.length > 0 && (
            <>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={clearNotebook}>
                <Eraser className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={async () => {
                const { exportDashboardToPDF } = await import('@/lib/reportGenerator');
                exportDashboardToPDF('notebook-workspace', 'DVAN-AI-Notebook-Report.pdf');
              }}>
                <Search className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Cell
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => addCell('exploration')}>
                <Search className="w-4 h-4 mr-2 text-blue-600" /> Data Exploration
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addCell('cleaning')}>
                <Eraser className="w-4 h-4 mr-2 text-orange-600" /> Data Cleaning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addCell('analysis')}>
                <Calculator className="w-4 h-4 mr-2 text-indigo-600" /> Advanced Analysis
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addCell('visualization')}>
                <PieChart className="w-4 h-4 mr-2 text-pink-600" /> Visualization
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addCell('ml')}>
                <BrainCircuit className="w-4 h-4 mr-2 text-green-600" /> Machine Learning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addCell('ai')}>
                <Sparkles className="w-4 h-4 mr-2 text-purple-600" /> AI Explanation
              </DropdownMenuItem>
              {summary?.columns.some(c => c.type === 'categorical') && (
                <DropdownMenuItem onClick={() => addCell('nlp')}>
                  <Type className="w-4 h-4 mr-2 text-sky-600" /> NLP Workspace
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {cells.length === 0 && (
        <div className="border-2 border-dashed border-[#2B7574]/30 rounded-xl p-12 text-center text-[#E2E2E0]/70 bg-[#0E2931]">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-[#E2E2E0]">Empty Workspace</p>
          <p className="mt-2 text-sm">Add a cell to begin your analysis workflow.</p>
        </div>
      )}

      <div id="notebook-workspace" className="space-y-4">
        {cells.map((cell, idx) => (
          <CellWrapper key={cell.id} id={cell.id} type={cell.type} index={idx}>
            {renderCell(cell, idx)}
          </CellWrapper>
        ))}
      </div>
    </div>
  );
};
