import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface PredictivePanelProps {
  data: any[];
  columns: string[];
}

export const PredictivePanel = ({ data, columns }: PredictivePanelProps) => {
  const numericColumns = columns.filter(column => {
    const sample = data[0][column];
    return !isNaN(parseFloat(sample));
  });

  // Simple moving average calculation
  const calculateMovingAverage = (data: any[], column: string, window: number) => {
    return data.map((row, index) => {
      if (index < window - 1) return { ...row, ma: null };
      
      const sum = data
        .slice(index - window + 1, index + 1)
        .reduce((acc, curr) => acc + parseFloat(curr[column]), 0);
      
      return {
        ...row,
        ma: sum / window,
      };
    });
  };

  const maData = calculateMovingAverage(data.slice(0, 100), numericColumns[0], 5);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Trend Prediction</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Trend Prediction uses moving averages to analyze and forecast data patterns. The blue line shows actual values, while the purple line represents a 5-period moving average that smooths out fluctuations to reveal underlying trends.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={maData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={columns[0]} />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={numericColumns[0]}
                stroke="#8B5CF6"
                dot={false}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="ma"
                stroke="#D946EF"
                dot={false}
                name="Moving Average (5 periods)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};