
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, PieChart, Pie, Cell, Legend, BarChart, Bar,
  AreaChart, Area, ComposedChart
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
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" label={{ value: variableX, position: 'bottom' }} />
            <YAxis label={{ value: variableY, angle: -90, position: 'left' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="y" fill="#8884d8" name={variableY} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'area':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" label={{ value: variableX, position: 'bottom' }} />
            <YAxis label={{ value: variableY, angle: -90, position: 'left' }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="y" fill="#8884d8" stroke="#8884d8" name={variableY} />
          </AreaChart>
        </ResponsiveContainer>
      );
    case 'histogram':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pieData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: variableX, position: 'bottom' }} />
            <YAxis label={{ value: 'Frequency', angle: -90, position: 'left' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="Frequency" />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'box':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={[{
            min: data[0]?.x || 0,
            q1: data[0]?.x || 0,
            median: data[0]?.y || 0,
            q3: data[0]?.y || 0,
            max: data[0]?.y || 0,
          }]} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: variableX, position: 'bottom' }} />
            <YAxis label={{ value: variableY, angle: -90, position: 'left' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="median" fill="#8884d8" />
            <Line type="monotone" dataKey="q1" stroke="#82ca9d" />
            <Line type="monotone" dataKey="q3" stroke="#ffc658" />
          </ComposedChart>
        </ResponsiveContainer>
      );
    case 'bubble':
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
            <Scatter
              name={`${variableX} vs ${variableY}`}
              data={data}
              fill="#8884d8"
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

