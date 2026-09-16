import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBAStore } from '@/lib/businessAnalystStore';
import { analyzeDataset, calculateDatasetHealth } from '@/lib/dataAnalysis';
import { Settings2, Wand2, Scissors, Columns, CopyX, Play, MessageSquare, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getGeminiInsight } from '@/lib/geminiClient';

export const BADataTransform = () => {
  const { rawDataset, datasetSummary, setRawDataset, isDemoMode, addChatMessage, setActiveSection } = useBAStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for specific macros
  const [joinCol1, setJoinCol1] = useState('');
  const [joinCol2, setJoinCol2] = useState('');
  
  const [mapperCol, setMapperCol] = useState('');

  const applyTransformation = (newData: any[], successMessage: string) => {
    const newSummary = analyzeDataset(newData);
    const newHealth = calculateDatasetHealth(newData, newSummary);
    setRawDataset(newData, newSummary, newHealth);
    toast.success(successMessage);
  };

  const handleTrimClean = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const textCols = datasetSummary?.columns.filter(c => c.type === 'categorical').map(c => c.name) || [];
      let modifiedRows = 0;
      
      const newData = rawDataset.map(row => {
        let modified = false;
        const newRow = { ...row };
        
        textCols.forEach(col => {
          if (typeof newRow[col] === 'string') {
            const original = newRow[col];
            // Trim whitespace and collapse multiple spaces
            const cleaned = original.trim().replace(/\s+/g, ' ');
            if (original !== cleaned) {
              newRow[col] = cleaned;
              modified = true;
            }
          }
        });
        if (modified) modifiedRows++;
        return newRow;
      });

      applyTransformation(newData, `Cleaned text in ${modifiedRows} rows.`);
      setIsProcessing(false);
    }, 500);
  };

  const handleJoinColumns = () => {
    if (!joinCol1 || !joinCol2) {
      toast.error('Please select two columns to join.');
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      const newColName = `${joinCol1}_${joinCol2}`;
      const newData = rawDataset.map(row => ({
        ...row,
        [newColName]: `${row[joinCol1] || ''} ${row[joinCol2] || ''}`.trim()
      }));

      applyTransformation(newData, `Joined columns into new column: ${newColName}`);
      setJoinCol1('');
      setJoinCol2('');
      setIsProcessing(false);
    }, 500);
  };

  const handleDeduplicate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const seen = new Set();
      const newData = rawDataset.filter(row => {
        const str = JSON.stringify(row);
        if (seen.has(str)) return false;
        seen.add(str);
        return true;
      });

      const removed = rawDataset.length - newData.length;
      applyTransformation(newData, `Removed ${removed} duplicate rows.`);
      setIsProcessing(false);
    }, 500);
  };

  const handleSmartMapper = async () => {
    if (!mapperCol) {
      toast.error('Please select a column to map.');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Find unique values
      const uniqueVals = Array.from(new Set(rawDataset.map(r => r[mapperCol]))).filter(Boolean).slice(0, 50);
      
      if (uniqueVals.length === 0) {
        toast.error('Column is empty.');
        setIsProcessing(false);
        return;
      }
      
      toast.info('AI is generating a mapping dictionary...');
      
      const prompt = `
        I have a list of values from a column named "${mapperCol}". 
        Please act as an XLOOKUP / Mapping tool. I want to standardize these values into clean, professional, full-length business names.
        For example, if the values are state abbreviations like "NY" and "CA", map them to "New York" and "California". 
        If they are dirty department names like "eng" and "mktg", map to "Engineering" and "Marketing".
        
        Values: ${JSON.stringify(uniqueVals)}
        
        Return ONLY a valid JSON object where the keys are the exact original values, and the values are the cleaned/mapped values.
        Example: {"NY": "New York", "CA": "California"}
      `;
      
      const response = await getGeminiInsight(prompt, isDemoMode);
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Failed to generate mapping dictionary.");
      
      const mappingDict = JSON.parse(jsonMatch[0]);
      
      const newColName = `${mapperCol}_Cleaned`;
      let modifiedRows = 0;
      
      const newData = rawDataset.map(row => {
        const originalVal = row[mapperCol];
        const mappedVal = mappingDict[String(originalVal)] || originalVal;
        
        if (originalVal !== mappedVal) modifiedRows++;
        
        return {
          ...row,
          [newColName]: mappedVal
        };
      });

      applyTransformation(newData, `Smart Mapped ${modifiedRows} rows into new column: ${newColName}`);
    } catch (e) {
      toast.error('Smart mapping failed. ' + (e as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const categoricalCols = datasetSummary?.columns.filter(c => c.type === 'categorical' || c.type === 'numeric') || [];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <Settings2 className="w-8 h-8 mr-3 text-teal-600" />
            Excel Transformations
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            1-Click automated macros to clean, shape, and map your data without formulas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        
        {/* Macro: Clean Text */}
        <Card className="border-[#2B7574]/30 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-[#0E2931] border-b border-[#2B7574]/20">
            <CardTitle className="text-lg flex items-center text-[#E2E2E0]">
              <Scissors className="w-5 h-5 mr-2 text-teal-600" />
              Clean Text (TRIM)
            </CardTitle>
            <CardDescription>
              Automatically removes leading/trailing spaces and multiple spaces across all text columns. Equivalent to =TRIM().
            </CardDescription>
          </CardHeader>
          <CardFooter className="p-4 bg-[#12484C] border-t border-[#2B7574]/20">
            <Button onClick={handleTrimClean} disabled={isProcessing} className="w-full bg-teal-600 hover:bg-teal-700">
              <Play className="w-4 h-4 mr-2" />
              Execute Clean
            </Button>
          </CardFooter>
        </Card>

        {/* Macro: Deduplicate */}
        <Card className="border-[#2B7574]/30 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-[#0E2931] border-b border-[#2B7574]/20">
            <CardTitle className="text-lg flex items-center text-[#E2E2E0]">
              <CopyX className="w-5 h-5 mr-2 text-rose-500" />
              Auto-Deduplicate
            </CardTitle>
            <CardDescription>
              Instantly removes exact duplicate rows from your dataset. Equivalent to Excel's Remove Duplicates.
            </CardDescription>
          </CardHeader>
          <CardFooter className="p-4 bg-[#12484C] border-t border-[#2B7574]/20">
            <Button onClick={handleDeduplicate} disabled={isProcessing} variant="outline" className="w-full text-rose-600 border-rose-200 hover:bg-rose-50">
              <Play className="w-4 h-4 mr-2" />
              Remove Duplicates
            </Button>
          </CardFooter>
        </Card>

        {/* Macro: Text Join */}
        <Card className="border-[#2B7574]/30 shadow-sm hover:shadow-md transition-shadow lg:col-span-1">
          <CardHeader className="bg-[#0E2931] border-b border-[#2B7574]/20">
            <CardTitle className="text-lg flex items-center text-[#E2E2E0]">
              <Columns className="w-5 h-5 mr-2 text-blue-500" />
              Join Columns (CONCATENATE)
            </CardTitle>
            <CardDescription>
              Merge two columns together with a space in between (e.g., First Name + Last Name).
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={joinCol1} onValueChange={setJoinCol1}>
                  <SelectTrigger><SelectValue placeholder="Column 1" /></SelectTrigger>
                  <SelectContent>
                    {categoricalCols.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-[#E2E2E0]/60 font-bold">+</span>
              <div className="flex-1">
                <Select value={joinCol2} onValueChange={setJoinCol2}>
                  <SelectTrigger><SelectValue placeholder="Column 2" /></SelectTrigger>
                  <SelectContent>
                    {categoricalCols.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-[#12484C] border-t border-[#2B7574]/20">
            <Button onClick={handleJoinColumns} disabled={isProcessing || !joinCol1 || !joinCol2} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Play className="w-4 h-4 mr-2" />
              Join Columns
            </Button>
          </CardFooter>
        </Card>

        {/* Macro: Smart AI Mapper */}
        <Card className="border-[#2B7574]/30 shadow-sm hover:shadow-md transition-shadow lg:col-span-1 border-t-4 border-t-purple-500">
          <CardHeader className="bg-purple-50/50 border-b border-[#2B7574]/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center text-[#E2E2E0]">
                <Wand2 className="w-5 h-5 mr-2 text-purple-600" />
                AI Smart Mapper (XLOOKUP)
              </CardTitle>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 uppercase">AI Powered</span>
            </div>
            <CardDescription>
              Automatically standardizes dirty data without needing a lookup table. Maps abbreviations to full names or cleans up messy categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#E2E2E0]/70 uppercase mb-2 block">Column to Standardize</label>
              <Select value={mapperCol} onValueChange={setMapperCol}>
                <SelectTrigger><SelectValue placeholder="Select messy column (e.g. State Codes, Dept Names)" /></SelectTrigger>
                <SelectContent>
                  {categoricalCols.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-[#12484C] border-t border-[#2B7574]/20">
            <Button onClick={handleSmartMapper} disabled={isProcessing || !mapperCol} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Wand2 className="w-4 h-4 mr-2" />
              Auto-Map Values
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
};
