import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, BarChart, Bar, Legend,
} from 'recharts';
import { Info } from 'lucide-react';

interface DetailedStatsProps {
  data: any[];
  columns: string[];
}

export const DetailedStats = ({ data, columns }: DetailedStatsProps) => {
  const [variableX, setVariableX] = useState(columns[0]);
  const [variableY, setVariableY] = useState(columns[1]);

  // Filter numeric columns
  const numericColumns = columns.filter(column => {
    const sample = data[0][column];
    return !isNaN(parseFloat(sample));
  });

  // Prepare data for visualization
  const prepareData = () => {
    return data.slice(0, 100).map(row => ({
      x: parseFloat(row[variableX]),
      y: parseFloat(row[variableY]),
    })).filter(item => !isNaN(item.x) && !isNaN(item.y));
  };

  // Calculate basic statistics
  const calculateStats = (variable: string) => {
    const values = data.map(row => parseFloat(row[variable])).filter(val => !isNaN(val));
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const outliers = values.filter(v => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      outliers: outliers.length,
    };
  };

  const visualizationData = prepareData();
  const statsX = calculateStats(variableX);
  const statsY = calculateStats(variableY);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Detailed Statistics</CardTitle>
          <div className="flex gap-4">
            <Select value={variableX} onValueChange={setVariableX}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select X variable" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map(column => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={variableY} onValueChange={setVariableY}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Y variable" />
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
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold mb-2">{variableX} Statistics</h3>
            <div className="space-y-1 text-sm">
              <p>Mean: {statsX.mean.toFixed(2)}</p>
              <p>Median: {statsX.median.toFixed(2)}</p>
              <p>Range: {statsX.min.toFixed(2)} - {statsX.max.toFixed(2)}</p>
              <p>Outliers: {statsX.outliers}</p>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold mb-2">{variableY} Statistics</h3>
            <div className="space-y-1 text-sm">
              <p>Mean: {statsY.mean.toFixed(2)}</p>
              <p>Median: {statsY.median.toFixed(2)}</p>
              <p>Range: {statsY.min.toFixed(2)} - {statsY.max.toFixed(2)}</p>
              <p>Outliers: {statsY.outliers}</p>
            </div>
          </div>
        </div>

        {/* Scatter Plot */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Correlation Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name={variableX}
                    label={{ value: variableX, position: 'bottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name={variableY}
                    label={{ value: variableY, angle: -90, position: 'left' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name={`${variableX} vs ${variableY}`} data={visualizationData} fill="#8B5CF6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={visualizationData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name={variableX} />
                  <YAxis dataKey="y" name={variableY} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="y" stroke="#8B5CF6" name={variableY} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};