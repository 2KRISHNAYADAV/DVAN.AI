import React from 'react';
import { LineChart, BarChart, PieChart, TrendingUp } from 'lucide-react';

const VisualizationSection = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-sky-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <LineChart className="h-5 w-5 text-sky-600 animate-pulse" />
            <h3 className="font-semibold">Time Series Plots</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Line Charts</li>
            <li>Area Charts</li>
            <li>Candlestick Charts</li>
            <li>Moving Averages</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <BarChart className="h-5 w-5 text-blue-600 animate-pulse" />
            <h3 className="font-semibold">Statistical Plots</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Box Plots</li>
            <li>Histograms</li>
            <li>Scatter Plots</li>
            <li>Q-Q Plots</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="h-5 w-5 text-indigo-600 animate-pulse" />
            <h3 className="font-semibold">Distribution Plots</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Density Plots</li>
            <li>Violin Plots</li>
            <li>Heat Maps</li>
            <li>Contour Plots</li>
          </ul>
        </div>

        <div className="p-4 bg-violet-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-violet-600 animate-pulse" />
            <h3 className="font-semibold">Model Evaluation</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>ROC Curves</li>
            <li>Precision-Recall</li>
            <li>Learning Curves</li>
            <li>Residual Plots</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisualizationSection;