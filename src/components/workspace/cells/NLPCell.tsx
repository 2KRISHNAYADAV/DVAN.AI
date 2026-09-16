import React, { useState, useMemo, useEffect } from 'react';
import { useNotebookStore } from '@/lib/notebookStore';
import { analyzeDataset } from '@/lib/dataAnalysis';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Play, Type, AlertTriangle, Sparkles, Send, Bot, User } from 'lucide-react';
import { getGeminiInsight } from '@/lib/geminiClient';
import { toast } from 'sonner';
import { validateTextColumn, analyzeSentimentLocal, extractKeywords, extractTopicsLocal } from '@/lib/nlpEngine';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface NLPCellProps {
  cellId: string;
  index: number;
}

const COLORS = ['#10b981', '#9ca3af', '#ef4444']; // Pos, Neutral, Neg

export const NLPCell = ({ cellId, index }: NLPCellProps) => {
  const { getDatasetForCell, setCellResult, cells } = useNotebookStore();
  const cell = cells.find(c => c.id === cellId);
  const localData = getDatasetForCell(index);
  const summary = useMemo(() => analyzeDataset(localData), [localData]);
  const textCols = summary.columns.filter(c => c.type === 'categorical').map(c => c.name);

  const [targetCol, setTargetCol] = useState<string>('');
  const [nlpTask, setNlpTask] = useState<string>('sentiment');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  // Validate column when selected
  useEffect(() => {
    if (targetCol) {
      const validation = validateTextColumn(localData, targetCol);
      if (!validation.isValid) {
        setValidationError(validation.message);
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
    }
  }, [targetCol, localData]);

  const handleRun = async () => {
    if (!targetCol || validationError) return;
    setIsProcessing(true);

    try {
      const texts = localData.map(r => r[targetCol]).filter(t => t);
      
      let localResults: any = {};
      let promptContext = '';

      // 1. Run local NLP Engine
      if (nlpTask === 'sentiment') {
        localResults = analyzeSentimentLocal(texts);
        promptContext = `Local Sentiment Analysis found: ${JSON.stringify(localResults.distribution)}. Top Positive Words: ${localResults.topPositiveWords}. Top Negative Words: ${localResults.topNegativeWords}.`;
      } else if (nlpTask === 'keywords') {
        localResults = extractKeywords(texts, 15);
        promptContext = `Local Keyword Extraction found the top frequencies: ${JSON.stringify(localResults)}.`;
      } else if (nlpTask === 'topics') {
        localResults = extractTopicsLocal(texts);
        promptContext = `Local Topic Modeling grouped these keywords into clusters: ${JSON.stringify(localResults)}.`;
      }

      // 2. Get AI Explanation
      const aiPrompt = `
        You are an expert NLP Analyst. 
        I ran a local NLP pipeline on a dataset's text column. 
        Here are the statistical results: ${promptContext}
        
        Provide a highly professional, 2-3 paragraph explanation of what this means for the business or researcher. 
        Do not use markdown tables or big lists. Just explain the insights smoothly.
      `;

      const aiExplanation = await getGeminiInsight(aiPrompt);

      setCellResult(cellId, { 
        task: nlpTask, 
        localData: localResults, 
        aiExplanation,
        chatHistory: []
      });

    } catch (err: any) {
      toast.error('NLP processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || !cell?.result) return;
    
    const userQ = chatInput.trim();
    setChatInput('');
    setIsChatting(true);

    const newHistory = [...(cell.result.chatHistory || []), { role: 'user', content: userQ }];
    
    setCellResult(cellId, { 
      ...cell.result,
      chatHistory: newHistory
    });

    try {
      const chatPrompt = `
        You are a conversational NLP Assistant. 
        Context of previous NLP run: ${JSON.stringify(cell.result.localData)}
        AI Summary: ${cell.result.aiExplanation}
        User's new question about this data: "${userQ}"
        
        Answer professionally based strictly on the NLP context above.
      `;
      
      const response = await getGeminiInsight(chatPrompt);
      
      setCellResult(cellId, {
        ...cell.result,
        chatHistory: [...newHistory, { role: 'assistant', content: response }]
      });
    } catch (error) {
      toast.error("Chat failed");
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">NLP Task</label>
          <Select value={nlpTask} onValueChange={setNlpTask}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Task" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
              <SelectItem value="keywords">Keyword Extraction</SelectItem>
              <SelectItem value="topics">Topic Detection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Text Column</label>
          <Select value={targetCol || undefined} onValueChange={setTargetCol}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Column" />
            </SelectTrigger>
            <SelectContent>
              {textCols.map(col => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleRun} 
          disabled={!targetCol || isProcessing || !!validationError} 
          className="bg-sky-600 hover:bg-sky-700 ml-auto"
        >
          <Play className="w-4 h-4 mr-2" />
          {isProcessing ? 'Processing NLP...' : 'Run NLP Pipeline'}
        </Button>
      </div>

      {validationError && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          {validationError} Please select a valid natural language text column.
        </div>
      )}

      {cell?.result && (
        <div className="mt-6 space-y-6 border border-sky-100 rounded-xl overflow-hidden">
          
          {/* Charts & Local Results */}
          <div className="bg-[#12484C] p-6">
            <h4 className="text-sm font-bold text-[#E2E2E0]/70 uppercase tracking-wider mb-6 flex items-center">
              <Type className="w-4 h-4 mr-2 text-sky-500" />
              NLP Pipeline Output
            </h4>
            
            <div className="h-64 w-full">
              {cell.result.task === 'sentiment' && cell.result.localData.distribution && (
                <div className="flex h-full w-full">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cell.result.localData.distribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {cell.result.localData.distribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 flex flex-col justify-center space-y-4">
                    <div>
                      <span className="text-sm font-medium text-[#E2E2E0]/70">Top Positive Keywords</span>
                      <p className="text-emerald-600 font-semibold">{cell.result.localData.topPositiveWords.join(', ') || 'None'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-[#E2E2E0]/70">Top Negative Keywords</span>
                      <p className="text-red-600 font-semibold">{cell.result.localData.topNegativeWords.join(', ') || 'None'}</p>
                    </div>
                  </div>
                </div>
              )}

              {cell.result.task === 'keywords' && cell.result.localData && (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={cell.result.localData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                     <XAxis type="number" />
                     <YAxis dataKey="word" type="category" width={80} />
                     <RechartsTooltip />
                     <Bar dataKey="count" fill="#0284c7" radius={[0, 4, 4, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
              )}

              {cell.result.task === 'topics' && cell.result.localData && (
                <div className="grid grid-cols-3 gap-4 h-full">
                  {cell.result.localData.map((topic: any, idx: number) => (
                    <div key={idx} className="bg-sky-50 rounded-lg p-4 border border-sky-100">
                      <h5 className="font-bold text-sky-800 mb-2">{topic.name}</h5>
                      <ul className="space-y-1">
                        {topic.keywords.map((kw: string) => (
                          <li key={kw} className="text-sm text-[#E2E2E0] flex items-center before:content-['•'] before:text-sky-400 before:mr-2">
                            {kw}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Explanation Layer */}
          <div className="bg-sky-50 p-6 border-t border-sky-100">
            <h4 className="text-sm font-bold text-sky-800 uppercase tracking-wider mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Insights & Explanation
            </h4>
            <p className="text-[#E2E2E0] leading-relaxed whitespace-pre-wrap">{cell.result.aiExplanation}</p>
          </div>

          {/* Chat with Data Layer */}
          <div className="bg-[#12484C] p-6 border-t border-sky-100 space-y-4">
            {cell.result.chatHistory && cell.result.chatHistory.length > 0 && (
              <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-2">
                {cell.result.chatHistory.map((msg: any, idx: number) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-sky-100 ml-2' : 'bg-indigo-100 mr-2'}`}>
                        {msg.role === 'user' ? <User className="w-4 h-4 text-sky-600" /> : <Bot className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-sky-600 text-white rounded-tr-none' : 'bg-[rgba(14,41,49,0.8)] text-[#E2E2E0] rounded-tl-none'}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <form onSubmit={(e) => { e.preventDefault(); handleChat(); }} className="flex space-x-2">
              <Input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder="Ask a question about these NLP results..." 
                disabled={isChatting}
              />
              <Button type="submit" size="icon" disabled={isChatting || !chatInput.trim()} className="bg-indigo-600 hover:bg-indigo-700">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};
