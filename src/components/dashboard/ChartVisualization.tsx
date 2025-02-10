
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, PieChart, Pie, Cell, Legend, BarChart, Bar,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { ChartData, PieSegment } from './types';

// Enhanced color palette
const COLORS = [
  '#8B5CF6', // Vivid Purple
  '#D946EF', // Magenta Pink
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#9b87f5', // Primary Purple
  '#7E69AB', // Secondary Purple
  '#6E59A5', // Tertiary Purple
  '#1A1F2C'  // Dark Purple
];

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
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name={variableX}
              label={{ value: variableX, position: 'bottom' }}
              stroke="#6E59A5"
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={variableY}
              label={{ value: variableY, angle: -90, position: 'left' }}
              stroke="#6E59A5"
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter 
              name={`${variableX} vs ${variableY}`} 
              data={data} 
              fill="#8B5CF6"
            />
          </ScatterChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
            <XAxis 
              dataKey="x" 
              label={{ value: variableX, position: 'bottom' }}
              stroke="#6E59A5"
            />
            <YAxis 
              label={{ value: variableY, angle: -90, position: 'left' }}
              stroke="#6E59A5"
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#D946EF" 
              strokeWidth={2}
              name={variableY} 
              dot={{ fill: '#D946EF' }}
            />
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
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
            <XAxis 
              dataKey="x" 
              label={{ value: variableX, position: 'bottom' }}
              stroke="#6E59A5"
            />
            <YAxis 
              label={{ value: variableY, angle: -90, position: 'left' }}
              stroke="#6E59A5"
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="y" name={variableY}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    case 'area':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
            <XAxis 
              dataKey="x" 
              label={{ value: variableX, position: 'bottom' }}
              stroke="#6E59A5"
            />
            <YAxis 
              label={{ value: variableY, angle: -90, position: 'left' }}
              stroke="#6E59A5"
            />
            <Tooltip />
            <Legend />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="y" 
              stroke="#8B5CF6" 
              fill="url(#colorGradient)" 
              name={variableY}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    case 'histogram':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pieData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
            <XAxis 
              dataKey="name" 
              label={{ value: variableX, position: 'bottom' }}
              stroke="#6E59A5"
            />
            <YAxis 
              label={{ value: 'Frequency', angle: -90, position: 'left' }}
              stroke="#6E59A5"
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Frequency">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    case 'box':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart 
            data={[{
              min: data[0]?.x || 0,
              q1: data[0]?.x || 0,
              median: data[0]?.y || 0,
              q3: data[0]?.y || 0,
              max: data[0]?.y || 0,
            }]} 
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
            <XAxis 
              dataKey="name" 
              label={{ value: variableX, position: 'bottom' }}
              stroke="#6E59A5"
            />
            <YAxis 
              label={{ value: variableY, angle: -90, position: 'left' }}
              stroke="#6E59A5"
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="median" fill="#8B5CF6" />
            <Line type="monotone" dataKey="q1" stroke="#D946EF" strokeWidth={2} />
            <Line type="monotone" dataKey="q3" stroke="#F97316" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      );
    case 'bubble':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name={variableX}
              label={{ value: variableX, position: 'bottom' }}
              stroke="#6E59A5"
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={variableY}
              label={{ value: variableY, angle: -90, position: 'left' }}
              stroke="#6E59A5"
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter
              name={`${variableX} vs ${variableY}`}
              data={data}
              fill="#8B5CF6"
              shape="circle"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  radius={Math.abs(entry.y - entry.x) * 2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
};

