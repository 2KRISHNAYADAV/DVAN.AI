import React from 'react';
import { Brain, GitBranch, Database, ChartBar } from 'lucide-react';

const MLModelsSection = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
            <h3 className="font-semibold">Regression Models</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Linear Regression</li>
            <li>Decision Trees</li>
            <li>Random Forest</li>
            <li>Gradient Boosting</li>
          </ul>
        </div>
        
        <div className="p-4 bg-pink-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="h-5 w-5 text-pink-600 animate-pulse" />
            <h3 className="font-semibold">Classification Models</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Logistic Regression</li>
            <li>Support Vector Machines</li>
            <li>Neural Networks</li>
            <li>Random Forest Classifier</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-blue-600 animate-pulse" />
            <h3 className="font-semibold">Data Preparation</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Data Cleaning</li>
            <li>Feature Engineering</li>
            <li>Data Splitting</li>
            <li>Normalization</li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <ChartBar className="h-5 w-5 text-green-600 animate-pulse" />
            <h3 className="font-semibold">Model Evaluation</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Cross-Validation</li>
            <li>Performance Metrics</li>
            <li>Model Selection</li>
            <li>Hyperparameter Tuning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MLModelsSection;