import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, BarChart, Bar, Legend, ComposedChart, Area,
} from 'recharts';

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
    return typeof sample === 'number' || !isNaN(parseFloat(sample));
  });

  // Prepare data for visualization with safety checks
  const prepareData = () => {
    if (!data || !variableX || !variableY) return [];
    
    return data.slice(0, 100).map(row => ({
      x: parseFloat(row[variableX]) || 0,
      y: parseFloat(row[variableY]) || 0,
      name: `${row[variableX]}-${row[variableY]}`
    })).filter(item => !isNaN(item.x) && !isNaN(item.y));
  };

  // Calculate histogram data
  const calculateHistogram = (values: number[], bins = 10) => {
    if (!values?.length) return [];
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const histogram = Array(bins).fill(0);
    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      histogram[binIndex]++;
    });

    return histogram.map((count, i) => ({
      bin: `${(min + i * binWidth).toFixed(1)}-${(min + (i + 1) * binWidth).toFixed(1)}`,
      count,
      binStart: min + i * binWidth,
      binEnd: min + (i + 1) * binWidth
    }));
  };

  // Calculate statistics with safety checks
  const calculateStats = (variable: string) => {
    if (!variable || !data?.length) {
      return { min: 0, max: 0, mean: 0, median: 0, q1: 0, q3: 0, outliers: 0 };
    }

    const values = data
      .map(row => parseFloat(row[variable]))
      .filter(val => !isNaN(val));

    if (!values.length) {
      return { min: 0, max: 0, mean: 0, median: 0, q1: 0, q3: 0, outliers: 0 };
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
      q1,
      q3,
      outliers: outliers.length
    };
  };

  const visualizationData = prepareData();
  const statsX = calculateStats(variableX);
  const statsY = calculateStats(variableY);

  // Format number with safety check
  const formatNumber = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return '0.00';
    return value.toFixed(2);
  };

  // Prepare box plot data
  const prepareBoxPlotData = (stats: ReturnType<typeof calculateStats>) => {
    return [{
      min: stats.min,
      q1: stats.q1,
      median: stats.median,
      q3: stats.q3,
      max: stats.max,
      name: 'Box Plot'
    }];
  };

  if (!data?.length || !columns?.length) {
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

  const boxPlotData = prepareBoxPlotData(statsY);

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
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
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
                  <Scatter 
                    name={`${variableX} vs ${variableY}`} 
                    data={visualizationData} 
                    fill="#8B5CF6" 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Box Plot */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution Analysis (Box Plot)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={boxPlotData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    dataKey="q1"
                    stackId="1"
                    fill="#8B5CF6"
                    stroke="none"
                  />
                  <Area
                    dataKey="q3"
                    stackId="1"
                    fill="#8B5CF6"
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="median"
                    stroke="#4C1D95"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="min"
                    stroke="#8B5CF6"
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="max"
                    stroke="#8B5CF6"
                    strokeWidth={1}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Histogram */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Frequency Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={calculateHistogram(visualizationData.map(d => d.y))}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bin" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" name="Frequency" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};