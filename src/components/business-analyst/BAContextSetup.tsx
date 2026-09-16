import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, ArrowRight, Sparkles, Building2, Briefcase } from 'lucide-react';
import { useBAStore } from '@/lib/businessAnalystStore';
import { getGeminiInsight } from '@/lib/geminiClient';
import { toast } from 'sonner';

const INDUSTRIES = [
  'E-commerce', 'Fintech', 'SaaS', 'Retail', 'Healthcare', 
  'Manufacturing', 'EdTech', 'IT Services', 'Software Testing', 'Logistics', 'Other'
];

const GOALS = [
  'Increase revenue', 'Reduce operational delays', 'Improve customer retention',
  'Reduce costs', 'Improve employee productivity', 'Improve SLA performance',
  'Identify fraud/risk', 'Improve conversion', 'Other'
];

export const BAContextSetup = () => {
  const { setBusinessContext, setActiveSection, datasetSummary, isDemoMode } = useBAStore();
  
  const [industry, setIndustry] = useState(isDemoMode ? 'IT Services' : '');
  const [companyType, setCompanyType] = useState(isDemoMode ? 'B2B' : '');
  const [primaryGoal, setPrimaryGoal] = useState(isDemoMode ? 'Reduce operational delays' : '');
  const [analysisPeriod, setAnalysisPeriod] = useState('YTD');
  
  const [isInferring, setIsInferring] = useState(false);

  const handleInfer = async () => {
    if (!datasetSummary) return;
    setIsInferring(true);
    
    try {
      const prompt = `
        You are a Senior Business Analyst. Based on this dataset metadata:
        ${JSON.stringify({
          columns: datasetSummary.columns.map(c => ({ name: c.name, type: c.type })),
          rowCount: datasetSummary.rowCount
        })}
        
        Infer the business context. Return ONLY a valid JSON object matching this interface:
        {
          "industry": "one of: E-commerce, Fintech, SaaS, Retail, Healthcare, Manufacturing, EdTech, IT Services, Software Testing, Logistics",
          "companyType": "e.g. B2B, B2C, Enterprise",
          "primaryGoal": "The most likely primary business goal for analyzing this data"
        }
      `;
      
      const response = await getGeminiInsight(prompt);
      const jsonStrMatch = response.match(/\{[\s\S]*\}/);
      if (jsonStrMatch) {
        const inferred = JSON.parse(jsonStrMatch[0]);
        setIndustry(inferred.industry || 'Other');
        setCompanyType(inferred.companyType || 'Unknown');
        setPrimaryGoal(inferred.primaryGoal || 'Unknown');
        toast.success('Business context inferred from data');
      }
    } catch (error) {
      console.error('Failed to infer context', error);
      toast.error('Could not infer context automatically. Please set manually.');
    } finally {
      setIsInferring(false);
    }
  };

  const handleSave = () => {
    if (!industry || !primaryGoal) {
      toast.error('Please select an industry and primary goal');
      return;
    }
    
    setBusinessContext({
      industry,
      companyType,
      primaryGoal,
      importantKPIs: [], // Will be populated in KPI Discovery
      analysisPeriod
    });
    
    setActiveSection('kpi');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-extrabold text-[#E2E2E0]">Define Business Context</h2>
        <p className="text-[#E2E2E0]/70 text-lg max-w-2xl mx-auto">
          Tell the AI Analyst about your business to receive tailored KPIs, insights, and industry-specific recommendations.
        </p>
      </div>

      <Card className="border-teal-100 shadow-xl shadow-teal-100/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-500" />
        <CardContent className="p-8">
          <div className="flex justify-end mb-6">
            <Button 
              variant="outline" 
              onClick={handleInfer} 
              disabled={isInferring}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              {isInferring ? (
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Let AI infer from data
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-[#E2E2E0] flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-teal-600" />
                Industry
              </label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(ind => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-[#E2E2E0] flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-teal-600" />
                Company Type
              </label>
              <Input 
                placeholder="e.g. B2B, B2C, Marketplace, Enterprise" 
                value={companyType}
                onChange={e => setCompanyType(e.target.value)}
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="text-sm font-semibold text-[#E2E2E0] flex items-center">
                <Target className="w-4 h-4 mr-2 text-teal-600" />
                Primary Business Goal
              </label>
              <Select value={primaryGoal} onValueChange={setPrimaryGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="What are you trying to achieve?" />
                </SelectTrigger>
                <SelectContent>
                  {GOALS.map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4 md:col-span-2">
              <label className="text-sm font-semibold text-[#E2E2E0]">Analysis Period</label>
              <div className="flex gap-3">
                {['MTD', 'QTD', 'YTD', 'Last 12 Months', 'All Time'].map(period => (
                  <Button
                    key={period}
                    variant={analysisPeriod === period ? 'default' : 'outline'}
                    className={analysisPeriod === period ? 'bg-teal-600 hover:bg-teal-700' : ''}
                    onClick={() => setAnalysisPeriod(period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex justify-end">
            <Button 
              className="bg-teal-600 hover:bg-teal-700 text-white px-8"
              onClick={handleSave}
            >
              Discover KPIs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
