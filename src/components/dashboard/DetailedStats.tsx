
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailedStatsProps } from './types';
import { StatsDisplay } from './StatsDisplay';
import { ChartVisualization } from './ChartVisualization';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  filterNumericColumns,
  prepareVisualizationData,
  calculatePercentageDistribution,
  calculateStats
} from '@/components/dashboard/utils/dataProcessing';

export const DetailedStats: React.FC<DetailedStatsProps> = ({ data, columns }) => {
  const [variableX, setVariableX] = useState(columns[0] || '');
  const [variableY, setVariableY] = useState(columns[1] || '');
  const [variableZ, setVariableZ] = useState(columns[2] || '');
  const [comparisonType, setComparisonType] = useState('scatter');
  const [rowLimit, setRowLimit] = useState('100');
  const isMobile = useIsMobile();

  const numericColumns = filterNumericColumns(data, columns);
  const visualizationData = prepareVisualizationData(data, variableX, variableY, variableZ, rowLimit);
  const pieData = calculatePercentageDistribution(data, variableX, rowLimit);
  const statsX = calculateStats(data, variableX);
  const statsY = calculateStats(data, variableY);
  const statsZ = calculateStats(data, variableZ);

  const show3DControls = ['3d-scatter', '3d-surface', 'contour'].includes(comparisonType);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          <CardTitle className="text-xl font-bold mb-4">Detailed Statistics</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <div className="w-full">
              <Select value={variableX} onValueChange={setVariableX}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select X variable" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {numericColumns.map(column => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Select value={variableY} onValueChange={setVariableY}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Y variable" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {numericColumns.map(column => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {show3DControls && (
              <div className="w-full">
                <Select value={variableZ} onValueChange={setVariableZ}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Z variable" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {numericColumns.map(column => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="w-full">
              <Select value={comparisonType} onValueChange={setComparisonType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select visualization" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="histogram">Histogram</SelectItem>
                  <SelectItem value="box">Box Plot</SelectItem>
                  <SelectItem value="bubble">Bubble Chart</SelectItem>
                  <SelectItem value="violin">Violin Plot</SelectItem>
                  <SelectItem value="heatmap">Heatmap</SelectItem>
                  <SelectItem value="3d-scatter">3D Scatter Plot</SelectItem>
                  <SelectItem value="3d-surface">3D Surface Plot</SelectItem>
                  <SelectItem value="contour">Contour Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Select value={rowLimit} onValueChange={setRowLimit}>
                <SelectTrigger className="w-full">
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
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          <ChartVisualization
            type={comparisonType}
            data={visualizationData}
            pieData={pieData}
            variableX={variableX}
            variableY={variableY}
            variableZ={variableZ}
            isMobile={isMobile}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsDisplay variableName={variableX} stats={statsX} />
            <StatsDisplay variableName={variableY} stats={statsY} />
            {show3DControls && (
              <StatsDisplay variableName={variableZ} stats={statsZ} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
