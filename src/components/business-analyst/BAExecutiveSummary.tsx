import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBAStore } from '@/lib/businessAnalystStore';
import { FileText, Download, Sparkles, Building2, Calendar, Target } from 'lucide-react';
import { getGeminiInsight } from '@/lib/geminiClient';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

export const BAExecutiveSummary = () => {
  const { businessContext, kpis, insights, recommendations, actionPlan } = useBAStore();
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `
        You are a Senior Business Consultant writing an Executive Summary for the C-Suite.
        
        Context:
        - Industry: ${businessContext?.industry}
        - Company Type: ${businessContext?.companyType}
        - Goal: ${businessContext?.primaryGoal}
        
        Key Metrics:
        ${JSON.stringify(kpis.map(k => ({ title: k.title, value: k.currentValue, trend: k.trend, status: k.status })))}
        
        Key Insights:
        ${JSON.stringify(insights.map(i => i.insight))}
        
        Strategic Recommendations:
        ${JSON.stringify(recommendations.map(r => r.recommendation))}
        
        Write a concise, professional executive summary in Markdown format. 
        Use these sections:
        1. Business Overview
        2. Key Findings & Performance
        3. Critical Risks
        4. Strategic Recommendations
        
        Keep the tone executive, decisive, and data-driven. Do not use filler words.
      `;
      
      const response = await getGeminiInsight(prompt);
      setSummary(response);
      toast.success('Executive summary generated successfully');
    } catch (error) {
      console.error('Failed to generate summary', error);
      toast.error('Failed to generate executive summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    // Basic text download for now (in a real app, use jsPDF or html2pdf)
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Executive-Summary-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <FileText className="w-8 h-8 mr-3 text-teal-600" />
            Executive Summary
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            C-Suite ready report summarizing performance, insights, and strategy.
          </p>
        </div>
        <div className="flex gap-3">
          {summary && (
            <Button variant="outline" className="border-[#2B7574]/30 text-[#E2E2E0]" onClick={downloadReport}>
              <Download className="w-4 h-4 mr-2" />
              Download Markdown
            </Button>
          )}
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-200/50"
            onClick={generateSummary}
            disabled={isGenerating || kpis.length === 0}
          >
            {isGenerating ? <Sparkles className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {summary ? 'Regenerate Summary' : 'Generate Summary'}
          </Button>
        </div>
      </div>

      {!summary && !isGenerating ? (
        <Card className="border-dashed border-2 border-[#2B7574]/30 bg-[#0E2931] text-center py-20 shadow-none">
          <CardContent>
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#E2E2E0] mb-2">Ready to Draft</h3>
            <p className="text-[#E2E2E0]/70 max-w-md mx-auto mb-6">
              The AI Analyst has analyzed your KPIs, identified root causes, and formulated a strategy. Click generate to draft the final report.
            </p>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white" onClick={generateSummary}>
              Start Drafting
            </Button>
          </CardContent>
        </Card>
      ) : isGenerating ? (
        <div className="h-[600px] flex flex-col items-center justify-center border border-[#2B7574]/30 rounded-2xl bg-[#12484C] shadow-sm">
          <Sparkles className="w-12 h-12 text-teal-500 animate-pulse mb-6" />
          <h3 className="text-xl font-bold text-[#E2E2E0] mb-2">Writing Executive Summary...</h3>
          <div className="w-64 space-y-2 mt-4">
            <div className="h-2 bg-[rgba(14,41,49,0.8)] rounded overflow-hidden">
              <div className="h-full bg-teal-500 w-full animate-[pulse_1s_ease-in-out_infinite]" />
            </div>
            <p className="text-xs text-center text-[#E2E2E0]/60 font-medium uppercase tracking-wider">Synthesizing strategy</p>
          </div>
        </div>
      ) : (
        <Card className="border-[#2B7574]/30 shadow-xl overflow-hidden relative">
          <div className="h-2 w-full bg-gradient-to-r from-slate-800 to-teal-700 absolute top-0 left-0" />
          <CardHeader className="bg-[#0E2931] border-b border-[#2B7574]/20 pb-6 pt-10 px-10">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-[#E2E2E0] tracking-tight">Executive Summary</h1>
                <p className="text-[#E2E2E0]/70 mt-2 font-medium">Strategic Analysis & Operations Review</p>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center justify-end text-sm text-[#E2E2E0]/80">
                  <Building2 className="w-4 h-4 mr-2 text-[#E2E2E0]/60" />
                  {businessContext?.industry || 'Unknown Industry'}
                </div>
                <div className="flex items-center justify-end text-sm text-[#E2E2E0]/80">
                  <Target className="w-4 h-4 mr-2 text-[#E2E2E0]/60" />
                  {businessContext?.primaryGoal || 'Business Optimization'}
                </div>
                <div className="flex items-center justify-end text-sm text-[#E2E2E0]/80">
                  <Calendar className="w-4 h-4 mr-2 text-[#E2E2E0]/60" />
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 bg-[#12484C]">
            <div className="prose prose-slate max-w-none prose-headings:text-[#E2E2E0] prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-[#E2E2E0]/80 prose-p:leading-relaxed prose-li:text-[#E2E2E0]/80 marker:text-teal-500">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
