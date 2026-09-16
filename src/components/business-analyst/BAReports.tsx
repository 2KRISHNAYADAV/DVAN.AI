import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Copy, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

export const BAReports = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    toast.success('Report link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const templates = [
    { title: 'Weekly Business Review', desc: 'Standard WBR covering top metrics, anomalies, and operational highlights.', icon: <FileText className="w-5 h-5 text-indigo-500" /> },
    { title: 'Monthly Operations Review', desc: 'Deep dive into SLAs, efficiency, and team performance metrics.', icon: <FileSpreadsheet className="w-5 h-5 text-emerald-500" /> },
    { title: 'Management Summary', desc: 'High-level executive brief with strategic recommendations.', icon: <FileText className="w-5 h-5 text-amber-500" /> },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <FileText className="w-8 h-8 mr-3 text-teal-600" />
            Report Generation Hub
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Export your analysis into presentation-ready formats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#2B7574]/30 shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xl">Export as PDF</CardTitle>
            <p className="text-sm text-[#E2E2E0]/70">Download the full Business Analyst workspace, including charts, KPIs, and AI insights, as a paginated PDF document.</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white" onClick={() => toast.info('Generating PDF...')}>
              <Download className="w-4 h-4 mr-2" />
              Download Full PDF Report
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-[#2B7574]/30 shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xl">Share Dashboard</CardTitle>
            <p className="text-sm text-[#E2E2E0]/70">Generate a secure read-only link to share this interactive workspace with stakeholders.</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#0E2931] border border-[#2B7574]/30 rounded-md px-3 py-2 text-sm text-[#E2E2E0]/70 font-mono truncate flex items-center">
                https://dvan.ai/share/ba-wksp-9f82d1
              </div>
              <Button variant="outline" onClick={handleCopy} className="shrink-0 w-12 p-0">
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#E2E2E0]/70" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12">
        <h3 className="text-xl font-bold text-[#E2E2E0] mb-6">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((tpl, i) => (
            <Card key={i} className="hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-full bg-[rgba(14,41,49,0.8)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {tpl.icon}
                </div>
                <h4 className="font-bold text-[#E2E2E0] mb-2">{tpl.title}</h4>
                <p className="text-sm text-[#E2E2E0]/70 leading-relaxed mb-4">{tpl.desc}</p>
                <div className="text-sm font-medium text-teal-600 group-hover:text-teal-700 flex items-center">
                  Generate <ArrowRight className="w-4 h-4 ml-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// We need an arrow right icon
import { ArrowRight } from 'lucide-react';
