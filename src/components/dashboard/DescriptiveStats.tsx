import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DescriptiveStatsProps {
  data: any[];
  columns: string[];
}

const COLORS = ['#8B5CF6', '#D946EF', '#6E59A5', '#9b87f5', '#D6BCFA'];

export const DescriptiveStats = ({ data, columns }: DescriptiveStatsProps) => {
  const numericColumns = columns.filter(column => {
    const sample = data[0][column];
    return !isNaN(parseFloat(sample));
  });

  const calculateStats = (column: string) => {
    const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    
    return { mean, median };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {numericColumns.map(column => (
        <Card key={column}>
          <CardHeader>
            <CardTitle>{column} Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#E2E2E0]/70">Mean</p>
                <p className="text-lg font-semibold">
                  {calculateStats(column).mean.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#E2E2E0]/70">Median</p>
                <p className="text-lg font-semibold">
                  {calculateStats(column).median.toFixed(2)}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.slice(0, 50)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={column} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={column} fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};