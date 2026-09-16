import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/lib/store';
import { DatasetSummary } from '@/lib/dataAnalysis';
import { RandomForestRegression as RFRegression } from 'ml-random-forest';
import { BrainCircuit, Play } from 'lucide-react';
import { toast } from 'sonner';

interface MLStudioProps {
  summary: DatasetSummary;
}

export const MLStudio = ({ summary }: MLStudioProps) => {
  const { globalData, aiProfile } = useDashboardStore();
  const numericCols = summary.columns.filter(c => c.type === 'numeric').map(c => c.name);

  const [targetCol, setTargetCol] = useState<string>('');
  const [featureCols, setFeatureCols] = useState<string[]>([]);
  const [modelType, setModelType] = useState<string>('regression');
  
  const [isTraining, setIsTraining] = useState(false);
  const [result, setResult] = useState<any>(null);

  const toggleFeature = (col: string) => {
    if (featureCols.includes(col)) {
      setFeatureCols(featureCols.filter(c => c !== col));
    } else {
      setFeatureCols([...featureCols, col]);
    }
  };

  const trainModel = async () => {
    if (!targetCol || featureCols.length === 0) return;
    setIsTraining(true);

    try {
      // Small timeout to allow UI to render the "Training..." state
      await new Promise(resolve => setTimeout(resolve, 100));

      const X: number[][] = [];
      const y: number[] = [];

      globalData.forEach(row => {
        const targetVal = Number(row[targetCol]);
        if (isNaN(targetVal)) return;

        const featureRow = featureCols.map(f => Number(row[f]) || 0);
        X.push(featureRow);
        y.push(targetVal);
      });

      if (X.length < 10) {
        throw new Error('Not enough valid rows for training (minimum 10).');
      }

      // Simple Train/Test Split (80/20)
      const splitIdx = Math.floor(X.length * 0.8);
      const X_train = X.slice(0, splitIdx);
      const y_train = y.slice(0, splitIdx);
      const X_test = X.slice(splitIdx);
      const y_test = y.slice(splitIdx);

      if (modelType === 'regression') {
        const options = {
          seed: 42,
          maxFeatures: Math.max(1, Math.floor(Math.sqrt(featureCols.length))),
          replacement: true,
          nEstimators: 10, // keep it small for browser
        };

        const regression = new RFRegression(options);
        regression.train(X_train, y_train);
        
        const predictions = regression.predict(X_test);
        
        // Calculate MAE
        let mae = 0;
        for (let i = 0; i < predictions.length; i++) {
          mae += Math.abs(predictions[i] - y_test[i]);
        }
        mae /= predictions.length;

        // Naive R^2
        const meanY = y_test.reduce((a, b) => a + b, 0) / y_test.length;
        const ssTot = y_test.reduce((acc, val) => acc + Math.pow(val - meanY, 2), 0);
        const ssRes = predictions.reduce((acc, val, i) => acc + Math.pow(y_test[i] - val, 2), 0);
        const r2 = 1 - (ssRes / (ssTot === 0 ? 1 : ssTot));

        setResult({
          type: 'regression',
          mae,
          r2,
          samples: X.length,
          features: featureCols.length
        });
        
        toast.success('Model trained successfully!');
      }

    } catch (err: any) {
      toast.error(err.message || 'Error training model.');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <Card className="shadow-sm border-indigo-100">
      <CardHeader className="bg-indigo-50/50 pb-4">
        <CardTitle className="flex items-center text-lg text-indigo-900">
          <BrainCircuit className="w-5 h-5 mr-2 text-indigo-600" />
          Machine Learning Studio
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Model Type</label>
                {aiProfile && (
                  <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:bg-indigo-50" onClick={() => {
                    if (aiProfile.metrics.length > 0) {
                      const target = aiProfile.metrics[0];
                      setTargetCol(target);
                      setFeatureCols(numericCols.filter(c => c !== target));
                      toast.success("AI auto-filled target and features!");
                    }
                  }}>
                    <BrainCircuit className="w-3 h-3 mr-1" /> Auto-Fill via AI
                  </Button>
                )}
              </div>
              <Select value={modelType} onValueChange={setModelType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regression">Random Forest (Regression)</SelectItem>
                  {/* Classification could be added later */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Variable (What to Predict)</label>
              <Select value={targetCol} onValueChange={setTargetCol}>
                <SelectTrigger className="w-full border-green-200">
                  <SelectValue placeholder="Select Target" />
                </SelectTrigger>
                <SelectContent>
                  {numericCols.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Features (Inputs)</label>
              <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
                {numericCols.filter(c => c !== targetCol).map(col => (
                  <div key={col} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`feat-${col}`} 
                      checked={featureCols.includes(col)}
                      onChange={() => toggleFeature(col)}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <label htmlFor={`feat-${col}`} className="text-sm cursor-pointer">{col}</label>
                  </div>
                ))}
                {numericCols.length <= 1 && (
                  <p className="text-sm text-[#E2E2E0]/70">Not enough numeric columns for features.</p>
                )}
              </div>
            </div>

            <Button 
              onClick={trainModel} 
              disabled={!targetCol || featureCols.length === 0 || isTraining} 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isTraining ? 'Training Model...' : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Train Model
                </>
              )}
            </Button>
          </div>

          <div className="bg-[#0E2931] rounded-xl p-6 border">
            <h3 className="text-sm font-bold text-[#E2E2E0]/70 mb-4 uppercase tracking-wider">Model Results</h3>
            {result ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#12484C] rounded-lg shadow-sm border">
                  <p className="text-sm text-[#E2E2E0]/70">R² Score (Accuracy)</p>
                  <p className="text-3xl font-bold text-indigo-700">{(result.r2 * 100).toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-[#12484C] rounded-lg shadow-sm border">
                  <p className="text-sm text-[#E2E2E0]/70">Mean Absolute Error (MAE)</p>
                  <p className="text-xl font-bold text-[#E2E2E0]">{result.mae.toFixed(2)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#12484C] rounded-lg shadow-sm border">
                    <p className="text-xs text-[#E2E2E0]/70">Samples Trained</p>
                    <p className="text-lg font-semibold">{result.samples}</p>
                  </div>
                  <div className="p-3 bg-[#12484C] rounded-lg shadow-sm border">
                    <p className="text-xs text-[#E2E2E0]/70">Features Used</p>
                    <p className="text-lg font-semibold">{result.features}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#E2E2E0]/60 space-y-4">
                <BrainCircuit className="w-12 h-12 opacity-20" />
                <p>Select target and features, then click train to see results.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
