import React, { useState } from 'react';
import { useNotebookStore } from '@/lib/notebookStore';
import { Button } from '@/components/ui/button';
import { getGeminiInsight } from '@/lib/geminiClient';
import { Play, Sparkles } from 'lucide-react';

interface AICellProps {
  cellId: string;
  index: number;
}

export const AICell = ({ cellId, index }: AICellProps) => {
  const { cells, setCellResult } = useNotebookStore();
  const cell = cells.find(c => c.id === cellId);
  const [isLoading, setIsLoading] = useState(false);

  const prevCell = index > 0 ? cells[index - 1] : null;

  const handleGenerate = async () => {
    if (!prevCell || !prevCell.result) return;
    setIsLoading(true);
    
    try {
      const context = JSON.stringify(prevCell.result);
      const prompt = `I ran a data analysis step in my notebook. The output of the previous cell is: ${context}. Please provide a 2-3 sentence business explanation of what this means in simple terms. Do not use markdown headers, just text.`;
      
      const insight = await getGeminiInsight(prompt);
      setCellResult(cellId, insight);
    } catch (e) {
      setCellResult(cellId, "Failed to generate AI insight.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#E2E2E0]/80">
          {prevCell?.result ? "AI will analyze the output of the previous cell." : "Run the previous cell first to generate AI insights."}
        </p>
        <Button onClick={handleGenerate} disabled={!prevCell?.result || isLoading} className="bg-purple-600 hover:bg-purple-700">
          <Sparkles className="w-4 h-4 mr-2" />
          {isLoading ? 'Thinking...' : 'Generate Insight'}
        </Button>
      </div>

      {cell?.result && (
        <div className="mt-4 p-6 bg-purple-50 rounded-lg border border-purple-100 shadow-inner">
          <div className="flex items-start">
            <Sparkles className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
            <p className="text-[#E2E2E0] leading-relaxed">{cell.result}</p>
          </div>
        </div>
      )}
    </div>
  );
};
