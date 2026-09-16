import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBAStore } from '@/lib/businessAnalystStore';
import { Activity, ArrowRight, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { KPICard } from '@/lib/businessAnalystTypes';
import { getGeminiInsight } from '@/lib/geminiClient';

export const BAKpiDiscovery = () => {
  const { rawDataset, datasetSummary, businessContext, setKpis, setActiveSection, kpis, setBusinessContext } = useBAStore();
  const [isDiscovering, setIsDiscovering] = useState(false);
  // Use a ref so the auto-discover fires only once per dataset load
  const hasAutoRun = React.useRef(false);

  useEffect(() => {
    if (kpis.length === 0 && datasetSummary && !hasAutoRun.current) {
      hasAutoRun.current = true;
      discoverKPIs();
    }
  }, [datasetSummary]);

  const formatValue = (value: number, format?: 'currency' | 'percentage' | 'number') => {
    if (isNaN(value)) return value;
    if (format === 'currency') return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (format === 'percentage') return `${value.toFixed(1)}%`;
    if (value > 1000) return (value / 1000).toFixed(1) + 'k';
    return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  };

  const discoverKPIs = async () => {
    setIsDiscovering(true);
    
    // In a real app we'd use Gemini to determine which columns map to KPIs.
    // For this implementation, we'll auto-calculate basic sums/averages for numeric columns.
    
    const numericCols = datasetSummary?.columns.filter(c => {
      if (c.type !== 'numeric') return false;
      const lower = c.name.toLowerCase();
      // Exclude IDs, Dates, and Timestamps from being treated as numeric KPIs
      if (lower.includes('date') || lower.includes('id') || lower === 'key' || lower.includes('timestamp') || lower.includes('deadline')) {
        return false;
      }
      return true;
    }) || [];
    const generatedKpis: KPICard[] = [];
    // We'll simulate a "current" vs "previous" period by looking for a date column
    let previousPeriodData = [];
    let currentPeriodData = [];
    let hasTimeComparison = false;

    const dateCol = datasetSummary?.columns.find(c => c.type === 'date');
    if (dateCol && rawDataset.length > 0) {
      const sortedData = [...rawDataset].sort((a, b) => new Date(a[dateCol.name]).getTime() - new Date(b[dateCol.name]).getTime());
      const firstDate = new Date(sortedData[0][dateCol.name]).getTime();
      const lastDate = new Date(sortedData[sortedData.length - 1][dateCol.name]).getTime();
      const midDate = firstDate + (lastDate - firstDate) / 2;
      
      previousPeriodData = sortedData.filter(row => new Date(row[dateCol.name]).getTime() <= midDate);
      currentPeriodData = sortedData.filter(row => new Date(row[dateCol.name]).getTime() > midDate);
      hasTimeComparison = previousPeriodData.length > 0 && currentPeriodData.length > 0;
    }

    if (!hasTimeComparison) {
      currentPeriodData = rawDataset;
      previousPeriodData = [];
    }
    
    // Auto-generate KPIs based on numeric columns
    numericCols.forEach((col, index) => {
      if (index >= 6) return; // limit to top 6
      
      const isPercent = col.name.toLowerCase().includes('rate') || col.name.toLowerCase().includes('percent');
      const isCurrency = col.name.toLowerCase().includes('rev') || col.name.toLowerCase().includes('price') || col.name.toLowerCase().includes('cost') || col.name.toLowerCase().includes('impact');
      
      const format = isPercent ? 'percentage' : (isCurrency ? 'currency' : 'number');
      
      // Calculate sums or averages
      // (If it's a rate/score, we usually average it. If it's revenue, we sum it)
      const shouldAverage = isPercent || col.name.toLowerCase().includes('score') || col.name.toLowerCase().includes('time') || col.name.toLowerCase().includes('age');
      
      const calculateMetric = (data: any[]) => {
        const validValues = data.map(r => Number(r[col.name])).filter(v => !isNaN(v));
        if (validValues.length === 0) return 0;
        const sum = validValues.reduce((a, b) => a + b, 0);
        return shouldAverage ? sum / validValues.length : sum;
      };
      
      const previousValue = calculateMetric(previousPeriodData);
      const currentValue = calculateMetric(currentPeriodData);
      
      let percentChange = 0;
      let trend: 'up' | 'down' | 'flat' | null = null;
      let status: KPICard['status'] = 'Unknown';
      
      const isBadIfUp = col.name.toLowerCase().includes('delay') || col.name.toLowerCase().includes('cost') || col.name.toLowerCase().includes('defect') || col.name.toLowerCase().includes('churn');
      
      if (hasTimeComparison && previousValue !== 0) {
        percentChange = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
        trend = percentChange > 2 ? 'up' : (percentChange < -2 ? 'down' : 'flat');
        
        if (trend === 'up') status = isBadIfUp ? 'High Risk' : 'Healthy';
        if (trend === 'down') status = isBadIfUp ? 'Healthy' : 'Needs Attention';
        if (trend === 'flat') status = 'Needs Attention';
      } else {
        // No time comparison, just overall value
        status = 'Unknown';
      }

      generatedKpis.push({
        id: `kpi-${col.name}`,
        title: col.name,
        currentValue,
        previousValue,
        percentChange: Number(percentChange.toFixed(1)),
        trend,
        status,
        format
      });
    });

    setKpis(generatedKpis);
    
    if (businessContext) {
      setBusinessContext({
        ...businessContext,
        importantKPIs: generatedKpis.map(k => k.title)
      });
    }

    setIsDiscovering(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <Activity className="w-8 h-8 mr-3 text-teal-600" />
            KPI Intelligence
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Automatically discovered performance metrics based on your dataset and business context.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={discoverKPIs} disabled={isDiscovering}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isDiscovering ? 'animate-spin' : ''}`} />
            Recalculate
          </Button>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => setActiveSection('insights')}
            disabled={isDiscovering || kpis.length === 0}
          >
            Generate AI Insights
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {isDiscovering ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-[#2B7574]/30 rounded-2xl bg-[#12484C]">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
          <h3 className="text-lg font-bold text-[#E2E2E0]">Mining Data for KPIs...</h3>
          <p className="text-[#E2E2E0]/70">Analyzing columns, calculating trends, and establishing baselines.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map(kpi => (
            <Card key={kpi.id} className={`border-t-4 hover:shadow-lg transition-all ${
              kpi.status === 'Healthy' ? 'border-t-emerald-500' : 
              kpi.status === 'Needs Attention' ? 'border-t-amber-500' : 
              'border-t-rose-500'
            }`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-bold text-[#E2E2E0]/70 uppercase tracking-wider">{kpi.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    kpi.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 
                    kpi.status === 'Needs Attention' ? 'bg-amber-100 text-amber-700' : 
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {kpi.status}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-3xl font-black text-[#E2E2E0] mb-2">
                    {formatValue(kpi.currentValue as number, kpi.format)}
                  </div>
                  
                  {kpi.trend !== null ? (
                    <div className="flex items-center pt-3 border-t border-slate-50 justify-between">
                      <div className={`flex items-center text-sm font-bold ${
                        kpi.status === 'Healthy' ? 'text-emerald-600' :
                        kpi.status === 'Needs Attention' ? 'text-amber-600' :
                        kpi.status === 'High Risk' ? 'text-rose-600' :
                        'text-[#E2E2E0]/80'
                      }`}>
                        {kpi.trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                        {kpi.trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                        {kpi.trend === 'flat' && <Minus className="w-4 h-4 mr-1" />}
                        {kpi.percentChange}%
                      </div>
                      <span className="text-xs text-[#E2E2E0]/60 font-medium">vs prev. period</span>
                    </div>
                  ) : (
                    <div className="flex items-center pt-3 border-t border-slate-50 justify-end">
                      <span className="text-xs text-[#E2E2E0]/60 font-medium">Overall value</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
