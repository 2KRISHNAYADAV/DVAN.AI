import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBAStore } from '@/lib/businessAnalystStore';
import {
  Activity, Target, Lightbulb, AlertCircle, Zap, ClipboardList,
  FileText, MessageSquare, ShieldAlert, Settings, ArrowRight,
  Database, BarChart2, TrendingUp, Users
} from 'lucide-react';

export const BADashboard = () => {
  const { datasetHealth, datasetSummary, businessContext, kpis, insights, setActiveSection } = useBAStore();

  const quickLinks = [
    { id: 'kpi', label: 'KPI Analysis', icon: <Activity className="w-5 h-5" />, color: 'bg-teal-500/10 text-teal-400 border-teal-500/20', desc: 'View auto-discovered KPIs and trends' },
    { id: 'operations', label: 'Operations', icon: <BarChart2 className="w-5 h-5" />, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', desc: 'Operational breakdown & efficiency' },
    { id: 'root-cause', label: 'Root Cause', icon: <AlertCircle className="w-5 h-5" />, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', desc: 'Identify underlying problem drivers' },
    { id: 'insights', label: 'AI Insights', icon: <Lightbulb className="w-5 h-5" />, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', desc: 'Gemini-generated business insights' },
    { id: 'scenarios', label: 'Simulations', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', desc: 'What-if scenario planning' },
    { id: 'recommendations', label: 'Recommendations', icon: <Zap className="w-5 h-5" />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', desc: 'AI-powered action recommendations' },
    { id: 'action-plan', label: 'Action Plan', icon: <ClipboardList className="w-5 h-5" />, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', desc: 'Structured execution roadmap' },
    { id: 'executive-summary', label: 'Exec Summary', icon: <FileText className="w-5 h-5" />, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', desc: 'Boardroom-ready summary report' },
    { id: 'chat', label: 'AI Analyst', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-teal-500/10 text-teal-400 border-teal-500/20', desc: 'Chat with your data copilot' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-[#E2E2E0]">Business Analyst Dashboard</h2>
        <p className="text-[#E2E2E0]/60 mt-1">
          {businessContext
            ? `${businessContext.industry} · ${businessContext.primaryGoal}`
            : 'Overview of your analysis workspace'}
        </p>
      </div>

      {/* Dataset Health Bar */}
      {datasetHealth && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Rows', value: datasetHealth.rows.toLocaleString(), icon: <Database className="w-4 h-4" />, color: 'text-blue-400' },
            { label: 'Columns', value: String(datasetHealth.columns), icon: <BarChart2 className="w-4 h-4" />, color: 'text-purple-400' },
            { label: 'Quality Score', value: `${datasetHealth.dataQualityScore}/100`, icon: <ShieldAlert className="w-4 h-4" />, color: datasetHealth.dataQualityScore >= 80 ? 'text-emerald-400' : 'text-amber-400' },
            { label: 'KPIs Found', value: String(kpis.length), icon: <Activity className="w-4 h-4" />, color: 'text-teal-400' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-[#12484C] border-[#2B7574]/30">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
                <div>
                  <p className="text-xs text-[#E2E2E0]/50 uppercase tracking-wide">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Business Context Summary */}
      {businessContext && (
        <Card className="bg-[#12484C] border-[#2B7574]/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#E2E2E0]">
                <Target className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-sm">Business Context</span>
              </div>
              <Button variant="ghost" size="sm" className="text-teal-400 text-xs hover:text-teal-300"
                onClick={() => setActiveSection('context')}>
                Edit <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[#E2E2E0]/40 text-xs uppercase tracking-wide mb-0.5">Industry</p>
                <p className="text-[#E2E2E0] font-medium">{businessContext.industry}</p>
              </div>
              <div>
                <p className="text-[#E2E2E0]/40 text-xs uppercase tracking-wide mb-0.5">Primary Goal</p>
                <p className="text-[#E2E2E0] font-medium">{businessContext.primaryGoal}</p>
              </div>
              {businessContext.importantKPIs && businessContext.importantKPIs.length > 0 && (
                <div>
                  <p className="text-[#E2E2E0]/40 text-xs uppercase tracking-wide mb-0.5">Key Metrics</p>
                  <p className="text-[#E2E2E0] font-medium">{businessContext.importantKPIs.slice(0, 3).join(', ')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights Summary */}
      {insights.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#E2E2E0] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Top AI Insights
            </h3>
            <Button variant="ghost" size="sm" className="text-teal-400 text-xs"
              onClick={() => setActiveSection('insights')}>
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.slice(0, 2).map((ins, i) => (
              <Card key={i} className="bg-[#12484C] border-l-4 border-l-teal-500 border-[#2B7574]/20">
                <CardContent className="p-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    ins.businessImpact === 'High' ? 'bg-rose-100 text-rose-700' :
                    ins.businessImpact === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{ins.businessImpact} Impact</span>
                  <p className="text-sm font-semibold text-[#E2E2E0] mt-2">{ins.insight}</p>
                  <p className="text-xs text-[#E2E2E0]/60 mt-1 line-clamp-2">{ins.recommendedAction}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Navigation Grid */}
      <div>
        <h3 className="font-bold text-[#E2E2E0] mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-teal-400" />
          Analysis Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id)}
              className={`text-left p-4 rounded-xl border bg-[#12484C] hover:bg-[#12484C]/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${link.color.split(' ')[2]}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 border ${link.color}`}>
                {link.icon}
              </div>
              <p className="font-semibold text-[#E2E2E0] text-sm">{link.label}</p>
              <p className="text-xs text-[#E2E2E0]/50 mt-0.5 leading-relaxed">{link.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* No data yet prompt */}
      {!datasetHealth && (
        <Card className="bg-[#12484C] border-dashed border-2 border-[#2B7574]/30">
          <CardContent className="flex flex-col items-center py-16 text-center gap-4">
            <Database className="w-12 h-12 text-[#E2E2E0]/30" />
            <div>
              <h3 className="text-lg font-bold text-[#E2E2E0]">No dataset loaded</h3>
              <p className="text-[#E2E2E0]/60 text-sm mt-1">Upload a CSV or Excel file to start your analysis</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setActiveSection('data')}>
              Upload Data <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
