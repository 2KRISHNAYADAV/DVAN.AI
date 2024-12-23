import React from 'react';
import { Scan, Eye, Zap, Search } from 'lucide-react';

const PatternRecognitionSection = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-violet-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Scan className="h-5 w-5 text-violet-600 animate-pulse" />
            <h3 className="font-semibold">Feature Extraction</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Dimensionality Reduction</li>
            <li>Principal Component Analysis</li>
            <li>Feature Selection</li>
            <li>Feature Engineering</li>
          </ul>
        </div>

        <div className="p-4 bg-fuchsia-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-5 w-5 text-fuchsia-600 animate-pulse" />
            <h3 className="font-semibold">Pattern Types</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Sequential Patterns</li>
            <li>Structural Patterns</li>
            <li>Temporal Patterns</li>
            <li>Spatial Patterns</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-rose-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-rose-600 animate-pulse" />
            <h3 className="font-semibold">Recognition Methods</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Neural Networks</li>
            <li>Support Vector Machines</li>
            <li>Decision Trees</li>
            <li>Deep Learning</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-5 w-5 text-amber-600 animate-pulse" />
            <h3 className="font-semibold">Applications</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Image Recognition</li>
            <li>Speech Recognition</li>
            <li>Text Analysis</li>
            <li>Anomaly Detection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatternRecognitionSection;