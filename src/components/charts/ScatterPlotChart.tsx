import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ScatterPlotProps {
  data: any[];
  xAxisKey: string;
  yAxisKey: string;
  title: string;
}

const ScatterPlotChart = ({ data, xAxisKey, yAxisKey, title }: ScatterPlotProps) => {
  return (
    <div className="min-h-[400px]">
      <h4 className="text-lg font-medium mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            name={xAxisKey}
            type="number"
            label={{
              value: xAxisKey,
              position: 'insideBottom',
              offset: -10,
              style: { textAnchor: 'middle' }
            }}
          />
          <YAxis
            dataKey="y"
            name={yAxisKey}
            type="number"
            label={{
              value: yAxisKey,
              angle: -90,
              position: 'insideLeft',
              offset: 0,
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="text-sm font-medium">{payload[0].payload.name}</p>
                    <p className="text-sm">{`${xAxisKey}: ${payload[0].value}`}</p>
                    <p className="text-sm">{`${yAxisKey}: ${payload[1].value}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Scatter
            name={`${xAxisKey} vs ${yAxisKey}`}
            data={data}
            fill="#8B5CF6"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlotChart;