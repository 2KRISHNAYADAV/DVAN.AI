import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  Clock,
  Sparkles,
  LineChart,
  ChevronDown,
  ChevronUp,
  BarChart,
  TrendingUp,
  Scan,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MLModelsSection from './predictive/MLModelsSection';
import TimeSeriesSection from './predictive/TimeSeriesSection';
import PatternRecognitionSection from './predictive/PatternRecognitionSection';
import VisualizationSection from './predictive/VisualizationSection';

const PredictiveAnalysis = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sections = [
    {
      id: "ml-models",
      title: "Machine Learning Models",
      icon: Brain,
      component: MLModelsSection,
      description: "Advanced ML models for prediction"
    },
    {
      id: "time-series",
      title: "Time Series Forecasting",
      icon: Clock,
      component: TimeSeriesSection,
      description: "Predict future trends"
    },
    {
      id: "pattern-recognition",
      title: "Pattern Recognition",
      icon: Scan,
      component: PatternRecognitionSection,
      description: "Identify data patterns"
    },
    {
      id: "visualization",
      title: "Visualization Techniques",
      icon: LineChart,
      component: VisualizationSection,
      description: "Visual insights"
    }
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight animate-bounce text-purple-600">
            Predictive Analysis
          </h2>
          <p className="text-muted-foreground animate-fade-in">
            Forecasting future trends and patterns through advanced analytics
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2 hover:scale-105 transition-transform"
        >
          {isExpanded ? (
            <>
              Hide Details
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show Details
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <div className={cn(
        "grid gap-4 transition-all duration-300",
        isExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      )}>
        <Tabs defaultValue="ml-models" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <section.icon className="h-4 w-4 animate-pulse" />
                <span className="animate-fade-in">{section.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 animate-bounce">
                    <section.icon className="h-6 w-6 text-purple-600" />
                    {section.title}
                  </CardTitle>
                  <CardDescription className="animate-fade-in">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <section.component />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default PredictiveAnalysis;