import React, { useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, PieChart, Pie, Cell, Legend, BarChart, Bar,
  AreaChart, Area, ComposedChart
} from 'recharts';
import Plotly from 'plotly.js-dist-min';
import { ChartVisualizationProps, ChartData, PieSegment } from './types';

const COLORS = [
  '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#9b87f5', 
  '#7E69AB', '#6E59A5', '#1A1F2C'
];

export const ChartVisualization: React.FC<ChartVisualizationProps> = ({
  type,
  data,
  pieData,
  variableX,
  variableY,
  variableZ,
  isMobile
}) => {
  const plotlyContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotlyContainer.current) return;

    const baseConfig = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
      toImageButtonOptions: {
        format: 'png',
        filename: `${type}_plot`,
        height: isMobile ? 400 : 500,
        width: isMobile ? 300 : 700,
        scale: 2
      }
    };

    if (type === '3d-scatter') {
      const trace = {
        type: 'scatter3d',
        mode: 'markers',
        x: data.map(d => d.x),
        y: data.map(d => d.y),
        z: data.map(d => d.z),
        text: data.map(d => d.name),
        hovertemplate: 
          `<b>${variableX}</b>: %{x:.2f}<br>` +
          `<b>${variableY}</b>: %{y:.2f}<br>` +
          `<b>${variableZ}</b>: %{z:.2f}<br>` +
          `<extra>Point %{text}</extra>`,
        marker: {
          size: 6,
          color: data.map(d => d.z),
          colorscale: 'Viridis',
          opacity: 0.8,
          showscale: true,
          colorbar: {
            title: {
              text: variableZ,
              font: { size: isMobile ? 10 : 12 }
            },
            thickness: 20,
            len: 0.5
          }
        }
      };

      const layout = {
        title: {
          text: `3D Visualization of ${variableX}, ${variableY}, and ${variableZ}`,
          font: { family: 'Arial, sans-serif', size: isMobile ? 14 : 16 }
        },
        scene: {
          xaxis: { 
            title: { text: variableX, font: { size: isMobile ? 10 : 12 } },
            gridcolor: '#E5DEFF'
          },
          yaxis: { 
            title: { text: variableY, font: { size: isMobile ? 10 : 12 } },
            gridcolor: '#E5DEFF'
          },
          zaxis: { 
            title: { text: variableZ, font: { size: isMobile ? 10 : 12 } },
            gridcolor: '#E5DEFF'
          },
          camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } }
        },
        margin: isMobile ? { l: 0, r: 0, b: 0, t: 40 } : { l: 0, r: 0, b: 0, t: 40 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        autosize: true,
        showlegend: false,
        hoverlabel: { bgcolor: "#FFF", font: { size: 12 } }
      };

      Plotly.newPlot(plotlyContainer.current, [trace], layout, baseConfig);
    }

    if (type === '3d-surface') {
      const uniqueX = Array.from(new Set(data.map(d => d.x))).sort((a, b) => a - b);
      const uniqueY = Array.from(new Set(data.map(d => d.y))).sort((a, b) => a - b);
      
      const zValues = Array(uniqueY.length).fill(0).map(() => 
        Array(uniqueX.length).fill(null)
      );

      data.forEach(point => {
        const xIndex = uniqueX.indexOf(point.x);
        const yIndex = uniqueY.indexOf(point.y);
        if (xIndex !== -1 && yIndex !== -1) {
          zValues[yIndex][xIndex] = point.z;
        }
      });

      const trace = {
        type: 'surface',
        x: uniqueX,
        y: uniqueY,
        z: zValues,
        colorscale: 'Viridis',
        hovertemplate: 
          `<b>${variableX}</b>: %{x:.2f}<br>` +
          `<b>${variableY}</b>: %{y:.2f}<br>` +
          `<b>${variableZ}</b>: %{z:.2f}<br>` +
          `<extra></extra>`,
        colorbar: {
          title: {
            text: variableZ,
            font: { size: isMobile ? 10 : 12 }
          },
          thickness: 20,
          len: 0.5
        }
      };

      const layout = {
        title: {
          text: `3D Surface Plot of ${variableX}, ${variableY}, and ${variableZ}`,
          font: { family: 'Arial, sans-serif', size: isMobile ? 14 : 16 }
        },
        scene: {
          xaxis: { 
            title: { text: variableX, font: { size: isMobile ? 10 : 12 } },
            gridcolor: '#E5DEFF'
          },
          yaxis: { 
            title: { text: variableY, font: { size: isMobile ? 10 : 12 } },
            gridcolor: '#E5DEFF'
          },
          zaxis: { 
            title: { text: variableZ, font: { size: isMobile ? 10 : 12 } },
            gridcolor: '#E5DEFF'
          },
          camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } }
        },
        margin: isMobile ? { l: 0, r: 0, b: 0, t: 40 } : { l: 0, r: 0, b: 0, t: 40 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        autosize: true,
        showlegend: false,
        hoverlabel: { bgcolor: "#FFF", font: { size: 12 } }
      };

      Plotly.newPlot(plotlyContainer.current, [trace], layout, baseConfig);
    }

    if (type === 'contour') {
      const trace = {
        type: 'contour',
        x: data.map(d => d.x),
        y: data.map(d => d.y),
        z: data.map(d => d.z),
        colorscale: 'Viridis',
        hovertemplate: 
          `<b>${variableX}</b>: %{x:.2f}<br>` +
          `<b>${variableY}</b>: %{y:.2f}<br>` +
          `<b>${variableZ}</b>: %{z:.2f}<br>` +
          `<extra></extra>`,
        colorbar: {
          title: {
            text: variableZ,
            font: { size: isMobile ? 10 : 12 }
          },
          thickness: 20,
          len: 0.5
        },
        contours: {
          coloring: 'heatmap',
          showlabels: true,
          labelfont: {
            size: isMobile ? 10 : 12,
            color: 'white'
          }
        }
      };

      const layout = {
        title: {
          text: `Contour Plot of ${variableX}, ${variableY}, and ${variableZ}`,
          font: { family: 'Arial, sans-serif', size: isMobile ? 14 : 16 }
        },
        xaxis: { 
          title: {
            text: variableX,
            font: { size: isMobile ? 10 : 12 }
          },
          gridcolor: '#E5DEFF'
        },
        yaxis: { 
          title: {
            text: variableY,
            font: { size: isMobile ? 10 : 12 }
          },
          gridcolor: '#E5DEFF'
        },
        margin: isMobile ? { l: 50, r: 50, b: 50, t: 50 } : { l: 50, r: 50, b: 50, t: 50 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        autosize: true,
        hoverlabel: { bgcolor: "#FFF", font: { size: 12 } }
      };

      Plotly.newPlot(plotlyContainer.current, [trace], layout, baseConfig);
    }

    if (type === 'violin') {
      const trace1 = {
        type: 'violin',
        x: Array(data.length).fill(variableX),
        y: data.map(d => d.x),
        points: 'all',
        box: {
          visible: true
        },
        line: {
          color: '#8B5CF6'
        },
        meanline: {
          visible: true
        },
        name: variableX,
        side: 'positive',
        hoverlabel: { bgcolor: "#FFF" },
        hovertemplate: `${variableX}: %{y:.2f}<br>Count: %{text}<extra></extra>`,
        text: data.map(d => d.name)
      };

      const trace2 = {
        type: 'violin',
        x: Array(data.length).fill(variableY),
        y: data.map(d => d.y),
        points: 'all',
        box: {
          visible: true
        },
        line: {
          color: '#D946EF'
        },
        meanline: {
          visible: true
        },
        name: variableY,
        side: 'negative',
        hoverlabel: { bgcolor: "#FFF" },
        hovertemplate: `${variableY}: %{y:.2f}<br>Count: %{text}<extra></extra>`,
        text: data.map(d => d.name)
      };

      const layout = {
        title: {
          text: `Violin Plot of ${variableX} and ${variableY}`,
          font: { family: 'Arial, sans-serif', size: isMobile ? 14 : 16 }
        },
        yaxis: {
          title: 'Concentration',
          zeroline: false,
          gridcolor: '#E5DEFF'
        },
        xaxis: {
          title: 'Variables',
          gridcolor: '#E5DEFF'
        },
        violingap: 0,
        violinmode: 'overlay',
        showlegend: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: isMobile ? { l: 50, r: 50, b: 50, t: 50 } : { l: 50, r: 50, b: 50, t: 50 }
      };

      Plotly.newPlot(plotlyContainer.current, [trace1, trace2], layout, baseConfig);
    }

    return () => {
      if (plotlyContainer.current) {
        Plotly.purge(plotlyContainer.current);
      }
    };
  }, [type, data, variableX, variableY, variableZ, isMobile]);

  if (['3d-scatter', '3d-surface', 'contour', 'violin'].includes(type)) {
    return (
      <div 
        ref={plotlyContainer} 
        style={{ width: '100%', height: isMobile ? '400px' : '500px' }}
        className="bg-white rounded-lg shadow-lg p-4" 
      />
    );
  }

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
