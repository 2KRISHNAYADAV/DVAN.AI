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
  Calculator,
  ChartBar,
  LineChart,
  PieChart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import HypothesisSection from './inferential/HypothesisSection';
import ConfidenceSection from './inferential/ConfidenceSection';
import RegressionSection from './inferential/RegressionSection';
import VisualizationSection from './inferential/VisualizationSection';

const InferentialAnalysis = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sections = [
    {
      id: "hypothesis",
      title: "Hypothesis Testing",
      icon: Calculator,
      component: HypothesisSection
    },
    {
      id: "confidence",
      title: "Confidence Intervals",
      icon: LineChart,
      component: ConfidenceSection
    },
    {
      id: "regression",
      title: "Regression Analysis",
      icon: ChartBar,
      component: RegressionSection
    },
    {
      id: "visualization",
      title: "Visualization Techniques",
      icon: PieChart,
      component: VisualizationSection
    }
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Inferential Analysis
          </h2>
          <p className="text-muted-foreground">
            Drawing conclusions from data samples through statistical methods
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
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
        isExpanded ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"
      )}>
        <Tabs defaultValue="hypothesis" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="flex items-center gap-2 py-2 px-4 whitespace-normal text-left h-auto"
              >
                <section.icon className="h-4 w-4 flex-shrink-0" />
                <span>{section.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <section.icon className="h-6 w-6" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>
                    Detailed explanation of {section.title.toLowerCase()}
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

export default InferentialAnalysis;