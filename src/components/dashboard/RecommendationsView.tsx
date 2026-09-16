import React from 'react';
import { useDashboardStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const RecommendationsView = () => {
  const { aiProfile } = useDashboardStore();

  if (!aiProfile) return null;

  return (
    <Card className="mb-6 border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50 to-white overflow-hidden">
      <div className="bg-indigo-600 px-4 py-2 text-white flex items-center text-sm font-medium">
        <Sparkles className="w-4 h-4 mr-2" />
        AI Universal Data Understanding
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 border-r pr-6 border-indigo-100">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Detected Domain</h3>
            <p className="text-xl font-bold text-indigo-900 mb-4">{aiProfile.domain}</p>
            <p className="text-sm text-[#E2E2E0]/80 leading-relaxed">
              {aiProfile.summary}
            </p>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4">Recommended Analysis Paths</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiProfile.recommendedAnalysis.map((rec, i) => (
                <div key={i} className="flex items-start p-3 bg-[#12484C] rounded-lg border border-indigo-50 shadow-sm hover:border-indigo-200 transition-colors cursor-default group">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
                  <span className="text-sm font-medium text-[#E2E2E0] group-hover:text-indigo-700">{rec}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => {
                useDashboardStore.getState().setActiveTab('notebook');
              }}>
                Start Notebook Analysis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
