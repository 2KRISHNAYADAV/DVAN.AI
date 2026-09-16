import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBAStore } from '@/lib/businessAnalystStore';
import { CheckCircle2, ArrowRight, Zap, Target, ShieldAlert, Sparkles, Plus } from 'lucide-react';
import { Recommendation, ActionItem } from '@/lib/businessAnalystTypes';
import { getGeminiInsight } from '@/lib/geminiClient';
import { toast } from 'sonner';

export const BARecommendations = () => {
  const { kpis, rootCauses, insights, recommendations, setRecommendations, setActionPlan, actionPlan, setActiveSection } = useBAStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const hasAutoRun = React.useRef(false);

  useEffect(() => {
    if (recommendations.length === 0 && (kpis.length > 0 || insights.length > 0) && !hasAutoRun.current) {
      hasAutoRun.current = true;
      generateRecommendations();
    }
  }, [kpis, insights]);

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `
        You are a Senior Business Consultant. Based on this analysis:
        KPIs: ${JSON.stringify(kpis.map(k => ({ title: k.title, status: k.status })))}
        Insights: ${JSON.stringify(insights.map(i => i.insight))}
        Root Causes: ${JSON.stringify(rootCauses.map(r => r.primaryFactors))}
        
        Generate 4 strategic, actionable recommendations to improve performance.
        Return ONLY a strict JSON array of objects matching this interface:
        [{
          "id": "rec-1",
          "priority": "High" | "Medium" | "Low",
          "problem": "The issue being addressed",
          "recommendation": "Specific, actionable strategy",
          "expectedImpact": "Quantifiable or clear business benefit",
          "effort": "High" | "Medium" | "Low",
          "owner": "Role responsible (e.g. Ops Manager, IT)",
          "timeline": "e.g. 2 weeks, 1 month, Q3"
        }]
      `;
      
      const response = await getGeminiInsight(prompt);
      const jsonStrMatch = response.match(/\[[\s\S]*\]/);
      
      if (jsonStrMatch) {
        const generatedRecs = JSON.parse(jsonStrMatch[0]) as Recommendation[];
        setRecommendations(generatedRecs);
      }
    } catch (error) {
      console.error('Failed to generate recommendations', error);
      toast.error('Failed to generate AI recommendations');
    } finally {
      setIsGenerating(false);
    }
  };

  const addToActionPlan = (rec: Recommendation) => {
    // Check if already added
    if (actionPlan.some(a => a.id === `act-${rec.id}`)) {
      toast.info('Already in Action Plan');
      return;
    }
    
    const newAction: ActionItem = {
      id: `act-${rec.id}`,
      action: rec.recommendation,
      owner: rec.owner,
      priority: rec.priority,
      deadline: rec.timeline,
      status: 'Not Started',
      expectedOutcome: rec.expectedImpact
    };
    
    setActionPlan([...actionPlan, newAction]);
    toast.success('Added to Action Plan');
  };

  const addAllToActionPlan = () => {
    const newActions = recommendations
      .filter(rec => !actionPlan.some(a => a.id === `act-${rec.id}`))
      .map(rec => ({
        id: `act-${rec.id}`,
        action: rec.recommendation,
        owner: rec.owner,
        priority: rec.priority,
        deadline: rec.timeline,
        status: 'Not Started' as const,
        expectedOutcome: rec.expectedImpact
      }));
      
    if (newActions.length > 0) {
      setActionPlan([...actionPlan, ...newActions]);
      toast.success(`Added ${newActions.length} items to Action Plan`);
    } else {
      toast.info('All recommendations are already in the Action Plan');
    }
    setActiveSection('action-plan');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <Zap className="w-8 h-8 mr-3 text-teal-600" />
            Strategic Recommendations
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            AI-generated action items based on your data patterns and root causes.
          </p>
        </div>
        <Button 
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={addAllToActionPlan}
          disabled={isGenerating || recommendations.length === 0}
        >
          Create Action Plan
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {isGenerating ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-[#2B7574]/30 rounded-2xl bg-[#12484C]">
          <Sparkles className="w-12 h-12 text-teal-500 animate-pulse mb-4" />
          <h3 className="text-lg font-bold text-[#E2E2E0]">Formulating Strategy...</h3>
          <p className="text-[#E2E2E0]/70">Analyzing root causes and calculating expected impact.</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-[#2B7574]/30 rounded-2xl bg-[#0E2931]">
          <Target className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-[#E2E2E0]">No Recommendations Yet</h3>
          <p className="text-[#E2E2E0]/70 text-sm max-w-md text-center mb-6">
            Generate insights or root causes first, or manually trigger the AI to formulate a strategic plan.
          </p>
          <Button onClick={generateRecommendations} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI Strategy
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((rec, idx) => (
            <Card key={rec.id || idx} className="hover:shadow-md transition-shadow border border-[#2B7574]/30 overflow-hidden flex flex-col">
              <CardHeader className={`pb-3 border-b flex-row justify-between items-start space-y-0 ${
                rec.priority === 'High' ? 'bg-rose-50 border-rose-100' :
                rec.priority === 'Medium' ? 'bg-amber-50 border-amber-100' :
                'bg-[#0E2931] border-[#2B7574]/20'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rec.priority === 'High' ? 'bg-rose-200 text-rose-800' :
                      rec.priority === 'Medium' ? 'bg-amber-200 text-amber-800' :
                      'bg-[rgba(14,41,49,0.9)] text-[#E2E2E0]'
                    }`}>
                      {rec.priority} Priority
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[rgba(14,41,49,0.9)] text-[#E2E2E0] border border-[#2B7574]/40">
                      Effort: {rec.effort}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-[#E2E2E0] leading-snug">
                    {rec.problem}
                  </CardTitle>
                </div>
                {rec.priority === 'High' && (
                  <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                )}
              </CardHeader>
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="bg-teal-50 border border-teal-100 p-4 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-teal-500" />
                    <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center">
                      <Target className="w-3.5 h-3.5 mr-1" />
                      Recommendation
                    </h4>
                    <p className="text-sm font-medium text-[#E2E2E0] leading-relaxed">
                      {rec.recommendation}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#E2E2E0]/60 uppercase tracking-wider mb-1">Expected Impact</h4>
                      <p className="text-sm text-[#E2E2E0] font-medium">
                        {rec.expectedImpact}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#E2E2E0]/60 uppercase tracking-wider mb-1">Execution</h4>
                      <p className="text-sm text-[#E2E2E0]">
                        {rec.owner} &bull; {rec.timeline}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#2B7574]/20">
                  <Button 
                    variant="outline" 
                    className="w-full text-[#E2E2E0] border-[#2B7574]/30 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200"
                    onClick={() => addToActionPlan(rec)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Action Plan
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
