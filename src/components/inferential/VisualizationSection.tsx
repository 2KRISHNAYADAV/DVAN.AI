import React from 'react';
import { ChartBar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VisualizationSection = () => {
  const techniques = {
    "Hypothesis Testing": ["Boxplots", "Q-Q Plots"],
    "Confidence Intervals": ["Error Bars", "Confidence Bands"],
    "Regression": ["Scatter Plots", "Residual Plots", "Heatmaps"]
  };

  return (
    <div className="space-y-4">
      {Object.entries(techniques).map(([category, items], categoryIndex) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg animate-bounce">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {items.map((technique, index) => (
                <li 
                  key={index} 
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                  style={{
                    animation: `bounce ${0.5 + categoryIndex * 0.1 + index * 0.1}s ease-in-out infinite`,
                    animationDelay: `${categoryIndex * 0.1 + index * 0.1}s`
                  }}
                >
                  <ChartBar className="h-4 w-4 text-primary animate-pulse" />
                  {technique}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VisualizationSection;