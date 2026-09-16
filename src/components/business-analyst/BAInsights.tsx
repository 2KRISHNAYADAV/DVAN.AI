import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBAStore } from '@/lib/businessAnalystStore';
import { Lightbulb, AlertTriangle, ArrowRight, MessageSquare, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { AIInsight } from '@/lib/businessAnalystTypes';
import { getGeminiInsight } from '@/lib/geminiClient';
import { toast } from 'sonner';

export const BAInsights = () => {
  const { datasetSummary, businessContext, kpis, insights, setInsights, setActiveSection, addChatMessage } = useBAStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const hasAutoRun = React.useRef(false);

  useEffect(() => {
    if (insights.length === 0 && kpis.length > 0 && !hasAutoRun.current) {
      hasAutoRun.current = true;
      generateInsights();
    }
  }, [kpis]);

  const generateInsights = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `
        You are a Senior Business Analyst. Analyze the following KPI data and dataset metadata to generate 4 critical business insights.
        
        Business Goal: ${businessContext?.primaryGoal}
        Industry: ${businessContext?.industry}
        
        KPIs:
        ${JSON.stringify(kpis.map(k => ({ title: k.title, current: k.currentValue, trend: k.trend, status: k.status })))}
        
        Metadata:
        ${JSON.stringify(datasetSummary?.columns.map(c => ({ name: c.name, type: c.type })))}
        
        Return ONLY a strict JSON array of objects matching this interface:
        [{
          "id": "unique-id",
          "insight": "The core insight (e.g., 'Operations has the highest delay concentration')",
          "evidence": "Data point proving this (e.g., '34% of delayed tasks belong to Operations')",
          "businessImpact": "High" | "Medium" | "Low",
          "confidence": 95,
          "recommendedAction": "What to do about it",
          "type": "AI Interpretation"
        }]
      `;
      
      const response = await getGeminiInsight(prompt);
      const jsonStrMatch = response.match(/\[[\s\S]*\]/);
      
      if (jsonStrMatch) {
        const generatedInsights = JSON.parse(jsonStrMatch[0]) as AIInsight[];
        setInsights(generatedInsights);
      }
    } catch (error) {
      console.error('Failed to generate insights', error);
      toast.error('Failed to generate AI insights');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAskAI = (insight: AIInsight) => {
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: `Can you explain this insight in more detail? "${insight.insight}"`,
      timestamp: new Date()
    });
    setActiveSection('chat');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <Lightbulb className="w-8 h-8 mr-3 text-teal-600" />
            AI Business Insights
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Automated intelligence derived from your KPIs and dataset patterns.
          </p>
        </div>
        <Button 
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => setActiveSection('root-cause')}
          disabled={isGenerating || insights.length === 0}
        >
          Investigate Root Causes
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {isGenerating ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-[#2B7574]/30 rounded-2xl bg-[#12484C]">
          <Sparkles className="w-12 h-12 text-teal-500 animate-pulse mb-4" />
          <h3 className="text-lg font-bold text-[#E2E2E0]">Synthesizing Business Insights...</h3>
          <p className="text-[#E2E2E0]/70">Correlating KPIs, detecting anomalies, and formulating recommendations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((insight, idx) => (
            <Card key={insight.id || idx} className="hover:shadow-lg transition-shadow border-l-4 border-l-teal-500 overflow-hidden flex flex-col">
              <CardHeader className="pb-3 bg-[#0E2931] border-b border-[#2B7574]/20 flex-row justify-between items-start space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                      {insight.type || 'AI Interpretation'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      insight.businessImpact === 'High' ? 'bg-rose-100 text-rose-800' :
                      insight.businessImpact === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-[rgba(14,41,49,0.9)] text-[#E2E2E0]'
                    }`}>
                      {insight.businessImpact} Impact
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-[#E2E2E0] leading-snug">
                    {insight.insight}
                  </CardTitle>
                </div>
                {insight.businessImpact === 'High' && (
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                )}
              </CardHeader>
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#E2E2E0]/60 uppercase tracking-wider mb-1">Evidence</h4>
                    <p className="text-sm text-[#E2E2E0] bg-[#0E2931] p-2 rounded border border-[#2B7574]/20">
                      {insight.evidence}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Recommended Action</h4>
                    <p className="text-sm font-medium text-[#E2E2E0]">
                      {insight.recommendedAction}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#2B7574]/20 flex items-center justify-between">
                  <div className="text-xs text-[#E2E2E0]/60 flex items-center">
                    <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                    AI Confidence: {insight.confidence}%
                  </div>
                  <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50" onClick={() => handleAskAI(insight)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
