import React from 'react';
import { Binary, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HypothesisSection = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg animate-bounce">Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[
              "State the Hypotheses (H₀ and H₁)",
              "Select Significance Level (α)",
              "Choose Test Statistic",
              "Compute Test Statistic",
              "Determine P-Value",
              "Make Decision"
            ].map((step, index) => (
              <li 
                key={index} 
                className="flex items-center gap-2 hover:text-primary transition-colors"
                style={{
                  animation: `bounce ${0.5 + index * 0.1}s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
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
          <CardTitle className="text-lg animate-bounce">Common Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[
              "One-Sample Z-Test",
              "Two-Sample T-Test",
              "ANOVA",
              "Chi-Square Test"
            ].map((test, index) => (
              <li 
                key={index} 
                className="flex items-center gap-2 hover:text-primary transition-colors"
                style={{
                  animation: `bounce ${0.5 + index * 0.1}s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <Binary className="h-4 w-4 text-primary animate-pulse" />
                {test}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HypothesisSection;