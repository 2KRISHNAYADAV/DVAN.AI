import React, { useState } from 'react';
import { useBAStore } from '@/lib/businessAnalystStore';
import { BADataUpload } from '@/components/business-analyst/BADataUpload';
import { BAContextSetup } from '@/components/business-analyst/BAContextSetup';
import { BAKpiDiscovery } from '@/components/business-analyst/BAKpiDiscovery';
import { BAInsights } from '@/components/business-analyst/BAInsights';
import { BARootCause } from '@/components/business-analyst/BARootCause';
import { BAOperations } from '@/components/business-analyst/BAOperations';
import { BAPerformance } from '@/components/business-analyst/BAPerformance';
import { BAAnalystChat } from '@/components/business-analyst/BAAnalystChat';
import { BAScenarios } from '@/components/business-analyst/BAScenarios';
import { BARecommendations } from '@/components/business-analyst/BARecommendations';
import { BAActionPlan } from '@/components/business-analyst/BAActionPlan';
import { BAExecutiveSummary } from '@/components/business-analyst/BAExecutiveSummary';
import { BAReports } from '@/components/business-analyst/BAReports';
import { BADataQuality } from '@/components/business-analyst/BADataQuality';
import { BADataTransform } from '@/components/business-analyst/BADataTransform';
import { BAIndustryAgents } from '@/components/business-analyst/BAIndustryAgents';
import { BACustomerAnalysis } from '@/components/business-analyst/BACustomerAnalysis';
import { BAFinancialAnalysis } from '@/components/business-analyst/BAFinancialAnalysis';
import { BASettings } from '@/components/business-analyst/BASettings';
import { BADashboard } from '@/components/business-analyst/BADashboard';
import { Menu, X, LayoutDashboard, FileSpreadsheet, PieChart, Activity, Target, MessageSquare, AlertCircle, Settings, ClipboardList, Lightbulb, Users, DollarSign, Calculator, ShieldAlert, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BusinessAnalyst = () => {
  const { rawDataset, activeSection, setActiveSection, businessContext } = useBAStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default false for mobile first
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'data', label: 'Data Sources', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'quality', label: 'Data Quality', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'transform', label: 'Excel Macros', icon: <Settings className="w-4 h-4" /> },
    { id: 'context', label: 'Business Overview', icon: <Target className="w-4 h-4" /> },
    { id: 'kpi', label: 'KPI Analysis', icon: <Activity className="w-4 h-4" /> },
    { id: 'operations', label: 'Operations', icon: <PieChart className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <Activity className="w-4 h-4" /> },
    { id: 'root-cause', label: 'Root Cause', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'insights', label: 'AI Insights', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'scenarios', label: 'Simulations', icon: <Calculator className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Recommendations', icon: <Zap className="w-4 h-4" /> },
    { id: 'action-plan', label: 'Action Plan', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'executive-summary', label: 'Exec Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'chat', label: 'AI Analyst', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'agents', label: 'AI Agents', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  if (businessContext?.importantKPIs?.includes('Revenue')) {
    navItems.splice(5, 0, { id: 'financial', label: 'Financial Analysis', icon: <DollarSign className="w-4 h-4" /> });
  }

  const renderContent = () => {
    if (rawDataset.length === 0) {
      return <BADataUpload />;
    }
    
    switch (activeSection) {
      case 'data': return <BADataUpload />;
      case 'dashboard': return <BADashboard />;
      case 'quality': return <BADataQuality />;
      case 'transform': return <BADataTransform />;
      case 'context': return <BAContextSetup />;
      case 'kpi': return <BAKpiDiscovery />;
      case 'operations': return <BAOperations />;
      case 'performance': return <BAPerformance />;
      case 'root-cause': return <BARootCause />;
      case 'insights': return <BAInsights />;
      case 'scenarios': return <BAScenarios />;
      case 'recommendations': return <BARecommendations />;
      case 'action-plan': return <BAActionPlan />;
      case 'executive-summary': return <BAExecutiveSummary />;
      case 'reports': return <BAReports />;
      case 'chat': return <BAAnalystChat />;
      case 'agents': return <BAIndustryAgents />;
      case 'customer': return <BACustomerAnalysis />;
      case 'financial': return <BAFinancialAnalysis />;
      case 'settings': return <BASettings />;
      default: return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-[#E2E2E0]/70">
            <h2 className="text-2xl font-semibold mb-2">{navItems.find(n => n.id === activeSection)?.label}</h2>
            <p>This section is under construction.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#0E2931] overflow-hidden font-sans relative">
      
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0E2931] text-[#E2E2E0] flex items-center px-4 justify-between z-30 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] textile-grain">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-teal flex items-center justify-center mr-3 shadow-[0_0_12px_rgba(43,117,116,0.5)]">
            <Activity className="w-5 h-5 text-[#E2E2E0]" />
          </div>
          <h1 className="font-extrabold tracking-tight text-lg text-[#E2E2E0]">Business Analyst</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-[rgba(43,117,116,0.3)] rounded-lg transition-colors text-[#E2E2E0]"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed lg:static inset-y-0 left-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64 flex-shrink-0 bg-[#0E2931] text-[#E2E2E0]/60 flex flex-col transition-transform duration-300 z-50 shadow-2xl lg:shadow-none overflow-y-auto textile-grain border-r border-[rgba(43,117,116,0.15)]`}
      >
        <div className="h-16 hidden lg:flex items-center px-6 bg-[#0E2931] border-b border-[rgba(43,117,116,0.15)] shrink-0 textile-grain">
          <div className="w-6 h-6 rounded-md badge-teal flex items-center justify-center mr-3 shrink-0">
            <Activity className="w-4 h-4 text-teal" />
          </div>
          <h1 className="font-extrabold tracking-tight text-[#E2E2E0] whitespace-nowrap">Business Analyst</h1>
        </div>
        
        <div className="p-4 flex-1 space-y-6">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#E2E2E0]/40 mb-2">Data Preparation</p>
            {navItems.slice(0, 4).map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                  activeSection === item.id 
                    ? 'bg-[rgba(43,117,116,0.15)] text-teal border border-[rgba(43,117,116,0.3)] shadow-inner' 
                    : 'border border-transparent hover:bg-[rgba(18,72,76,0.6)] hover:text-[#E2E2E0]'
                }`}
              >
                <span className={`mr-3 ${activeSection === item.id ? 'text-teal' : 'text-[#E2E2E0]/40'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#E2E2E0]/40 mb-2">Analysis Core</p>
            {navItems.slice(4, 9).map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                  activeSection === item.id 
                    ? 'bg-[rgba(43,117,116,0.15)] text-teal border border-[rgba(43,117,116,0.3)] shadow-inner' 
                    : 'border border-transparent hover:bg-[rgba(18,72,76,0.6)] hover:text-[#E2E2E0]'
                }`}
              >
                <span className={`mr-3 ${activeSection === item.id ? 'text-teal' : 'text-[#E2E2E0]/40'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#E2E2E0]/40 mb-2">Strategy & Execution</p>
            {navItems.slice(9, 15).map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                  activeSection === item.id 
                    ? 'bg-[rgba(43,117,116,0.15)] text-teal border border-[rgba(43,117,116,0.3)] shadow-inner' 
                    : 'border border-transparent hover:bg-[rgba(18,72,76,0.6)] hover:text-[#E2E2E0]'
                }`}
              >
                <span className={`mr-3 ${activeSection === item.id ? 'text-teal' : 'text-[#E2E2E0]/40'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#E2E2E0]/40 mb-2">AI Assistants & Settings</p>
            {navItems.slice(15).map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                  activeSection === item.id 
                    ? 'bg-[rgba(43,117,116,0.15)] text-teal border border-[rgba(43,117,116,0.3)] shadow-inner' 
                    : 'border border-transparent hover:bg-[rgba(18,72,76,0.6)] hover:text-[#E2E2E0]'
                }`}
              >
                <span className={`mr-3 ${activeSection === item.id ? 'text-teal' : 'text-[#E2E2E0]/40'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0E2931] relative pt-16 lg:pt-0 h-screen overflow-y-auto">
        {/* Header */}
        <header className="hidden lg:flex h-16 bg-[#12484C] border-b border-[#2B7574]/30 items-center justify-between px-4 sm:px-6 z-10 shrink-0 sticky top-0 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-[#E2E2E0]">
              {navItems.find(n => n.id === activeSection)?.label || 'Workspace'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {rawDataset.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                className="hidden sm:flex border-teal text-teal hover:bg-teal hover:text-white transition-all shadow-[0_4px_12px_-4px_rgba(43,117,116,0.3)]"
                onClick={() => setActiveSection('chat')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask AI Analyst
              </Button>
            )}
            <a href="/" className="text-sm font-semibold text-[#E2E2E0]/70 hover:text-teal transition-colors">
              Exit
            </a>
          </div>
        </header>

        {/* Content */}
        <div key={activeSection} className="flex-1 animate-swap-3d origin-center transform-style-3d bg-[#0E2931]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalyst;
