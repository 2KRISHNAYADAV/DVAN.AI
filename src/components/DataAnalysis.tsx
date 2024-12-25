import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import ScatterPlotChart from './charts/ScatterPlotChart';

const DataAnalysis = ({ data, columns }: { data: any[], columns: string[] }) => {
  const calculateStats = (column: string) => {
    const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const missing = data.length - values.length;

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

  const numericColumns = columns.filter(column => {
    const sample = data[0][column];
    return !isNaN(parseFloat(sample));
  });

  const formatBarChartData = (column: string) => {
    return data.slice(0, 100).map((item, index) => ({
      name: item.name || item.title || item.label || `Item ${index + 1}`,
      [column]: parseFloat(item[column])
    }));
  };

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

  return (
    <div className="w-full space-y-6 p-4">
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

      {numericColumns.map(column => (
        <Card key={column} className="p-4">
          <CardHeader>
            <CardTitle>{column} Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BarChart
                data={formatBarChartData(column)}
                dataKey={column}
                title="Distribution"
              />
              <PieChart
                data={calculateStats(column).pieData}
                title="Frequency Distribution"
              />
              {numericColumns[0] !== column && (
                <div className="col-span-full">
                  <ScatterPlotChart
                    data={getPairwiseData(numericColumns[0], column)}
                    xAxisKey={numericColumns[0]}
                    yAxisKey={column}
                    title={`Correlation with ${numericColumns[0]}`}
                  />
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