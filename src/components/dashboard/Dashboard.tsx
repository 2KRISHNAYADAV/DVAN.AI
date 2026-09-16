import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIGrid } from './KPIGrid';
import { DynamicChartArea } from './DynamicChartArea';
import { CopilotSidebar } from './CopilotSidebar';
import { ComparisonEngine } from './ComparisonEngine';
import { DashboardBuilder } from '../builder/DashboardBuilder';
import { Notebook } from '../workspace/Notebook';
import { MLStudio } from '../ml/MLStudio';
import { RecommendationsView } from './RecommendationsView';
import { DataTable } from './DataTable';
import { Navigation } from './Navigation';
import { BarChart, PieChart, Table as TableIcon, Download, GitCompare, LayoutDashboard, BookOpen, BrainCircuit } from 'lucide-react';
import { analyzeDataset, DatasetSummary } from '@/lib/dataAnalysis';
import { generateRuleBasedCharts, enhanceChartsWithAI, ChartRecommendation } from '@/lib/chartRecommendations';
import { exportDashboardToPDF } from '@/lib/reportGenerator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useDashboardStore } from '@/lib/store';

interface DashboardProps {
  data: any[];
  columns: string[];
}

const Dashboard = ({ data, columns }: DashboardProps) => {
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [charts, setCharts] = useState<ChartRecommendation[]>([]);
  const [isGeneratingCharts, setIsGeneratingCharts] = useState(true);
  const { setGlobalData, activeTab, setActiveTab } = useDashboardStore();

  useEffect(() => {
    setGlobalData(data); // Push raw data to store for cross-filtering
    const runAnalysis = async () => {
      setIsGeneratingCharts(true);
      try {
        const dsSummary = analyzeDataset(data);
        setSummary(dsSummary);

        const ruleBased = generateRuleBasedCharts(dsSummary);
        setCharts(ruleBased); // Set initial fast charts
        
        // Generate Universal AI Profile
        const sampleData = data.slice(0, 3);
        const { generateUniversalProfile } = await import('@/lib/geminiClient');
        const profile = await generateUniversalProfile(dsSummary, sampleData);
        useDashboardStore.getState().setAiProfile(profile);

        // Then try AI enhancement in background
        const enhanced = await enhanceChartsWithAI(dsSummary, ruleBased);
        setCharts(enhanced);
      } catch (error) {
        console.error("Analysis failed", error);
        toast.error("Failed to generate some charts");
      } finally {
        setIsGeneratingCharts(false);
      }
    };

    if (data && data.length > 0) {
      runAnalysis();
    }
  }, [data]);

  const kpiCharts = charts.filter(c => c.type === 'kpi');
  
  return (
    <div className="min-h-screen bg-[#0E2931] p-4 lg:p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#E2E2E0]">AI Analytics Dashboard</h1>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => exportDashboardToPDF('dashboard-export-area')}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {charts.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          {/* Main Dashboard Area */}
          <div id="dashboard-export-area" className="xl:col-span-2 flex flex-col space-y-6 bg-[#0E2931] p-2 rounded-lg">
            <RecommendationsView />
            
            <KPIGrid kpiRecommendations={kpiCharts} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <div className="w-full overflow-x-auto pb-2 mb-4 scrollbar-hide">
                <TabsList className="flex w-max min-w-full">
                  <TabsTrigger value="visualizations" className="flex-1">
                    <PieChart className="w-4 h-4 mr-2 shrink-0" />
                    Visualizations
                  </TabsTrigger>
                  <TabsTrigger value="comparison" className="flex-1">
                    <GitCompare className="w-4 h-4 mr-2 shrink-0" />
                    Comparison
                  </TabsTrigger>
                  <TabsTrigger value="builder" className="flex-1">
                    <LayoutDashboard className="w-4 h-4 mr-2 shrink-0" />
                    Manual Builder
                  </TabsTrigger>
                  <TabsTrigger value="notebook" id="notebook-tab-trigger" className="flex-1">
                    <BookOpen className="w-4 h-4 mr-2 shrink-0" />
                    Notebook
                  </TabsTrigger>
                  <TabsTrigger value="ml" className="flex-1">
                    <BrainCircuit className="w-4 h-4 mr-2 shrink-0" />
                    ML Studio
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex-1">
                    <TableIcon className="w-4 h-4 mr-2 shrink-0" />
                    Raw Data
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="visualizations" className="mt-0 outline-none">
                {isGeneratingCharts && charts.length === kpiCharts.length ? (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-[#2B7574]/30 rounded-xl">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-[#E2E2E0]/70">AI is designing your dashboard...</p>
                    </div>
                  </div>
                ) : (
                  <DynamicChartArea recommendations={charts} />
                )}
              </TabsContent>

              <TabsContent value="comparison" className="mt-0 outline-none">
                <ComparisonEngine summary={summary} />
              </TabsContent>

              <TabsContent value="builder" className="mt-0 outline-none">
                <DashboardBuilder summary={summary} />
              </TabsContent>

              <TabsContent value="notebook" className="mt-0 outline-none">
                <Notebook summary={summary} />
              </TabsContent>

              <TabsContent value="ml" className="mt-0 outline-none">
                <MLStudio summary={summary} />
              </TabsContent>

              <TabsContent value="data" className="mt-0 outline-none">
                <Card>
                  <CardContent className="p-0">
                    <DataTable data={data} columns={columns} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Copilot Sidebar */}
          <div className="xl:col-span-1 h-[calc(100vh-120px)] sticky top-6">
            <CopilotSidebar summary={summary} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;