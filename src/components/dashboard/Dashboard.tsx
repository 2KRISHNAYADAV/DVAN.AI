import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from './DataTable';
import { DescriptiveStats } from './DescriptiveStats';
import { TrendsPanel } from './TrendsPanel';
import { PredictivePanel } from './PredictivePanel';
import { Navigation } from './Navigation';
import { LineChart, BarChart, PieChart, Brain } from 'lucide-react';

interface DashboardProps {
  data: any[];
  columns: string[];
}

const Dashboard = ({ data, columns }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Interactive Data Analysis Dashboard
        </h1>
        <p className="text-gray-600">
          Explore and analyze your data through interactive visualizations and insights
        </p>
      </div>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Dashboard Area */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-100">
            <BarChart className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="descriptive" className="data-[state=active]:bg-blue-100">
            <PieChart className="w-4 h-4 mr-2" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-green-100">
            <LineChart className="w-4 h-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="predictive" className="data-[state=active]:bg-orange-100">
            <Brain className="w-4 h-4 mr-2" />
            Predictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable data={data} columns={columns} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="descriptive" className="space-y-4">
          <DescriptiveStats data={data} columns={columns} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <TrendsPanel data={data} columns={columns} />
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <PredictivePanel data={data} columns={columns} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;