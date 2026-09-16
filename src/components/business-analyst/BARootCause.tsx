import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBAStore } from '@/lib/businessAnalystStore';
import { AlertCircle, ArrowDown, ArrowRight, GitBranch, MessageSquare, Network, Search, Sparkles } from 'lucide-react';
import { getGeminiInsight } from '@/lib/geminiClient';
import { RootCause } from '@/lib/businessAnalystTypes';
import { toast } from 'sonner';

export const BARootCause = () => {
  const { kpis, datasetSummary, rootCauses, setRootCauses, setActiveSection, addChatMessage } = useBAStore();
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [isInvestigating, setIsInvestigating] = useState(false);

  const problems = kpis
    .filter(k => k.status === 'High Risk' || k.status === 'Needs Attention')
    .map(k => k.title);
    
  if (problems.length === 0) {
    problems.push('Revenue Drop', 'High Operational Delays', 'Customer Satisfaction Decrease');
  }

  const investigateRootCause = async () => {
    if (!selectedProblem) return;
    setIsInvestigating(true);
    
    try {
      const prompt = `
        You are a Senior Operations & Business Analyst.
        Investigate the root cause for the problem: "${selectedProblem}"
        
        Available dimensions in dataset:
        ${JSON.stringify(datasetSummary?.columns.filter(c => c.type === 'categorical').map(c => c.name))}
        
        Generate a plausible root cause analysis structured as a tree.
        Return ONLY valid JSON matching this interface:
        {
          "id": "rc-1",
          "kpi": "${selectedProblem}",
          "primaryFactors": ["Factor 1", "Factor 2"],
          "secondaryFactors": ["Factor 3"],
          "affectedSegments": ["Segment A", "Segment B"],
          "trendDescription": "Brief description of the negative trend",
          "evidence": "Simulated data point showing why this is the root cause"
        }
      `;
      
      const response = await getGeminiInsight(prompt);
      const jsonStrMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonStrMatch) {
        const rc = JSON.parse(jsonStrMatch[0]) as RootCause;
        
        // Add some mock tree data for visualization since LLM can't easily build nested UI trees
        rc.treeData = {
          name: selectedProblem,
          children: rc.primaryFactors.map((factor, i) => ({
            name: factor,
            children: i === 0 ? rc.affectedSegments.map(seg => ({ name: seg })) : []
          }))
        };
        
        setRootCauses([rc]);
      }
    } catch (error) {
      console.error('Failed to investigate root cause', error);
      toast.error('Failed to generate root cause analysis');
    } finally {
      setIsInvestigating(false);
    }
  };

  const handleAskAI = () => {
    if (rootCauses.length === 0) return;
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: `Let's discuss the root cause for ${rootCauses[0].kpi}. You identified ${rootCauses[0].primaryFactors.join(', ')} as primary factors. What should we do?`,
      timestamp: new Date()
    });
    setActiveSection('chat');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <Network className="w-8 h-8 mr-3 text-teal-600" />
            Root Cause Analysis
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Trace problems down to their origin across multiple business dimensions.
          </p>
        </div>
        <Button 
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => setActiveSection('operations')}
          disabled={isInvestigating}
        >
          View Operations
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <Card className="border-[#2B7574]/30 shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-semibold text-[#E2E2E0]">Select Issue to Investigate</label>
              <Select value={selectedProblem} onValueChange={setSelectedProblem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a high-risk KPI or problem area" />
                </SelectTrigger>
                <SelectContent>
                  {problems.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="bg-slate-900 hover:bg-slate-800 text-white"
              onClick={investigateRootCause}
              disabled={!selectedProblem || isInvestigating}
            >
              {isInvestigating ? <Sparkles className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Investigate
            </Button>
          </div>
        </CardContent>
      </Card>

      {isInvestigating && (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-[#2B7574]/30 rounded-2xl bg-[#12484C] mt-8">
          <Network className="w-12 h-12 text-teal-500 animate-pulse mb-4" />
          <h3 className="text-lg font-bold text-[#E2E2E0]">Tracing Root Causes...</h3>
          <p className="text-[#E2E2E0]/70">Cross-referencing dimensions and analyzing segment anomalies.</p>
        </div>
      )}

      {!isInvestigating && rootCauses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-rose-100 shadow-md">
              <CardHeader className="bg-rose-50 border-b border-rose-100 pb-4">
                <CardTitle className="text-lg flex items-center text-rose-900">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Investigation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-[#E2E2E0]/60 uppercase tracking-wider mb-1">Issue</h4>
                  <p className="text-base font-bold text-[#E2E2E0]">{rootCauses[0].kpi}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#E2E2E0]/60 uppercase tracking-wider mb-1">Trend</h4>
                  <p className="text-sm text-[#E2E2E0]">{rootCauses[0].trendDescription}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#E2E2E0]/60 uppercase tracking-wider mb-1">Primary Factors</h4>
                  <ul className="list-disc list-inside text-sm text-[#E2E2E0] font-medium space-y-1">
                    {rootCauses[0].primaryFactors.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#E2E2E0]/60 uppercase tracking-wider mb-1">Evidence</h4>
                  <p className="text-sm text-[#E2E2E0] bg-[#0E2931] p-2 rounded border border-[#2B7574]/20">
                    {rootCauses[0].evidence}
                  </p>
                </div>
                
                <Button className="w-full bg-[rgba(14,41,49,0.8)] text-[#E2E2E0] hover:bg-[rgba(14,41,49,0.9)] hover:text-[#E2E2E0]" onClick={handleAskAI}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Discuss Findings with AI
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-full border-[#2B7574]/30 shadow-sm">
              <CardHeader className="border-b border-[#2B7574]/20 pb-4">
                <CardTitle className="text-lg flex items-center text-[#E2E2E0]">
                  <GitBranch className="w-5 h-5 mr-2 text-teal-600" />
                  Root Cause Tree
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 flex flex-col items-center overflow-x-auto">
                {/* Visual representation of a tree */}
                <div className="flex flex-col items-center">
                  <div className="px-6 py-3 bg-rose-100 text-rose-800 font-bold rounded-xl border border-rose-200 shadow-sm text-center min-w-[200px]">
                    {rootCauses[0].treeData.name}
                  </div>
                  
                  <ArrowDown className="w-6 h-10 text-slate-300 my-2" />
                  
                  <div className="flex gap-8 relative">
                    {/* Top connecting line */}
                    {rootCauses[0].treeData.children.length > 1 && (
                      <div className="absolute top-0 left-[25%] right-[25%] h-[2px] bg-slate-300 -mt-[1px]"></div>
                    )}
                    
                    {rootCauses[0].treeData.children.map((child: any, idx: number) => (
                      <div key={idx} className="flex flex-col items-center relative">
                        {/* Connecting line down to node */}
                        {rootCauses[0].treeData.children.length > 1 && (
                          <div className="w-[2px] h-6 bg-slate-300 mb-2"></div>
                        )}
                        
                        <div className="px-4 py-2 bg-amber-50 text-amber-800 font-semibold rounded-lg border border-amber-200 text-center min-w-[150px] shadow-sm z-10">
                          {child.name}
                        </div>
                        
                        {child.children && child.children.length > 0 && (
                          <>
                            <ArrowDown className="w-4 h-8 text-slate-300 my-2" />
                            <div className="flex flex-col gap-2">
                              {child.children.map((grandChild: any, gIdx: number) => (
                                <div key={gIdx} className="px-3 py-1.5 bg-[#0E2931] text-[#E2E2E0]/80 text-sm font-medium rounded border border-[#2B7574]/30 text-center shadow-sm">
                                  {grandChild.name}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
