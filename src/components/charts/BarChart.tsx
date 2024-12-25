import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface BarChartProps {
  data: any[];
  dataKey: string;
  title: string;
}

const BarChart = ({ data, dataKey, title }: BarChartProps) => {
  return (
    <div className="min-h-[400px]">
      <h4 className="text-lg font-medium mb-4">Distribution</h4>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: dataKey,
              angle: -90,
              position: 'insideLeft',
              offset: 0,
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip />
          <Legend />
          <Bar name={dataKey} dataKey={dataKey} fill="#8B5CF6" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;