import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useBAStore } from '@/lib/businessAnalystStore';
import { Calculator, TrendingUp, TrendingDown, RefreshCcw, Save } from 'lucide-react';
import { toast } from 'sonner';

export const BAScenarios = () => {
  const { kpis, businessContext } = useBAStore();
  
  // Simulation assumptions
  const [assumptions, setAssumptions] = useState({
    staffing: 0, // % change
    processingTime: 0,
    demand: 0,
    costPerUnit: 0
  });

  const handleAssumptionChange = (key: keyof typeof assumptions, value: number[]) => {
    setAssumptions(prev => ({ ...prev, [key]: value[0] }));
  };

  const resetAssumptions = () => {
    setAssumptions({ staffing: 0, processingTime: 0, demand: 0, costPerUnit: 0 });
  };

  // Very simplistic simulation logic for demo
  const simulateKPI = (kpi: any) => {
    let multiplier = 1;
    const name = kpi.title.toLowerCase();
    
    if (name.includes('revenue') || name.includes('sales')) {
      multiplier = 1 + (assumptions.demand * 0.01) + (assumptions.staffing * 0.005);
    } else if (name.includes('cost') || name.includes('expense')) {
      multiplier = 1 + (assumptions.costPerUnit * 0.01) + (assumptions.staffing * 0.008);
    } else if (name.includes('delay') || name.includes('time')) {
      multiplier = 1 + (assumptions.processingTime * 0.01) - (assumptions.staffing * 0.005);
    } else if (name.includes('satisfaction') || name.includes('score')) {
      multiplier = 1 - (assumptions.processingTime * 0.005) + (assumptions.staffing * 0.002);
    }
    
    const simulatedValue = Number(kpi.currentValue) * multiplier;
    const difference = simulatedValue - Number(kpi.currentValue);
    const percentDiff = (difference / Number(kpi.currentValue)) * 100;
    
    return {
      ...kpi,
      simulatedValue,
      difference,
      percentDiff
    };
  };

  const simulatedKpis = kpis.map(simulateKPI);

  const formatValue = (value: number, format?: string) => {
    if (isNaN(value)) return value;
    if (format === 'currency') return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (format === 'percentage') return `${value.toFixed(1)}%`;
    return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <Calculator className="w-8 h-8 mr-3 text-teal-600" />
            What-If Scenario Simulator
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Adjust business variables to forecast operational and financial impact.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAssumptions}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => toast.success('Scenario saved successfully')}>
            <Save className="w-4 h-4 mr-2" />
            Save Scenario
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Variables Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-[#2B7574]/30 shadow-sm">
            <CardHeader className="bg-[#0E2931] border-b border-[#2B7574]/20 pb-4">
              <CardTitle className="text-lg">Adjust Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#E2E2E0]">Staffing Level</label>
                  <span className={`text-sm font-bold ${assumptions.staffing > 0 ? 'text-emerald-600' : assumptions.staffing < 0 ? 'text-rose-600' : 'text-[#E2E2E0]/70'}`}>
                    {assumptions.staffing > 0 ? '+' : ''}{assumptions.staffing}%
                  </span>
                </div>
                <Slider 
                  value={[assumptions.staffing]} 
                  min={-50} max={50} step={1}
                  onValueChange={(val) => handleAssumptionChange('staffing', val)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#E2E2E0]">Processing Time / Delays</label>
                  <span className={`text-sm font-bold ${assumptions.processingTime > 0 ? 'text-rose-600' : assumptions.processingTime < 0 ? 'text-emerald-600' : 'text-[#E2E2E0]/70'}`}>
                    {assumptions.processingTime > 0 ? '+' : ''}{assumptions.processingTime}%
                  </span>
                </div>
                <Slider 
                  value={[assumptions.processingTime]} 
                  min={-50} max={50} step={1}
                  onValueChange={(val) => handleAssumptionChange('processingTime', val)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#E2E2E0]">Demand / Volume</label>
                  <span className={`text-sm font-bold ${assumptions.demand > 0 ? 'text-emerald-600' : assumptions.demand < 0 ? 'text-rose-600' : 'text-[#E2E2E0]/70'}`}>
                    {assumptions.demand > 0 ? '+' : ''}{assumptions.demand}%
                  </span>
                </div>
                <Slider 
                  value={[assumptions.demand]} 
                  min={-50} max={50} step={1}
                  onValueChange={(val) => handleAssumptionChange('demand', val)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#E2E2E0]">Cost Per Unit</label>
                  <span className={`text-sm font-bold ${assumptions.costPerUnit > 0 ? 'text-rose-600' : assumptions.costPerUnit < 0 ? 'text-emerald-600' : 'text-[#E2E2E0]/70'}`}>
                    {assumptions.costPerUnit > 0 ? '+' : ''}{assumptions.costPerUnit}%
                  </span>
                </div>
                <Slider 
                  value={[assumptions.costPerUnit]} 
                  min={-50} max={50} step={1}
                  onValueChange={(val) => handleAssumptionChange('costPerUnit', val)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8">
          <Card className="h-full border-[#2B7574]/30 shadow-sm">
            <CardHeader className="border-b border-[#2B7574]/20 pb-4">
              <CardTitle className="text-lg">Simulated KPI Impact</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0E2931] border-b border-[#2B7574]/20 text-xs font-bold text-[#E2E2E0]/70 uppercase tracking-wider">
                      <th className="p-4 pl-6">Metric</th>
                      <th className="p-4">Current Baseline</th>
                      <th className="p-4">Simulated Target</th>
                      <th className="p-4 pr-6 text-right">Estimated Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {simulatedKpis.map(kpi => (
                      <tr key={kpi.id} className="hover:bg-[#0E2931]/50 transition-colors">
                        <td className="p-4 pl-6 font-semibold text-[#E2E2E0]">{kpi.title}</td>
                        <td className="p-4 text-[#E2E2E0]/80 font-medium">
                          {formatValue(Number(kpi.currentValue), kpi.format)}
                        </td>
                        <td className="p-4 font-bold text-[#E2E2E0]">
                          {formatValue(kpi.simulatedValue, kpi.format)}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className={`inline-flex items-center justify-end font-bold px-2.5 py-1 rounded-full text-xs ${
                            kpi.percentDiff > 0 
                              ? (kpi.status === 'High Risk' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700')
                              : kpi.percentDiff < 0
                                ? (kpi.status === 'High Risk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')
                                : 'bg-[rgba(14,41,49,0.8)] text-[#E2E2E0]/80'
                          }`}>
                            {kpi.percentDiff > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : kpi.percentDiff < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                            {kpi.percentDiff > 0 ? '+' : ''}{kpi.percentDiff.toFixed(1)}%
                            <span className="mx-2 opacity-30">|</span>
                            {formatValue(kpi.difference, kpi.format)}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {simulatedKpis.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-[#E2E2E0]/70">
                          No KPIs discovered yet. Please run KPI discovery first.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
