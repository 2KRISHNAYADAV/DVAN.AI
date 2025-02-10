
import React from 'react';
import { formatNumber } from './utils/dataProcessing';
import { Stats } from './types';

interface StatsDisplayProps {
  variableName: string;
  stats: Stats;
}

export const StatsDisplay = ({ variableName, stats }: StatsDisplayProps) => {
  return (
    <div className="p-4 bg-purple-50 rounded-lg">
      <h3 className="font-semibold mb-2">{variableName} Statistics</h3>
      <div className="space-y-1 text-sm">
        <p>Mean: {formatNumber(stats.mean)}</p>
        <p>Median: {formatNumber(stats.median)}</p>
        <p>Range: {formatNumber(stats.min)} - {formatNumber(stats.max)}</p>
        <p>Outliers: {stats.outliers}</p>
      </div>
    </div>
  );
};
