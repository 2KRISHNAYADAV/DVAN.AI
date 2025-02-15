
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from 'lucide-react';
import { Card as SubCard } from '@/components/ui/card';

interface PredictivePanelProps {
  data: any[];
  columns: string[];
}

interface ModelMetrics {
  rmse: number;
  mae: number;
  r2: number;
}

interface PredictionResult {
  predictions: any[];
  metrics: ModelMetrics;
}

export const PredictivePanel = ({ data, columns }: PredictivePanelProps) => {
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [predictorColumns, setPredictorColumns] = useState<string[]>([]);
  const [predictionPeriods, setPredictionPeriods] = useState<string>('5');
  const [modelType, setModelType] = useState<string>('linear');
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [combinedData, setCombinedData] = useState<any[]>([]);

  const numericColumns = columns.filter(column => {
    const sample = data[0][column];
    return !isNaN(parseFloat(sample));
  });

  // Simple moving average calculation
  const calculateMovingAverage = (data: any[], column: string, window: number) => {
    return data.map((row, index) => {
      if (index < window - 1) return { ...row, ma: null };
      
      const sum = data
        .slice(index - window + 1, index + 1)
        .reduce((acc, curr) => acc + parseFloat(curr[column]), 0);
      
      return {
        ...row,
        ma: sum / window,
      };
    });
  };

  // Linear regression prediction
  const calculateLinearPrediction = (data: any[], target: string, periods: number): PredictionResult => {
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = data.map(d => parseFloat(d[target]));

    // Calculate coefficients
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate predictions
    const predictions = [...Array(periods)].map((_, i) => {
      const predictedValue = slope * (n + i) + intercept;
      return {
        period: `Period ${n + i + 1}`,
        [target]: data[n - 1][target],
        prediction: predictedValue,
        ci_lower: predictedValue - 1.96 * Math.sqrt(Math.abs(predictedValue)),
        ci_upper: predictedValue + 1.96 * Math.sqrt(Math.abs(predictedValue))
      };
    });

    // Calculate metrics
    const trainPredictions = x.map(xi => slope * xi + intercept);
    const rmse = Math.sqrt(trainPredictions.reduce((acc, pred, i) => acc + Math.pow(pred - y[i], 2), 0) / n);
    const mae = trainPredictions.reduce((acc, pred, i) => acc + Math.abs(pred - y[i]), 0) / n;
    const yMean = sumY / n;
    const r2 = 1 - (trainPredictions.reduce((acc, pred, i) => acc + Math.pow(pred - y[i], 2), 0) / 
                    y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0));

    return {
      predictions,
      metrics: { rmse, mae, r2 }
    };
  };

  // Effect to update predictions and metrics when inputs change
  useEffect(() => {
    if (!targetColumn) {
      setCombinedData([]);
      setMetrics(null);
      return;
    }

    const maData = calculateMovingAverage(data.slice(0, 100), targetColumn, 5);
    const { predictions, metrics: newMetrics } = calculateLinearPrediction(
      data,
      targetColumn,
      parseInt(predictionPeriods)
    );

    setCombinedData([...maData, ...predictions]);
    setMetrics(newMetrics);
  }, [targetColumn, predictionPeriods, data]);

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Trend Prediction</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Select variables and parameters for trend prediction. The model uses historical data to forecast future trends with confidence intervals.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Target Variable</label>
              <Select value={targetColumn} onValueChange={setTargetColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map(column => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Prediction Periods</label>
              <Select value={predictionPeriods} onValueChange={setPredictionPeriods}>
                <SelectTrigger>
                  <SelectValue placeholder="Select periods" />
                </SelectTrigger>
                <SelectContent>
                  {['5', '6', '7', '8', '9', '10'].map(period => (
                    <SelectItem key={period} value={period}>
                      {period} periods
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Model Type</label>
              <Select value={modelType} onValueChange={setModelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear Regression</SelectItem>
                  <SelectItem value="ma">Moving Average</SelectItem>
                  <SelectItem value="arima">ARIMA (Coming soon)</SelectItem>
                  <SelectItem value="lstm">LSTM (Coming soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SubCard>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">RMSE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-purple-600">
                    {metrics.rmse.toFixed(4)}
                  </p>
                </CardContent>
              </SubCard>
              <SubCard>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">MAE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-purple-600">
                    {metrics.mae.toFixed(4)}
                  </p>
                </CardContent>
              </SubCard>
              <SubCard>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">R²</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-purple-600">
                    {metrics.r2.toFixed(4)}
                  </p>
                </CardContent>
              </SubCard>
            </div>
          )}

          <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={combinedData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={columns[0]}
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{
                    paddingTop: '10px',
                  }}
                />
                {targetColumn && (
                  <>
                    <Line
                      type="monotone"
                      dataKey={targetColumn}
                      stroke="#8B5CF6"
                      dot={false}
                      name="Actual"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="ma"
                      stroke="#D946EF"
                      dot={false}
                      name="Moving Average (5 periods)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="prediction"
                      stroke="#F97316"
                      dot={true}
                      name="Prediction"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Line
                      type="monotone"
                      dataKey="ci_upper"
                      stroke="#9CA3AF"
                      dot={false}
                      name="Confidence Interval"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    <Line
                      type="monotone"
                      dataKey="ci_lower"
                      stroke="#9CA3AF"
                      dot={false}
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
