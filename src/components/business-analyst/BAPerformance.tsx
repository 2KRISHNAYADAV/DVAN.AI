import React, { useState, useEffect } from 'react';
import { useBAStore } from '@/lib/businessAnalystStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { LineChart as LineChartIcon, MessageSquare, TrendingUp, Settings2, Download, Table2, Play, CalendarClock, Activity, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export const BAPerformance = () => {
  const { rawDataset, datasetSummary, addChatMessage, setActiveSection } = useBAStore();
  
  const [stage, setStage] = useState<'setup' | 'processing' | 'results'>('setup');
  const [selectedDateCol, setSelectedDateCol] = useState<string>('');
  const [selectedMetricCols, setSelectedMetricCols] = useState<string[]>([]);

  // Find defaults on mount
  useEffect(() => {
    if (datasetSummary) {
      const autoDate = datasetSummary.columns.find(c => c.type === 'date' || c.name.toLowerCase().includes('date') || c.name.toLowerCase().includes('time'))?.name;
      if (autoDate) setSelectedDateCol(autoDate);

      const numericCols = datasetSummary.columns.filter(c => c.type === 'numeric' && !c.name.toLowerCase().includes('id')).map(c => c.name);
      if (numericCols.length > 0) {
        setSelectedMetricCols(numericCols.slice(0, 2)); // Pick top 2 metrics by default
      }
    }
  }, [datasetSummary]);

  const handleAskAI = (chartTitle: string) => {
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: `Analyze the "${chartTitle}" chart from the Performance Dashboard. What are the key trends?`,
      timestamp: new Date()
    });
    setActiveSection('chat');
  };

  const handleStartAnalysis = () => {
    if (!selectedDateCol) {
      toast.error('Please select a Date column to track metrics over time.');
      return;
    }
    if (selectedMetricCols.length === 0) {
      toast.error('Please select at least one Metric column.');
      return;
    }

    setStage('processing');
    
    // Simulate AI processing time for the animation
    setTimeout(() => {
      setStage('results');
    }, 2000);
  };

  const getTrendData = (metricColName: string) => {
    if (!selectedDateCol || !metricColName || rawDataset.length === 0) return [];
    
    const grouped: Record<string, number> = {};
    
    rawDataset.forEach(row => {
      const d = row[selectedDateCol];
      const v = Number(row[metricColName]);
      if (d && !isNaN(v)) {
        // Try to parse as date, otherwise just use string
        let dateStr = String(d).trim();
        const parsed = Date.parse(dateStr);
        if (!isNaN(parsed)) {
          // Format as YYYY-MM-DD
          dateStr = new Date(parsed).toISOString().substring(0, 10);
        }
        grouped[dateStr] = (grouped[dateStr] || 0) + v;
      }
    });
    
    return Object.entries(grouped)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => {
        // Sort chronologically if they are real dates
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        if (!isNaN(timeA) && !isNaN(timeB)) return timeA - timeB;
        return a.date.localeCompare(b.date);
      })
      .slice(-30); // Show last 30 data points to prevent crowding
  };

  const downloadCSV = (metricColName: string) => {
    const data = getTrendData(metricColName);
    if (data.length === 0) {
      toast.error("No data to download.");
      return;
    }

    const headers = ['Date', metricColName];
    const csvContent = [
      headers.join(','),
      ...data.map(row => `"${row.date}","${row.value}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `performance_${metricColName.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloaded ${metricColName} trend data!`);
  };

  if (stage === 'processing') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 relative mb-8">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <TrendingUp className="absolute inset-0 m-auto w-8 h-8 text-teal-600 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-[#E2E2E0] mb-2">Analyzing Timelines...</h2>
        <p className="text-[#E2E2E0]/70 text-lg flex items-center">
          <Activity className="w-5 h-5 mr-2 animate-pulse text-teal-500" />
          Aggregating selected metrics and building trend models.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-teal-600" />
            Performance Analysis
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Track key business metrics over time.
          </p>
        </div>
        {stage === 'results' && (
          <Button variant="outline" className="text-[#E2E2E0]/80" onClick={() => setStage('setup')}>
            <Settings2 className="w-4 h-4 mr-2" />
            Configure Tracking
          </Button>
        )}
      </div>

      {stage === 'setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-[#2B7574]/30 shadow-sm border-t-4 border-t-teal-500">
              <CardHeader className="bg-[#0E2931] border-b border-[#2B7574]/20">
                <CardTitle className="text-lg flex items-center">
                  <CalendarClock className="w-5 h-5 mr-2 text-teal-600" />
                  Map Timeline
                </CardTitle>
                <CardDescription>Select the column that represents time/dates in your dataset.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <label className="text-xs font-bold text-[#E2E2E0]/70 uppercase mb-2 block">Date/Time Column</label>
                <Select value={selectedDateCol} onValueChange={setSelectedDateCol}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date column" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasetSummary?.columns.map(c => (
                      <SelectItem key={c.name} value={c.name}>
                        <div className="flex items-center justify-between w-full">
                          <span>{c.name}</span>
                          <span className="text-xs text-[#E2E2E0]/60 ml-2">({c.type})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="border-[#2B7574]/30 shadow-sm border-t-4 border-t-blue-500">
              <CardHeader className="bg-[#0E2931] border-b border-[#2B7574]/20">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Select Metrics
                </CardTitle>
                <CardDescription>Choose which numeric columns to track over time.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <label className="text-xs font-bold text-[#E2E2E0]/70 uppercase mb-2 block">Primary Metric to Chart</label>
                <Select 
                  value={selectedMetricCols[0] || ''} 
                  onValueChange={(val) => setSelectedMetricCols([val])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasetSummary?.columns.filter(c => c.type === 'numeric').map(c => (
                      <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
              <CardFooter className="p-4 bg-[#0E2931] border-t border-[#2B7574]/20">
                <Button onClick={handleStartAnalysis} className="w-full bg-slate-900 hover:bg-slate-800 text-white" disabled={!selectedDateCol || selectedMetricCols.length === 0}>
                  <Play className="w-4 h-4 mr-2" />
                  Generate Performance Charts
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full border-[#2B7574]/30 shadow-sm">
              <CardHeader className="border-b border-[#2B7574]/20 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <Table2 className="w-5 h-5 mr-2 text-[#E2E2E0]/60" />
                    Data Preview
                  </CardTitle>
                  <CardDescription>Verify your data before analyzing.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto max-h-[350px] overflow-y-auto">
                <table className="w-full text-sm text-left relative">
                  <thead className="bg-[#0E2931] text-[#E2E2E0]/70 uppercase text-xs font-bold border-b border-[#2B7574]/30 sticky top-0 shadow-sm z-10">
                    <tr>
                      {datasetSummary?.columns.slice(0, 6).map(c => (
                        <th key={c.name} className={`px-4 py-3 bg-[#0E2931] ${c.name === selectedDateCol ? 'bg-teal-100 text-teal-800' : ''}`}>
                          {c.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rawDataset.slice(0, 100).map((row, i) => (
                      <tr key={i} className="hover:bg-[#0E2931]/50">
                        {datasetSummary?.columns.slice(0, 6).map(c => (
                          <td key={c.name} className={`px-4 py-3 truncate max-w-[150px] ${c.name === selectedDateCol ? 'bg-teal-50 font-medium' : ''}`}>
                            {String(row[c.name] || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
              {rawDataset.length > 100 && (
                <div className="p-3 text-center text-xs text-[#E2E2E0]/60 font-medium bg-[#0E2931]/50 border-t border-[#2B7574]/20">
                  Showing 100 of {rawDataset.length.toLocaleString()} rows
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {stage === 'results' && (
        <div className="grid grid-cols-1 gap-6">
          {selectedMetricCols.map(metricName => {
            const data = getTrendData(metricName);
            const chartTitle = `${metricName} Trend Over Time`;
            
            return (
              <Card key={metricName} className="shadow-sm border-[#2B7574]/30 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="bg-[#0E2931] pb-3 border-b border-[#2B7574]/20 flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-[#E2E2E0] flex items-center">
                    <LineChartIcon className="w-4 h-4 mr-2 text-teal-600" />
                    {chartTitle}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs bg-[#12484C]" onClick={() => downloadCSV(metricName)}>
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Export Data
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50" onClick={() => handleAskAI(chartTitle)}>
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      Ask AI
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 h-[350px]">
                  {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} 
                          axisLine={false} 
                          tickLine={false}
                          tickMargin={10}
                        />
                        <YAxis 
                          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} 
                          axisLine={false} 
                          tickLine={false} 
                          tickMargin={10}
                          tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                          formatter={(value: number) => [value.toLocaleString(), metricName]}
                          labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#0ea5e9" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: '#fff', stroke: '#0ea5e9', strokeWidth: 2 }} 
                          activeDot={{ r: 7, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }} 
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center flex-col text-[#E2E2E0]/60">
                      <AlertCircle className="w-12 h-12 mb-4 text-slate-200" />
                      <p>No valid data points found for charting.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
