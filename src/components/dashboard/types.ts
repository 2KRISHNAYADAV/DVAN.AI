
export interface DetailedStatsProps {
  data: any[];
  columns: string[];
}

export interface ChartData {
  x: number;
  y: number;
  z?: number;
  name: string;
  size?: number;
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

export interface Surface3DData {
  x: number[];
  y: number[];
  z: number[][];
}

export interface ChartVisualizationProps {
  type: string;
  data: ChartData[];
  pieData: PieSegment[];
  variableX: string;
  variableY: string;
  variableZ: string;
  isMobile: boolean;
}
