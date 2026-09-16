import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Database, Trash2, Key } from 'lucide-react';
import { useBAStore } from '@/lib/businessAnalystStore';
import { toast } from 'sonner';

export const BASettings = () => {
  const { clearWorkspace } = useBAStore();

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the entire Business Analyst workspace? This cannot be undone.')) {
      clearWorkspace();
      toast.success('Workspace cleared successfully');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <Settings className="w-8 h-8 mr-3 text-teal-600" />
            Workspace Settings
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Configure your AI analyst preferences and manage data.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="border-[#2B7574]/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Database className="w-5 h-5 mr-2 text-[#E2E2E0]/60" />
              Data Management
            </CardTitle>
            <CardDescription>Manage your currently loaded dataset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-rose-100 bg-rose-50 rounded-lg">
              <div>
                <h4 className="font-bold text-rose-900">Clear Workspace</h4>
                <p className="text-sm text-rose-700 mt-1">Remove all uploaded data, discovered KPIs, insights, and action plans. This action cannot be undone.</p>
              </div>
              <Button variant="destructive" onClick={handleClear} className="shrink-0 ml-4">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2B7574]/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Key className="w-5 h-5 mr-2 text-[#E2E2E0]/60" />
              AI Configuration
            </CardTitle>
            <CardDescription>Configure how the AI Analyst behaves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 max-w-md">
              <label className="text-sm font-semibold text-[#E2E2E0]">Gemini Model</label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-[#2B7574]/30 bg-[#12484C] px-3 py-2 text-sm ring-offset-white placeholder:text-[#E2E2E0]/70 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended for Analysis)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Faster)</option>
              </select>
            </div>
            
            <div className="space-y-2 max-w-md">
              <label className="text-sm font-semibold text-[#E2E2E0]">Confidence Threshold</label>
              <p className="text-xs text-[#E2E2E0]/70 mb-2">Only show AI insights with confidence scores above this percentage.</p>
              <Input type="number" defaultValue={80} min={50} max={99} className="w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
