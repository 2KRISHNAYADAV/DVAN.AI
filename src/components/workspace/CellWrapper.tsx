import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useNotebookStore, CellType } from '@/lib/notebookStore';

interface CellWrapperProps {
  id: string;
  type: CellType;
  index: number;
  children: React.ReactNode;
}

const getCellColor = (type: CellType) => {
  switch (type) {
    case 'exploration': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'cleaning': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'analysis': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'visualization': return 'bg-pink-100 text-pink-700 border-pink-200';
    case 'ml': return 'bg-green-100 text-green-700 border-green-200';
    case 'ai': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'nlp': return 'bg-sky-100 text-sky-700 border-sky-200';
    default: return 'bg-[rgba(14,41,49,0.8)] text-[#E2E2E0] border-[#2B7574]/30';
  }
};

const getCellTitle = (type: CellType) => {
  switch (type) {
    case 'exploration': return 'Data Exploration';
    case 'cleaning': return 'Data Cleaning';
    case 'analysis': return 'Analysis Operation';
    case 'visualization': return 'Visualization';
    case 'ml': return 'Machine Learning';
    case 'ai': return 'AI Insight';
    case 'nlp': return 'NLP Workspace';
    default: return 'Cell';
  }
};

export const CellWrapper = ({ id, type, index, children }: CellWrapperProps) => {
  const { removeCell } = useNotebookStore();
  const colorClasses = getCellColor(type);

  return (
    <Card className="border border-[#2B7574]/30 shadow-sm relative group overflow-hidden mb-6">
      <div className={`absolute top-0 left-0 px-3 py-1 rounded-br-lg text-xs font-bold flex items-center ${colorClasses}`}>
        [{index + 1}] {getCellTitle(type)}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50 z-10"
        onClick={() => removeCell(id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <CardContent className="p-6 pt-12">
        {children}
      </CardContent>
    </Card>
  );
};
