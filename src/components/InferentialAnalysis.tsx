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
  Calculator,
  ChartBar,
  LineChart,
  BarChart,
  PieChart,
  Sigma,
  Binary,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const InferentialAnalysis = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sections = [
    {
      id: "hypothesis",
      title: "Hypothesis Testing",
      icon: Calculator,
      content: {
        steps: [
          "State the Hypotheses (H₀ and H₁)",
          "Select Significance Level (α)",
          "Choose Test Statistic",
          "Compute Test Statistic",
          "Determine P-Value",
          "Make Decision"
        ],
        tests: [
          "One-Sample Z-Test",
          "Two-Sample T-Test",
          "ANOVA",
          "Chi-Square Test"
        ]
      }
    },
    {
      id: "confidence",
      title: "Confidence Intervals",
      icon: LineChart,
      content: {
        formulas: [
          "For Mean (Known σ): x̄ ± (z × σ/√n)",
          "For Mean (Unknown σ): x̄ ± (t × s/√n)",
          "For Proportion: p̂ ± z × √(p̂(1-p̂)/n)"
        ],
        terms: [
          "z: Z-value for confidence level",
          "t: t-value for confidence level",
          "p̂: Sample proportion"
        ]
      }
    },
    {
      id: "regression",
      title: "Regression Analysis",
      icon: ChartBar,
      content: {
        types: [
          "Simple Linear Regression",
          "Multiple Linear Regression"
        ],
        formula: "Y = β₀ + β₁X + ε",
        evaluation: [
          "R-Squared (R²)",
          "Adjusted R-Squared",
          "F-Test"
        ]
      }
    },
    {
      id: "visualization",
      title: "Visualization Techniques",
      icon: PieChart,
      content: {
        techniques: {
          "Hypothesis Testing": ["Boxplots", "Q-Q Plots"],
          "Confidence Intervals": ["Error Bars", "Confidence Bands"],
          "Regression": ["Scatter Plots", "Residual Plots", "Heatmaps"]
        }
      }
    }
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Inferential Analysis</h2>
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
        isExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      )}>
        <Tabs defaultValue="hypothesis" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="flex items-center gap-2"
              >
                <section.icon className="h-4 w-4" />
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
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
                  {section.id === "hypothesis" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {section.content.steps.map((step, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                                  {index + 1}
                                </div>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Common Tests</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {section.content.tests.map((test, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Binary className="h-4 w-4 text-primary" />
                                {test}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {section.id === "confidence" && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Formulas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {section.content.formulas.map((formula, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Sigma className="h-4 w-4 text-primary" />
                                <code className="bg-muted px-2 py-1 rounded">
                                  {formula}
                                </code>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Key Terms</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {section.content.terms.map((term, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                {term}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {section.id === "regression" && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Types</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {section.content.types.map((type, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Brain className="h-4 w-4 text-primary" />
                                {type}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Basic Formula</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <code className="bg-muted px-4 py-2 rounded block text-center">
                            {section.content.formula}
                          </code>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Model Evaluation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {section.content.evaluation.map((metric, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Calculator className="h-4 w-4 text-primary" />
                                {metric}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {section.id === "visualization" && (
                    <div className="space-y-4">
                      {Object.entries(section.content.techniques).map(([category, techniques]) => (
                        <Card key={category}>
                          <CardHeader>
                            <CardTitle className="text-lg">{category}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {techniques.map((technique, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <ChartBar className="h-4 w-4 text-primary" />
                                  {technique}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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