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
  Legend,
} from 'recharts';

interface PredictivePanelProps {
  data: any[];
  columns: string[];
}

export const PredictivePanel = ({ data, columns }: PredictivePanelProps) => {
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

  const maData = calculateMovingAverage(data.slice(0, 100), numericColumns[0], 5);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Trend Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={maData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={columns[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={numericColumns[0]}
                stroke="#8B5CF6"
                dot={false}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="ma"
                stroke="#D946EF"
                dot={false}
                name="Moving Average (5 periods)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};