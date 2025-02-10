
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, PieChart, Pie, Cell, Legend
} from 'recharts';
import { ChartData, PieSegment } from './types';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

interface ChartVisualizationProps {
  type: string;
  data: ChartData[];
  pieData: PieSegment[];
  variableX: string;
  variableY: string;
}

export const ChartVisualization = ({
  type,
  data,
  pieData,
  variableX,
  variableY
}: ChartVisualizationProps) => {
  switch (type) {
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
            <Scatter name={`${variableX} vs ${variableY}`} data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
              label={({ name, value, percent }) => 
                `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => {
                const percent = props.payload.percent;
                return [`${value} (${(percent * 100).toFixed(1)}%)`, name];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
};
