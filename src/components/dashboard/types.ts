
export interface DetailedStatsProps {
  data: any[];
  columns: string[];
}

export interface ChartData {
  x: number;
  y: number;
  name: string;
}

export interface PieSegment {
  name: string;
  value: number;
  percentage: string;
}

export interface Stats {
  min: number;
  max: number;
  mean: number;
  median: number;
  q1: number;
  q3: number;
  outliers: number;
}
