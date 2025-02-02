import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, BarChart, Bar, Legend, ComposedChart, Area,
  PieChart, Pie, Cell
} from 'recharts';

interface DetailedStatsProps {
  data: any[];
  columns: string[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

export const DetailedStats = ({ data, columns }: DetailedStatsProps) => {
  const [variableX, setVariableX] = useState(columns[0] || '');
  const [variableY, setVariableY] = useState(columns[1] || '');
  const [comparisonType, setComparisonType] = useState('scatter');

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

  // Calculate percentage distribution for pie chart
  const calculatePercentageDistribution = () => {
    if (!data || !variableX) return [];
    
    const values = data.map(row => parseFloat(row[variableX])).filter(val => !isNaN(val));
    const total = values.reduce((acc, val) => acc + val, 0);
    
    // Create 5 segments based on value ranges
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const segmentSize = range / 5;
    
    const segments = Array(5).fill(0);
    values.forEach(value => {
      const segmentIndex = Math.min(Math.floor((value - min) / segmentSize), 4);
      segments[segmentIndex]++;
    });
    
    return segments.map((count, index) => ({
      name: `${(min + index * segmentSize).toFixed(1)}-${(min + (index + 1) * segmentSize).toFixed(1)}`,
      value: count,
      percentage: ((count / values.length) * 100).toFixed(1)
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
  const pieData = calculatePercentageDistribution();
  const statsX = calculateStats(variableX);
  const statsY = calculateStats(variableY);

  // Format number with safety check
  const formatNumber = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return '0.00';
    return value.toFixed(2);
  };

  const renderVisualization = () => {
    switch (comparisonType) {
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
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
              <Scatter name={`${variableX} vs ${variableY}`} data={visualizationData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visualizationData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" label={{ value: variableX, position: 'bottom' }} />
              <YAxis label={{ value: variableY, angle: -90, position: 'left' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y" stroke="#8884d8" name={variableY} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} (${pieData[pieData.findIndex(item => item.name === name)]?.percentage}%)`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

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
            <Select value={comparisonType} onValueChange={setComparisonType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select visualization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scatter">Scatter Plot</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderVisualization()}
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
      </CardContent>
    </Card>
  );
};
