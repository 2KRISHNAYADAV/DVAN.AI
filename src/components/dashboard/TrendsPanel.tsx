import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';

interface TrendsPanelProps {
  data: any[];
  columns: string[];
}

export const TrendsPanel = ({ data, columns }: TrendsPanelProps) => {
  const numericColumns = columns.filter(column => {
    const sample = data[0][column];
    return !isNaN(parseFloat(sample));
  });

  const getPairwiseData = (col1: string, col2: string) => {
    return data
      .slice(0, 100)
      .map(row => ({
        x: parseFloat(row[col1]),
        y: parseFloat(row[col2])
      }))
      .filter(point => !isNaN(point.x) && !isNaN(point.y));
  };

  return (
    <div className="space-y-4">
      {/* Time Series Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Time Series Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.slice(0, 100)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={columns[0]} />
              <YAxis />
              <Tooltip />
              {numericColumns.slice(0, 3).map((column, index) => (
                <Line
                  key={column}
                  type="monotone"
                  dataKey={column}
                  stroke={`hsl(${index * 120}, 70%, 50%)`}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Correlation Scatter Plot */}
      {numericColumns.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Correlation Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  name={numericColumns[0]}
                  type="number"
                  label={{ value: numericColumns[0], position: 'bottom' }}
                />
                <YAxis
                  dataKey="y"
                  name={numericColumns[1]}
                  type="number"
                  label={{ value: numericColumns[1], angle: -90, position: 'left' }}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  name={`${numericColumns[0]} vs ${numericColumns[1]}`}
                  data={getPairwiseData(numericColumns[0], numericColumns[1])}
                  fill="#8B5CF6"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};