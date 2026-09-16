import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBAStore } from '@/lib/businessAnalystStore';
import { Building2, ShoppingCart, Landmark, Cloud, Users, HeartPulse, Factory, BookOpen, MonitorPlay, Truck, Check } from 'lucide-react';

const AGENTS = [
  { id: 'default', name: 'General Business Analyst', icon: <Building2 className="w-5 h-5" />, desc: 'Standard business analysis and operations tracking.' },
  { id: 'ecommerce', name: 'E-commerce Analyst', icon: <ShoppingCart className="w-5 h-5" />, desc: 'Focuses on GMV, AOV, Conversion Rate, and Customer LTV.' },
  { id: 'fintech', name: 'Fintech Analyst', icon: <Landmark className="w-5 h-5" />, desc: 'Focuses on NPL, Transaction Volume, CAC, and Margin.' },
  { id: 'saas', name: 'SaaS Analyst', icon: <Cloud className="w-5 h-5" />, desc: 'Focuses on MRR, Churn Rate, CAC/LTV, and Engagement.' },
  { id: 'hr', name: 'HR / People Analytics', icon: <Users className="w-5 h-5" />, desc: 'Focuses on Retention, Time-to-Hire, eNPS, and Diversity.' },
  { id: 'healthcare', name: 'Healthcare Admin', icon: <HeartPulse className="w-5 h-5" />, desc: 'Focuses on Patient Outcomes, Bed Occupancy, and Claim Denials.' },
  { id: 'manufacturing', name: 'Manufacturing Analyst', icon: <Factory className="w-5 h-5" />, desc: 'Focuses on OEE, Yield, Defect Rate, and Supply Chain.' },
  { id: 'edtech', name: 'EdTech Analyst', icon: <BookOpen className="w-5 h-5" />, desc: 'Focuses on Completion Rate, Engagement, and Enrollment.' },
  { id: 'software', name: 'Software QA Analyst', icon: <MonitorPlay className="w-5 h-5" />, desc: 'Focuses on Defect Density, Test Coverage, and Escaped Bugs.' },
  { id: 'logistics', name: 'Logistics Analyst', icon: <Truck className="w-5 h-5" />, desc: 'Focuses on On-Time Delivery, Freight Cost, and Fleet Utilization.' },
];

export const BAIndustryAgents = () => {
  const { activeIndustryAgentId, setActiveIndustryAgentId, addChatMessage, setActiveSection } = useBAStore();

  const handleSelectAgent = (id: string, name: string) => {
    setActiveIndustryAgentId(id);
    addChatMessage({
      id: Date.now().toString(),
      role: 'assistant',
      content: `I've switched to the **${name}** persona. My analysis, KPIs, and recommendations will now be tailored to this industry.`,
      timestamp: new Date()
    });
    setActiveSection('chat');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <Users className="w-8 h-8 mr-3 text-teal-600" />
            Specialized Analyst Agents
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Switch the AI's persona to get industry-specific KPIs and deep domain expertise.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENTS.map((agent) => {
          const isActive = activeIndustryAgentId === agent.id;
          return (
            <Card 
              key={agent.id} 
              className={`transition-all cursor-pointer overflow-hidden ${
                isActive ? 'border-teal-500 ring-1 ring-teal-500 shadow-md bg-teal-50/10' : 'hover:border-[#2B7574]/40 hover:shadow-sm'
              }`}
              onClick={() => handleSelectAgent(agent.id, agent.name)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-teal-500 text-white shadow-md' : 'bg-[rgba(14,41,49,0.8)] text-[#E2E2E0]/80'
                  }`}>
                    {agent.icon}
                  </div>
                  {isActive && (
                    <div className="flex items-center text-xs font-bold text-teal-700 bg-teal-100 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3 mr-1" /> Active
                    </div>
                  )}
                </div>
                <h3 className={`font-bold mb-2 ${isActive ? 'text-teal-900' : 'text-[#E2E2E0]'}`}>
                  {agent.name}
                </h3>
                <p className="text-sm text-[#E2E2E0]/70 leading-relaxed">
                  {agent.desc}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
