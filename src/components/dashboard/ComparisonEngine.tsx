import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/lib/store';
import { DatasetSummary } from '@/lib/dataAnalysis';
import { ArrowUpRight, ArrowDownRight, GitCompare } from 'lucide-react';

interface ComparisonEngineProps {
  summary: DatasetSummary;
}

export const ComparisonEngine = ({ summary }: ComparisonEngineProps) => {
  const { globalData } = useDashboardStore();
  
  const categoricalCols = summary.columns.filter(c => c.type === 'categorical' || c.type === 'date');
  const numericCols = summary.columns.filter(c => c.type === 'numeric').slice(0, 4); // Top 4 metrics

  const [selectedCol, setSelectedCol] = useState<string>(categoricalCols[0]?.name || '');
  
  const uniqueValues = useMemo(() => {
    if (!selectedCol || !globalData) return [];
    return Array.from(new Set(globalData.map(row => String(row[selectedCol] || '')))).filter(Boolean);
  }, [globalData, selectedCol]);

  const [valA, setValA] = useState<string>('');
  const [valB, setValB] = useState<string>('');

  // Automatically select first two values if available
  React.useEffect(() => {
    if (uniqueValues.length >= 2) {
      setValA(uniqueValues[0]);
      setValB(uniqueValues[1]);
    }
  }, [uniqueValues]);

  const comparisonResults = useMemo(() => {
    if (!valA || !valB || !selectedCol) return null;

    const dataA = globalData.filter(row => String(row[selectedCol]) === valA);
    const dataB = globalData.filter(row => String(row[selectedCol]) === valB);

    return numericCols.map(col => {
      let sumA = 0;
      let sumB = 0;
      dataA.forEach(r => sumA += (Number(r[col.name]) || 0));
      dataB.forEach(r => sumB += (Number(r[col.name]) || 0));

      const diff = sumA - sumB;
      const pctChange = sumB !== 0 ? (diff / sumB) * 100 : 0;

      return {
        metric: col.name,
        valA: sumA,
        valB: sumB,
        diff,
        pctChange
      };
    });
  }, [valA, valB, selectedCol, globalData, numericCols]);

  if (categoricalCols.length === 0) {
    return <div className="p-4 text-muted-foreground">No categorical columns available for comparison.</div>;
  }

  return (
    <Card className="shadow-sm border-purple-100">
      <CardHeader className="bg-purple-50/50 pb-4">
        <CardTitle className="flex items-center text-lg text-purple-900">
          <GitCompare className="w-5 h-5 mr-2 text-purple-600" />
          Comparison Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-end mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Compare By Segment</label>
            <Select value={selectedCol} onValueChange={setSelectedCol}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {categoricalCols.map(col => (
                  <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-600">Group A</label>
            <Select value={valA} onValueChange={setValA}>
              <SelectTrigger className="w-[200px] border-blue-200">
                <SelectValue placeholder="Select value A" />
              </SelectTrigger>
              <SelectContent>
                {uniqueValues.map(v => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center pb-2 text-muted-foreground font-medium px-2">VS</div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-pink-600">Group B</label>
            <Select value={valB} onValueChange={setValB}>
              <SelectTrigger className="w-[200px] border-pink-200">
                <SelectValue placeholder="Select value B" />
              </SelectTrigger>
              <SelectContent>
                {uniqueValues.map(v => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {comparisonResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisonResults.map(res => {
              const isPositive = res.diff >= 0;
              return (
                <div key={res.metric} className="p-4 rounded-xl border bg-[#0E2931]/50">
                  <h4 className="text-sm font-medium text-[#E2E2E0]/70 mb-4 uppercase tracking-wider">{res.metric}</h4>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center flex-1">
                      <div className="text-xl font-bold text-blue-700">
                        {res.valA > 1000 ? (res.valA / 1000).toFixed(1) + 'k' : res.valA.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 truncate px-2">{valA}</div>
                    </div>
                    <div className="px-4 text-gray-300">|</div>
                    <div className="text-center flex-1">
                      <div className="text-xl font-bold text-pink-700">
                        {res.valB > 1000 ? (res.valB / 1000).toFixed(1) + 'k' : res.valB.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 truncate px-2">{valB}</div>
                    </div>
                  </div>
                  <div className={`flex items-center justify-center p-2 rounded-lg text-sm font-medium ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    Group A is {Math.abs(res.pctChange).toFixed(1)}% {isPositive ? 'higher' : 'lower'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
