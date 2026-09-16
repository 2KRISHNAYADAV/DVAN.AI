import React, { useMemo, useState } from 'react';
import { useBAStore } from '@/lib/businessAnalystStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MessageSquare, Filter, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0f766e', '#0ea5e9', '#6366f1', '#d946ef', '#f43f5e', '#f59e0b', '#10b981', '#f97316'];

const InteractiveChartCard = ({ 
  defaultDimension, 
  defaultMetric, 
  chartType = 'bar',
  colSpan = 'col-span-1'
}: { 
  defaultDimension?: string, 
  defaultMetric?: string,
  chartType?: 'bar' | 'pie',
  colSpan?: string
}) => {
  const { rawDataset, datasetSummary, addChatMessage, setActiveSection } = useBAStore();
  
  const categoricalCols = datasetSummary?.columns.filter(c => c.type === 'categorical') || [];
  const numericCols = datasetSummary?.columns.filter(c => c.type === 'numeric' && !c.name.toLowerCase().includes('id')) || [];

  const [dimension, setDimension] = useState(defaultDimension || categoricalCols[0]?.name);
  const [metric, setMetric] = useState(defaultMetric || 'Count (Number of Records)');
  const [type, setType] = useState(chartType);

  const handleAskAI = () => {
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: `Analyze the "${metric} by ${dimension}" chart from the Operations Dashboard. What insights can you draw from this?`,
      timestamp: new Date()
    });
    setActiveSection('chat');
  };

  const aggregatedData = useMemo(() => {
    if (!dimension || rawDataset.length === 0) return [];
    
    const sums: Record<string, number> = {};
    rawDataset.forEach(row => {
      const dimVal = String(row[dimension] || 'Unknown');
      
      if (metric === 'Count (Number of Records)') {
        sums[dimVal] = (sums[dimVal] || 0) + 1;
      } else {
        const metricVal = Number(row[metric]);
        if (!isNaN(metricVal)) {
          sums[dimVal] = (sums[dimVal] || 0) + metricVal;
        }
      }
    });

    return Object.entries(sums)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // top 8 to avoid crowding
  }, [rawDataset, dimension, metric]);

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  return (
    <Card className={`shadow-sm border-[#2B7574]/30 flex flex-col ${colSpan}`}>
      <CardHeader className="pb-3 border-b border-[#2B7574]/20 bg-[#0E2931]/50">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="h-8 text-xs font-bold bg-[#12484C] w-[160px] border-[#2B7574]/30">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Count (Number of Records)" className="font-bold text-teal-700">Record Count</SelectItem>
                {numericCols.map(c => (
                  <SelectItem key={c.name} value={c.name}>SUM({c.name})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#E2E2E0]/60 font-medium">by</span>
            <Select value={dimension} onValueChange={setDimension}>
              <SelectTrigger className="h-8 text-xs font-bold bg-[#12484C] w-[140px] border-[#2B7574]/30">
                <SelectValue placeholder="Dimension" />
              </SelectTrigger>
              <SelectContent>
                {categoricalCols.map(c => (
                  <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Select value={type} onValueChange={(val: any) => setType(val)}>
              <SelectTrigger className="h-8 w-[90px] text-xs bg-[#12484C]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-teal-600 hover:bg-teal-50" onClick={handleAskAI} title="Ask AI Analyst">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-4 min-h-[300px]">
        {aggregatedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={aggregatedData} margin={{ top: 20, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false} 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={formatYAxis}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [value.toLocaleString(), metric]}
                />
                <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {aggregatedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={aggregatedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {aggregatedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [value.toLocaleString(), metric]}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-[#E2E2E0]/60">Data not available</div>
        )}
      </CardContent>
    </Card>
  );
};

export const BAOperations = () => {
  const { datasetSummary } = useBAStore();

  // Try to find intelligent defaults
  const findCol = (keywords: string[], type: string) => {
    return datasetSummary?.columns.find(c => 
      c.type === type && keywords.some(k => c.name.toLowerCase().includes(k))
    )?.name;
  };

  const deptCol = findCol(['dept', 'department', 'team', 'group'], 'categorical');
  const statusCol = findCol(['status', 'state', 'phase'], 'categorical');
  const priorityCol = findCol(['priority', 'urgency', 'severity'], 'categorical');
  const ownerCol = findCol(['owner', 'assignee', 'user', 'agent'], 'categorical');

  const revCol = findCol(['rev', 'price', 'cost', 'amount', 'total', 'sales'], 'numeric');
  const timeCol = findCol(['time', 'hours', 'duration', 'days'], 'numeric');

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-teal-600" />
            Operations Dashboard
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Build custom charts to slice and dice your business metrics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="outline" className="text-[#E2E2E0]/80">
            <Settings2 className="w-4 h-4 mr-2" />
            Manage Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveChartCard 
          defaultDimension={deptCol} 
          defaultMetric={revCol || 'Count (Number of Records)'} 
          chartType="bar"
        />
        <InteractiveChartCard 
          defaultDimension={statusCol} 
          defaultMetric={timeCol || 'Count (Number of Records)'} 
          chartType="pie"
        />
        <InteractiveChartCard 
          defaultDimension={priorityCol} 
          defaultMetric="Count (Number of Records)" 
          chartType="bar"
        />
        <InteractiveChartCard 
          defaultDimension={ownerCol} 
          defaultMetric={revCol || 'Count (Number of Records)'} 
          chartType="bar"
        />
      </div>
    </div>
  );
};
