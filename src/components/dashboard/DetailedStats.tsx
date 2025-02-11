
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailedStatsProps } from './types';
import { StatsDisplay } from './StatsDisplay';
import { ChartVisualization } from './ChartVisualization';
import {
  filterNumericColumns,
  prepareVisualizationData,
  calculatePercentageDistribution,
  calculateStats
} from '@/components/dashboard/utils/dataProcessing';

export const DetailedStats = ({ data, columns }: DetailedStatsProps) => {
  const [variableX, setVariableX] = useState(columns[0] || '');
  const [variableY, setVariableY] = useState(columns[1] || '');
  const [variableZ, setVariableZ] = useState(columns[2] || '');
  const [comparisonType, setComparisonType] = useState('scatter');
  const [rowLimit, setRowLimit] = useState('100');

  const numericColumns = filterNumericColumns(data, columns);
  const visualizationData = prepareVisualizationData(data, variableX, variableY, variableZ, rowLimit);
  const pieData = calculatePercentageDistribution(data, variableX, rowLimit);
  const statsX = calculateStats(data, variableX);
  const statsY = calculateStats(data, variableY);
  const statsZ = calculateStats(data, variableZ);

  const show3DControls = ['3d-scatter', '3d-surface', 'contour'].includes(comparisonType);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Detailed Statistics</CardTitle>
          <div className="flex gap-4">
            <Select value={variableX} onValueChange={setVariableX}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select X variable" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map(column => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={variableY} onValueChange={setVariableY}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Y variable" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map(column => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {show3DControls && (
              <Select value={variableZ} onValueChange={setVariableZ}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Z variable" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map(column => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={comparisonType} onValueChange={setComparisonType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select visualization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scatter">Scatter Plot</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="histogram">Histogram</SelectItem>
                <SelectItem value="box">Box Plot</SelectItem>
                <SelectItem value="bubble">Bubble Chart</SelectItem>
                <SelectItem value="3d-scatter">3D Scatter Plot</SelectItem>
                <SelectItem value="3d-surface">3D Surface Plot</SelectItem>
                <SelectItem value="contour">Contour Plot</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rowLimit} onValueChange={setRowLimit}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Number of rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 Rows</SelectItem>
                <SelectItem value="20">20 Rows</SelectItem>
                <SelectItem value="50">50 Rows</SelectItem>
                <SelectItem value="100">100 Rows</SelectItem>
                <SelectItem value="all">All Rows</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartVisualization
          type={comparisonType}
          data={visualizationData}
          pieData={pieData}
          variableX={variableX}
          variableY={variableY}
          variableZ={variableZ}
        />
        <div className="grid grid-cols-3 gap-4">
          <StatsDisplay variableName={variableX} stats={statsX} />
          <StatsDisplay variableName={variableY} stats={statsY} />
          {show3DControls && (
            <StatsDisplay variableName={variableZ} stats={statsZ} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
