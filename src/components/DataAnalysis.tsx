import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, LineChart, Line, PieChart, Pie, Cell,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataAnalysisProps {
  data: any[];
  columns: string[];
}

const COLORS = ['#8B5CF6', '#D946EF', '#6E59A5', '#9b87f5', '#D6BCFA'];

const DataAnalysis = ({ data, columns }: DataAnalysisProps) => {
  const calculateStats = (column: string) => {
    const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const missing = data.length - values.length;

    // Calculate frequency distribution for pie chart
    const frequencyMap = values.reduce((acc: { [key: string]: number }, val) => {
      const bucket = Math.floor(val);
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {});

    const pieData = Object.entries(frequencyMap).map(([key, value]) => ({
      name: key,
      value: value
    }));

    return { mean, median, missing, pieData };
  };

  const numericColumns = columns.filter(column => {
    const sample = data[0][column];
    return !isNaN(parseFloat(sample));
  });

  // Create pairwise data for scatter plots
  const getPairwiseData = (col1: string, col2: string) => {
    return data.map(row => ({
      x: parseFloat(row[col1]),
      y: parseFloat(row[col2])
    })).filter(point => !isNaN(point.x) && !isNaN(point.y));
  };

  // Calculate log-transformed data
  const getLogData = (column: string) => {
    return data
      .map(row => ({
        value: parseFloat(row[column]),
        logValue: Math.log(parseFloat(row[column]))
      }))
      .filter(item => !isNaN(item.value) && item.value > 0);
  };

  return (
    <div className="space-y-8">
      {/* Statistical Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {numericColumns.map(column => {
          const stats = calculateStats(column);
          return (
            <Card key={column} className="stats-card">
              <CardHeader>
                <CardTitle className="text-lg">{column}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Mean</dt>
                    <dd className="text-sm font-medium">{stats.mean.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Median</dt>
                    <dd className="text-sm font-medium">{stats.median.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Missing Values</dt>
                    <dd className="text-sm font-medium">{stats.missing}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Distribution Charts */}
      {numericColumns.map(column => (
        <div key={column} className="space-y-8">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>{column} Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Regular Distribution */}
              <div>
                <h4 className="text-lg font-medium mb-4">Value Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={column} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey={column} fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Log Distribution */}
              <div>
                <h4 className="text-lg font-medium mb-4">Log Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getLogData(column)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="value" />
                    <YAxis dataKey="logValue" />
                    <Tooltip />
                    <Line type="monotone" dataKey="logValue" stroke="#D946EF" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Frequency Distribution (Pie Chart) */}
              <div>
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
                      fill="#8884d8"
                      label
                    >
                      {calculateStats(column).pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pairwise Comparisons */}
          {numericColumns
            .filter(col2 => col2 !== column)
            .map(col2 => (
              <Card key={`${column}-${col2}`} className="p-6">
                <CardHeader>
                  <CardTitle>Pairwise Analysis: {column} vs {col2}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" name={column} />
                      <YAxis dataKey="y" name={col2} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter
                        name={`${column} vs ${col2}`}
                        data={getPairwiseData(column, col2)}
                        fill="#6E59A5"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
        </div>
      ))}
    </div>
  );
};

export default DataAnalysis;