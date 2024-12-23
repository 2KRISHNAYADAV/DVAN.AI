import React from 'react';
import { Brain, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RegressionSection = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg animate-bounce">Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[
              "Simple Linear Regression",
              "Multiple Linear Regression"
            ].map((type, index) => (
              <li 
                key={index} 
                className="flex items-center gap-2 hover:text-primary transition-colors"
                style={{
                  animation: `bounce ${0.5 + index * 0.1}s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <Brain className="h-4 w-4 text-primary animate-pulse" />
                {type}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg animate-bounce">Basic Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="bg-muted px-4 py-2 rounded block text-center hover:bg-primary/10 transition-colors animate-pulse">
            Y = β₀ + β₁X + ε
          </code>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg animate-bounce">Model Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[
              "R-Squared (R²)",
              "Adjusted R-Squared",
              "F-Test"
            ].map((metric, index) => (
              <li 
                key={index} 
                className="flex items-center gap-2 hover:text-primary transition-colors"
                style={{
                  animation: `bounce ${0.5 + index * 0.1}s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <Calculator className="h-4 w-4 text-primary animate-pulse" />
                {metric}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegressionSection;