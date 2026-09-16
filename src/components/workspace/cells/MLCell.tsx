import React, { useState, useMemo } from 'react';
import { useNotebookStore } from '@/lib/notebookStore';
import { analyzeDataset } from '@/lib/dataAnalysis';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Play, Sparkles, Send, Bot, User, BarChart2, Download, Table, Settings, Code, FileJson, CheckCircle2 } from 'lucide-react';
import { RandomForestRegression as RFRegression } from 'ml-random-forest';
import MLR from 'ml-regression-multivariate-linear';
import KNN from 'ml-knn';
import { getGeminiInsight } from '@/lib/geminiClient';
import { toast } from 'sonner';
import { sampleCorrelation } from 'simple-statistics';

interface MLCellProps {
  cellId: string;
  index: number;
}

export const MLCell = ({ cellId, index }: MLCellProps) => {
  const { getDatasetForCell, setCellResult, cells } = useNotebookStore();
  const cell = cells.find(c => c.id === cellId);
  const localData = getDatasetForCell(index);
  const summary = useMemo(() => analyzeDataset(localData), [localData]);
  const numericCols = summary.columns.filter(c => c.type === 'numeric').map(c => c.name);

  const [activeTab, setActiveTab] = useState('data');
  const [targetCol, setTargetCol] = useState<string>('');
  const [featureCols, setFeatureCols] = useState<string[]>([]);
  const [modelType, setModelType] = useState<string>('random_forest');
  
  // Hyperparams
  const [rfTrees, setRfTrees] = useState(100);
  const [splitRatio, setSplitRatio] = useState("80/20");
  const [isTraining, setIsTraining] = useState(false);

  const toggleFeature = (col: string) => {
    if (featureCols.includes(col)) {
      setFeatureCols(featureCols.filter(c => c !== col));
    } else {
      setFeatureCols([...featureCols, col]);
    }
  };

  const generatePythonCode = () => {
    return `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# 1. Load Data
# df = pd.read_csv('dataset.csv')

# 2. Preprocessing & Feature Engineering
features = ${JSON.stringify(featureCols)}
target = '${targetCol}'

X = df[features].dropna()
y = df[target].loc[X.index]

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 3. Train/Test Split (${splitRatio})
test_size = ${splitRatio === "70/30" ? "0.3" : "0.2"}
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=test_size, random_state=42)

# 4. Model Training (${modelType})
${modelType === 'random_forest' ? `from sklearn.ensemble import RandomForestRegressor
model = RandomForestRegressor(n_estimators=${rfTrees}, random_state=42)` : ''}
${modelType === 'mlr' ? `from sklearn.linear_model import LinearRegression
model = LinearRegression()` : ''}
${modelType === 'knn' ? `from sklearn.neighbors import KNeighborsRegressor
model = KNeighborsRegressor(n_neighbors=3)` : ''}
${modelType === 'xgboost' ? `from xgboost import XGBRegressor
model = XGBRegressor(n_estimators=100, random_state=42)` : ''}

model.fit(X_train, y_train)

# 5. Evaluation
predictions = model.predict(X_test)
print(f"MAE: {mean_absolute_error(y_test, predictions):.2f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, predictions)):.2f}")
print(f"R2 Score: {r2_score(y_test, predictions):.2f}")
`;
  };

  const handleTrain = async () => {
    if (!targetCol || featureCols.length === 0) return;
    setIsTraining(true);
    setActiveTab('eval'); // jump to eval tab

    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // simulate delay

      // Try running in-browser models if supported
      if (['random_forest', 'mlr', 'knn'].includes(modelType)) {
        const X: number[][] = [];
        const y: number[] = [];
        const featureData: Record<string, number[]> = {};
        featureCols.forEach(f => featureData[f] = []);

        localData.forEach(row => {
          const targetVal = Number(row[targetCol]);
          if (isNaN(targetVal)) return;

          let isValidRow = true;
          const featureRow = featureCols.map(f => {
            const val = Number(row[f]);
            if (isNaN(val)) isValidRow = false;
            return val;
          });

          if (isValidRow) {
            X.push(featureRow);
            y.push(targetVal);
            featureCols.forEach((f, i) => featureData[f].push(featureRow[i]));
          }
        });

        if (X.length < 10) throw new Error('Not enough valid rows for JS execution.');

        const splitIdx = Math.floor(X.length * (splitRatio === "70/30" ? 0.7 : 0.8));
        const X_train = X.slice(0, splitIdx);
        const y_train = y.slice(0, splitIdx);
        const X_test = X.slice(splitIdx);
        const y_test = y.slice(splitIdx);

        let predictions: number[] = [];
        let modelName = "";

        if (modelType === 'random_forest') {
          modelName = "Random Forest Regression";
          const options = { seed: 42, maxFeatures: 1, replacement: true, nEstimators: Math.min(rfTrees, 20) }; // Cap for browser perf
          const regression = new RFRegression(options);
          regression.train(X_train, y_train);
          predictions = regression.predict(X_test);
        } else if (modelType === 'mlr') {
          modelName = "Linear Regression";
          const y_train_2d = y_train.map(v => [v]);
          const regression = new MLR(X_train, y_train_2d);
          const preds_2d = regression.predict(X_test);
          predictions = preds_2d.map((v: any) => v[0]);
        } else if (modelType === 'knn') {
          modelName = "K-Nearest Neighbors";
          const knn = new KNN(X_train, y_train, { k: 3 });
          predictions = knn.predict(X_test);
        }

        let mae = 0;
        let mse = 0;
        for (let i = 0; i < predictions.length; i++) {
          const diff = predictions[i] - y_test[i];
          mae += Math.abs(diff);
          mse += (diff * diff);
        }
        mae /= predictions.length;
        mse /= predictions.length;
        const rmse = Math.sqrt(mse);

        const meanY = y_test.reduce((a, b) => a + b, 0) / y_test.length;
        const ssTot = y_test.reduce((acc, val) => acc + Math.pow(val - meanY, 2), 0);
        const ssRes = predictions.reduce((acc, val, i) => acc + Math.pow(y_test[i] - val, 2), 0);
        const r2 = 1 - (ssRes / (ssTot === 0 ? 1 : ssTot));

        const importances = featureCols.map(f => {
          try {
            const corr = sampleCorrelation(featureData[f], y);
            return { feature: f, correlation: corr || 0 };
          } catch {
            return { feature: f, correlation: 0 };
          }
        }).sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));

        setCellResult(cellId, { 
          modelName,
          mae, 
          mse,
          rmse,
          r2, 
          samples: X.length, 
          features: featureCols.length,
          importances,
          code: generatePythonCode(),
          comparisons: [...(cell?.result?.comparisons || []), { name: modelName, r2, mae }]
        });
      } else {
        // Mock heavy models
        setCellResult(cellId, {
          modelName: modelType,
          mae: 0, mse: 0, rmse: 0, r2: 0, samples: localData.length, features: featureCols.length,
          importances: [],
          code: generatePythonCode(),
          isSimulated: true,
          comparisons: [...(cell?.result?.comparisons || []), { name: modelType + " (Backend)", r2: 0, mae: 0 }]
        });
        toast.info("Generated Python pipeline for heavy model. Export to run locally.");
      }
    } catch (err: any) {
      toast.error(err.message || 'Error training model.');
    } finally {
      setIsTraining(false);
    }
  };

  const handleExportNotebook = () => {
    const pyCode = generatePythonCode();
    // Wrap in minimal ipynb structure
    const notebook = {
      cells: [
        { cell_type: "markdown", metadata: {}, source: ["# DVAN.AI Hybrid ML Workspace Export\n"] },
        { cell_type: "code", execution_count: null, metadata: {}, outputs: [], source: pyCode.split('\n').map(l => l + '\n') }
      ],
      metadata: { kernelspec: { display_name: "Python 3", language: "python", name: "python3" } },
      nbformat: 4, nbformat_minor: 4
    };
    const blob = new Blob([JSON.stringify(notebook, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline_${modelType}.ipynb`;
    a.click();
  };

  return (
    <div className="flex flex-col bg-[#12484C] border border-[#2B7574]/30 rounded-lg overflow-hidden font-sans">
      <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-sm tracking-wide uppercase">Hybrid ML Workspace</h3>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full">
        <div className="bg-[#0E2931] border-b overflow-x-auto">
          <TabsList className="bg-transparent h-12 w-full justify-start space-x-2 px-2">
            <TabsTrigger value="data" className="data-[state=active]:bg-[#12484C] data-[state=active]:shadow-sm">Data Explorer</TabsTrigger>
            <TabsTrigger value="preprocess" className="data-[state=active]:bg-[#12484C] data-[state=active]:shadow-sm">Preprocessing</TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-[#12484C] data-[state=active]:shadow-sm">Feature Eng</TabsTrigger>
            <TabsTrigger value="train" className="data-[state=active]:bg-[#12484C] data-[state=active]:shadow-sm">Model Training</TabsTrigger>
            <TabsTrigger value="eval" className="data-[state=active]:bg-[#12484C] data-[state=active]:shadow-sm">Evaluation</TabsTrigger>
            <TabsTrigger value="compare" className="data-[state=active]:bg-[#12484C] data-[state=active]:shadow-sm">Comparison</TabsTrigger>
            <TabsTrigger value="explain" className="data-[state=active]:bg-[#12484C] data-[state=active]:shadow-sm">Explainability</TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-[#12484C] data-[state=active]:shadow-sm">Export Model</TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6 bg-[#0E2931]/50 min-h-[400px]">
          
          {/* Tab 1: Data */}
          <TabsContent value="data" className="m-0 space-y-6">
            <h4 className="text-lg font-semibold text-[#E2E2E0]">Dataset Understanding</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-[#12484C] p-4 rounded-lg shadow-sm border">
                 <p className="text-xs text-[#E2E2E0]/70 uppercase">Total Rows</p>
                 <p className="text-2xl font-bold">{summary.rowCount}</p>
               </div>
               <div className="bg-[#12484C] p-4 rounded-lg shadow-sm border">
                 <p className="text-xs text-[#E2E2E0]/70 uppercase">Total Columns</p>
                 <p className="text-2xl font-bold">{summary.columns.length}</p>
               </div>
            </div>
            <div className="bg-[#12484C] rounded-lg shadow-sm border p-4">
              <p className="text-sm font-semibold mb-2">Column Info</p>
              <div className="flex flex-wrap gap-2">
                {summary.columns.map(c => (
                  <span key={c.name} className="px-2 py-1 bg-[rgba(14,41,49,0.8)] text-xs rounded-md font-mono border">
                    {c.name} <span className="text-[#E2E2E0]/60">({c.type})</span>
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Preprocess */}
          <TabsContent value="preprocess" className="m-0 space-y-6">
             <h4 className="text-lg font-semibold text-[#E2E2E0]">Data Preprocessing</h4>
             <div className="bg-[#12484C] p-5 rounded-lg shadow-sm border space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Handle Missing Values</label>
                  <Select defaultValue="drop">
                    <SelectTrigger className="w-[300px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drop">Drop Rows with NaN</SelectItem>
                      <SelectItem value="mean">Impute Mean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Train/Test Split</label>
                  <Select value={splitRatio} onValueChange={setSplitRatio}>
                    <SelectTrigger className="w-[300px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="80/20">80% Train / 20% Test</SelectItem>
                      <SelectItem value="70/30">70% Train / 30% Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
             </div>
             
             {/* Notebook code block preview */}
             <div className="rounded-lg overflow-hidden border border-[#2B7574]/40">
               <div className="bg-[rgba(14,41,49,0.9)] px-4 py-1 text-xs font-mono text-[#E2E2E0]/80 flex justify-between">
                 <span>In [1]: Preprocessing</span>
               </div>
               <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 text-sm font-mono overflow-x-auto">
{`# Handle missing values
df = df.dropna()

# Split dataset
test_size = ${splitRatio === '70/30' ? '0.3' : '0.2'}
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size)`}
               </pre>
             </div>
          </TabsContent>

          {/* Tab 3: Feature Eng */}
          <TabsContent value="features" className="m-0 space-y-6">
             <h4 className="text-lg font-semibold text-[#E2E2E0]">Feature Engineering</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-[#12484C] p-5 rounded-lg shadow-sm border space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-emerald-700 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2"/> Target Variable (Y)</label>
                   <Select value={targetCol} onValueChange={setTargetCol}>
                     <SelectTrigger><SelectValue placeholder="Select Target..." /></SelectTrigger>
                     <SelectContent>
                       {numericCols.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               
               <div className="bg-[#12484C] p-5 rounded-lg shadow-sm border space-y-2">
                 <label className="text-sm font-medium text-indigo-700 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2"/> Input Features (X)</label>
                 <div className="max-h-48 overflow-y-auto space-y-2 mt-2">
                   {numericCols.filter(c => c !== targetCol).map(c => (
                     <div key={c} className="flex items-center space-x-2 p-1 hover:bg-[#0E2931] rounded">
                        <input type="checkbox" id={`feat-${c}`} checked={featureCols.includes(c)} onChange={() => toggleFeature(c)} className="rounded text-indigo-600" />
                        <label htmlFor={`feat-${c}`} className="text-sm cursor-pointer select-none flex-1">{c}</label>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </TabsContent>

          {/* Tab 4: Train */}
          <TabsContent value="train" className="m-0 space-y-6">
             <h4 className="text-lg font-semibold text-[#E2E2E0]">Model Training</h4>
             
             <div className="bg-[#12484C] p-5 rounded-lg shadow-sm border space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Algorithm</label>
                  <Select value={modelType} onValueChange={setModelType}>
                    <SelectTrigger className="w-[300px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random_forest">Random Forest Regression</SelectItem>
                      <SelectItem value="mlr">Linear Regression</SelectItem>
                      <SelectItem value="knn">KNN Regression</SelectItem>
                      <SelectItem value="xgboost">XGBoost Regression (Export Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {modelType === 'random_forest' && (
                  <div className="space-y-4 p-4 bg-[#0E2931] rounded-md border">
                    <p className="text-xs font-bold text-[#E2E2E0]/70 uppercase">Hyperparameters</p>
                    <div className="space-y-2">
                      <label className="text-sm">Number of Trees (n_estimators)</label>
                      <Input type="number" value={rfTrees} onChange={e => setRfTrees(Number(e.target.value))} className="w-[150px]" />
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <Button onClick={handleTrain} disabled={isTraining || !targetCol} className="w-[200px] bg-indigo-600 hover:bg-indigo-700">
                    <Play className="w-4 h-4 mr-2" />
                    {isTraining ? 'Training...' : 'Fit Model'}
                  </Button>
                </div>
             </div>
          </TabsContent>

          {/* Tab 5: Eval */}
          <TabsContent value="eval" className="m-0 space-y-6">
             <h4 className="text-lg font-semibold text-[#E2E2E0]">Train/Test Evaluation</h4>
             
             {!cell?.result ? (
               <div className="text-center py-12 text-[#E2E2E0]/60 border rounded-lg border-dashed">Run a model to view evaluation.</div>
             ) : cell.result.isSimulated ? (
               <div className="text-center py-12 text-[#E2E2E0]/60 border rounded-lg border-dashed">This model requires Python backend. Export the notebook to run it.</div>
             ) : (
               <div className="space-y-6">
                 {/* Cell 1 */}
                 <div className="rounded-lg overflow-hidden border border-[#2B7574]/40">
                   <div className="bg-[rgba(14,41,49,0.9)] px-4 py-1 text-xs font-mono text-[#E2E2E0]/80">In [2]: Fit Model</div>
                   <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 text-sm font-mono overflow-x-auto">
                     {`model.fit(X_train, y_train)`}
                   </pre>
                   <div className="bg-[#12484C] border-t p-4 text-sm font-mono flex items-center text-[#E2E2E0]/80">
                     <span className="text-green-600 mr-2">Out[2]:</span> Training completed successfully for {cell.result.modelName}.
                   </div>
                 </div>

                 {/* Cell 2 */}
                 <div className="rounded-lg overflow-hidden border border-[#2B7574]/40">
                   <div className="bg-[rgba(14,41,49,0.9)] px-4 py-1 text-xs font-mono text-[#E2E2E0]/80">In [3]: Evaluation Results</div>
                   <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 text-sm font-mono overflow-x-auto">
                     {`print("RMSE:", rmse)\nprint("R² Score:", r2)`}
                   </pre>
                   <div className="bg-[#12484C] border-t p-4 font-mono text-[#E2E2E0] grid grid-cols-2 gap-4">
                      <div><span className="text-[#E2E2E0]/60 block text-xs mb-1">R² Score</span> <span className="text-xl">{(cell.result.r2 * 100).toFixed(2)}%</span></div>
                      <div><span className="text-[#E2E2E0]/60 block text-xs mb-1">RMSE</span> <span className="text-xl">{cell.result.rmse?.toFixed(4)}</span></div>
                      <div><span className="text-[#E2E2E0]/60 block text-xs mb-1">MAE</span> <span className="text-xl">{cell.result.mae?.toFixed(4)}</span></div>
                   </div>
                 </div>
               </div>
             )}
          </TabsContent>
          
          {/* Tab 6: Comparison */}
          <TabsContent value="compare" className="m-0 space-y-6">
             <h4 className="text-lg font-semibold text-[#E2E2E0]">Model Comparison</h4>
             {cell?.result?.comparisons && cell.result.comparisons.length > 0 ? (
                <div className="bg-[#12484C] border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#0E2931] text-[#E2E2E0]/80 border-b">
                      <tr>
                        <th className="px-4 py-3">Model</th>
                        <th className="px-4 py-3">R² Score (Accuracy)</th>
                        <th className="px-4 py-3">MAE (Error)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cell.result.comparisons.map((c: any, i: number) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-[#0E2931]">
                          <td className="px-4 py-3 font-medium">{c.name}</td>
                          <td className="px-4 py-3 text-emerald-600 font-mono">{(c.r2 * 100).toFixed(2)}%</td>
                          <td className="px-4 py-3 text-rose-600 font-mono">{c.mae.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             ) : (
                <div className="text-[#E2E2E0]/70 border rounded-lg border-dashed text-center py-12">Train models to compare them here.</div>
             )}
          </TabsContent>

          {/* Tab 7: Explainability */}
          <TabsContent value="explain" className="m-0 space-y-6">
             <h4 className="text-lg font-semibold text-[#E2E2E0]">Model Explainability</h4>
             {cell?.result?.importances ? (
                <div className="bg-[#12484C] border rounded-lg p-5">
                   <p className="text-sm font-semibold mb-4">Top Feature Influencers</p>
                   <div className="space-y-3">
                     {cell.result.importances.slice(0, 5).map((imp: any, i: number) => (
                       <div key={imp.feature} className="flex items-center">
                         <span className="w-32 text-sm text-[#E2E2E0]/80 truncate">{imp.feature}</span>
                         <div className="flex-1 bg-[rgba(14,41,49,0.8)] h-2 rounded-full overflow-hidden mx-4">
                           <div className={`h-full ${imp.correlation > 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} style={{ width: `${Math.abs(imp.correlation) * 100}%` }}></div>
                         </div>
                         <span className="text-xs font-mono w-12 text-right">{(Math.abs(imp.correlation) * 100).toFixed(0)}%</span>
                       </div>
                     ))}
                   </div>
                </div>
             ) : <div className="text-[#E2E2E0]/70 border rounded-lg border-dashed text-center py-12">Train a supported model to see feature impact.</div>}
          </TabsContent>

          {/* Tab 8: Export */}
          <TabsContent value="export" className="m-0 space-y-6">
             <h4 className="text-lg font-semibold text-[#E2E2E0]">Save & Export Model</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#12484C] border rounded-lg p-6 text-center space-y-4 hover:border-indigo-300 transition-colors">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                    <FileJson className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#E2E2E0]">Jupyter Notebook</h5>
                    <p className="text-xs text-[#E2E2E0]/70 mt-1">Export a fully functional .ipynb notebook with your exact configurations and code.</p>
                  </div>
                  <Button onClick={handleExportNotebook} variant="outline" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                    <Download className="w-4 h-4 mr-2" /> Download .ipynb
                  </Button>
                </div>

                <div className="bg-[#12484C] border rounded-lg p-6 text-center space-y-4 hover:border-[#2B7574]/40 transition-colors opacity-70 cursor-not-allowed">
                  <div className="w-12 h-12 bg-[rgba(14,41,49,0.8)] text-[#E2E2E0]/80 rounded-full flex items-center justify-center mx-auto">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#E2E2E0]">Export Python Pipeline</h5>
                    <p className="text-xs text-[#E2E2E0]/70 mt-1">Download pipeline.py file for production deployment.</p>
                  </div>
                  <Button disabled variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" /> Download .py
                  </Button>
                </div>
             </div>
             
             {cell?.result?.code && (
               <div className="mt-8">
                 <p className="text-sm font-semibold mb-2">Generated Code Preview</p>
                 <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 text-xs font-mono rounded-lg overflow-x-auto max-h-64">
                   {cell.result.code}
                 </pre>
               </div>
             )}
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
};
