import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LineChart,
  BarChart,
  Brain,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Calculator,
  PieChart,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

const AnalysisMethods = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const methods = [
    {
      title: 'Descriptive Analysis',
      description: 'Summarize and visualize data patterns',
      icon: Calculator,
      features: [
        { name: 'Mean, Median, Mode calculations', icon: BarChart },
        { name: 'Distribution analysis', icon: PieChart },
        { name: 'Trend identification', icon: TrendingUp },
      ],
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Inferential Analysis',
      description: 'Draw conclusions from data samples',
      icon: Brain,
      features: [
        { name: 'Hypothesis testing', icon: Calculator },
        { name: 'Confidence intervals', icon: LineChart },
        { name: 'Regression analysis', icon: TrendingUp },
      ],
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Predictive Analysis',
      description: 'Forecast future trends and patterns',
      icon: TrendingUp,
      features: [
        { name: 'Machine learning models', icon: Brain },
        { name: 'Time series forecasting', icon: LineChart },
        { name: 'Pattern recognition', icon: Sparkles },
      ],
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Prescriptive Analysis',
      description: 'Optimize decisions with data insights',
      icon: Lightbulb,
      features: [
        { name: 'Decision optimization', icon: Brain },
        { name: 'Scenario analysis', icon: Calculator },
        { name: 'Action recommendations', icon: Sparkles },
      ],
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="space-y-6 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Analysis Methods</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive suite of data analysis techniques to unlock valuable insights from your data
        </p>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="gap-2"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      <div className={`grid gap-6 transition-all duration-500 ease-in-out ${
        isExpanded ? 'grid-cols-1 md:grid-cols-2 opacity-100' : 'grid-cols-1 opacity-0 h-0 overflow-hidden'
      }`}>
        {methods.map((method) => (
          <Card key={method.title} className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${method.color}`}>
                  <method.icon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {method.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3">
                    <feature.icon className="w-5 h-5 text-muted-foreground" />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalysisMethods;