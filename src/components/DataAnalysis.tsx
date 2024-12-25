import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DataAnalysis = ({ data, columns }: { data: any[], columns: string[] }) => {
  const calculateStats = (column: string) => {
    const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const missing = data.length - values.length;

    // Calculate frequency distribution for pie chart
    const bucketSize = Math.ceil((Math.max(...values) - Math.min(...values)) / 5);
    const frequencyMap = values.reduce((acc: { [key: string]: number }, val) => {
      const bucket = Math.floor(val / bucketSize) * bucketSize;
      const bucketLabel = `${bucket}-${bucket + bucketSize}`;
      acc[bucketLabel] = (acc[bucketLabel] || 0) + 1;
      return acc;
    }, {});

    const pieData = Object.entries(frequencyMap)
      .map(([key, value]) => ({
        name: key,
        value: value
      }))
      .slice(0, 5);

    return { mean, median, missing, pieData };
  };

  // Only process numeric columns
  const numericColumns = columns.filter(column => {
    const sample = data[0][column];
    return !isNaN(parseFloat(sample));
  });

  // Format data for bar chart to include names
  const formatBarChartData = (column: string) => {
    return data.slice(0, 100).map((item, index) => ({
      name: item.name || item.title || item.label || `Item ${index + 1}`,
      [column]: parseFloat(item[column])
    }));
  };

  // Get pairwise data for scatter plots
  const getPairwiseData = (col1: string, col2: string) => {
    return data
      .slice(0, 1000)
      .map((row, index) => ({
        name: row.name || row.title || row.label || `Item ${index + 1}`,
        x: parseFloat(row[col1]),
        y: parseFloat(row[col2])
      }))
      .filter(point => !isNaN(point.x) && !isNaN(point.y));
  };

  // Determine if we have geographic data
  const hasCountryData = columns.some(col => 
    col.toLowerCase().includes('country') || 
    col.toLowerCase().includes('nation')
  );
  
  const hasStateData = columns.some(col => 
    col.toLowerCase().includes('state') || 
    col.toLowerCase().includes('province')
  );

  return (
    <div className="w-full space-y-6 p-4">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {numericColumns.map(column => {
          const stats = calculateStats(column);
          return (
            <Card key={`stats-${column}`} className="p-4">
              <CardHeader>
                <CardTitle className="text-lg">{column}</CardTitle>
                <CardDescription>Summary Statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt>Mean:</dt>
                    <dd>{stats.mean.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Median:</dt>
                    <dd>{stats.median.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Missing Values:</dt>
                    <dd>{stats.missing}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analysis Cards */}
      {numericColumns.map(column => (
        <Card key={column} className="p-4">
          <CardHeader>
            <CardTitle>{column} Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Distribution Chart */}
              <div className="min-h-[400px]">
                <h4 className="text-lg font-medium mb-4">Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatBarChartData(column)}>
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
                        value: column, 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }} 
                    />
                    <Tooltip />
                    <Legend />
                    <Bar name={column} dataKey={column} fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Frequency Distribution */}
              <div className="min-h-[400px]">
                <h4 className="text-lg font-medium mb-4">Frequency Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={calculateStats(column).pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => 
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {calculateStats(column).pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(${(index * 360) / 5}, 70%, 50%)`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Pairwise Analysis */}
              {numericColumns[0] !== column && (
                <div className="col-span-full min-h-[400px]">
                  <h4 className="text-lg font-medium mb-4">
                    Correlation with {numericColumns[0]}
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="x"
                        name={numericColumns[0]}
                        type="number"
                        label={{
                          value: numericColumns[0],
                          position: 'bottom',
                          style: { textAnchor: 'middle' }
                        }}
                      />
                      <YAxis
                        dataKey="y"
                        name={column}
                        type="number"
                        label={{
                          value: column,
                          angle: -90,
                          position: 'insideLeft',
                          style: { textAnchor: 'middle' }
                        }}
                      />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter
                        name={`${numericColumns[0]} vs ${column}`}
                        data={getPairwiseData(numericColumns[0], column)}
                        fill="#8B5CF6"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DataAnalysis;
