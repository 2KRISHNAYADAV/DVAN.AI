import React from 'react';
import { Sigma, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConfidenceSection = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg animate-bounce">Formulas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[
              "For Mean (Known σ): x̄ ± (z × σ/√n)",
              "For Mean (Unknown σ): x̄ ± (t × s/√n)",
              "For Proportion: p̂ ± z × √(p̂(1-p̂)/n)"
            ].map((formula, index) => (
              <li 
                key={index} 
                className="flex items-center gap-2"
                style={{
                  animation: `bounce ${0.5 + index * 0.1}s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <Sigma className="h-4 w-4 text-primary animate-pulse" />
                <code className="bg-muted px-2 py-1 rounded hover:bg-primary/10 transition-colors">
                  {formula}
                </code>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg animate-bounce">Key Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[
              "z: Z-value for confidence level",
              "t: t-value for confidence level",
              "p̂: Sample proportion"
            ].map((term, index) => (
              <li 
                key={index} 
                className="flex items-center gap-2 hover:text-primary transition-colors"
                style={{
                  animation: `bounce ${0.5 + index * 0.1}s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <BookOpen className="h-4 w-4 text-primary animate-pulse" />
                {term}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfidenceSection;