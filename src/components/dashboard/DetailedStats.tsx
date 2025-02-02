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
  const [variableX, setVariableX] = useState(columns[0] || '');
  const [variableY, setVariableY] = useState(columns[1] || '');

  // Filter numeric columns
  const numericColumns = columns.filter(column => {
    const sample = data[0]?.[column];
    return !isNaN(parseFloat(sample));
  });

  // Prepare data for visualization
  const prepareData = () => {
    return data.slice(0, 100).map(row => ({
      x: parseFloat(row[variableX]),
      y: parseFloat(row[variableY]),
    })).filter(item => !isNaN(item.x) && !isNaN(item.y));
  };

  // Calculate basic statistics with safety checks
  const calculateStats = (variable: string) => {
    if (!variable || !data.length) {
      return {
        min: 0,
        max: 0,
        mean: 0,
        median: 0,
        outliers: 0
      };
    }

    const values = data
      .map(row => parseFloat(row[variable]))
      .filter(val => !isNaN(val));

    if (!values.length) {
      return {
        min: 0,
        max: 0,
        mean: 0,
        median: 0,
        outliers: 0
      };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)] || 0;
    const q3 = sorted[Math.floor(sorted.length * 0.75)] || 0;
    const iqr = q3 - q1;
    const outliers = values.filter(v => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)] || 0,
      outliers: outliers.length,
    };
  };

  const visualizationData = prepareData();
  const statsX = calculateStats(variableX);
  const statsY = calculateStats(variableY);

  // Format number with safety check
  const formatNumber = (value: number) => {
    return typeof value === 'number' ? value.toFixed(2) : '0.00';
  };

  if (!data.length || !columns.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No data available for analysis</p>
        </CardContent>
      </Card>
    );
  }

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
              <p>Mean: {formatNumber(statsX.mean)}</p>
              <p>Median: {formatNumber(statsX.median)}</p>
              <p>Range: {formatNumber(statsX.min)} - {formatNumber(statsX.max)}</p>
              <p>Outliers: {statsX.outliers}</p>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold mb-2">{variableY} Statistics</h3>
            <div className="space-y-1 text-sm">
              <p>Mean: {formatNumber(statsY.mean)}</p>
              <p>Median: {formatNumber(statsY.median)}</p>
              <p>Range: {formatNumber(statsY.min)} - {formatNumber(statsY.max)}</p>
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