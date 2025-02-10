
export const filterNumericColumns = (data: any[], columns: string[]): string[] => {
  return columns.filter(column => {
    const sample = data[0]?.[column];
    return typeof sample === 'number' || !isNaN(parseFloat(sample));
  });
};

export const prepareVisualizationData = (
  data: any[],
  variableX: string,
  variableY: string,
  rowLimit: string
) => {
  if (!data || !variableX || !variableY) return [];
  
  const limit = rowLimit === 'all' ? data.length : parseInt(rowLimit);
  return data.slice(0, limit).map(row => ({
    x: parseFloat(row[variableX]) || 0,
    y: parseFloat(row[variableY]) || 0,
    name: `${row[variableX]}-${row[variableY]}`
  })).filter(item => !isNaN(item.x) && !isNaN(item.y));
};

export const calculatePercentageDistribution = (
  data: any[],
  variableX: string,
  rowLimit: string
) => {
  if (!data || !variableX) return [];
  
  const limit = rowLimit === 'all' ? data.length : parseInt(rowLimit);
  const values = data.slice(0, limit)
    .map(row => parseFloat(row[variableX]))
    .filter(val => !isNaN(val));
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const segmentSize = range / 5;
  
  const segments = Array(5).fill(0);
  values.forEach(value => {
    const segmentIndex = Math.min(Math.floor((value - min) / segmentSize), 4);
    segments[segmentIndex]++;
  });
  
  return segments.map((count, index) => ({
    name: `${(min + index * segmentSize).toFixed(1)}-${(min + (index + 1) * segmentSize).toFixed(1)}`,
    value: count,
    percentage: ((count / values.length) * 100).toFixed(1)
  }));
};

export const calculateStats = (data: any[], variable: string) => {
  if (!variable || !data?.length) {
    return { min: 0, max: 0, mean: 0, median: 0, q1: 0, q3: 0, outliers: 0 };
  }

  const values = data
    .map(row => parseFloat(row[variable]))
    .filter(val => !isNaN(val));

  if (!values.length) {
    return { min: 0, max: 0, mean: 0, median: 0, q1: 0, q3: 0, outliers: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)] || 0;
  const q3 = sorted[Math.floor(sorted.length * 0.75)] || 0;
  const iqr = q3 - q1;
  const outliers = values.filter(v => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr);

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    median: sorted[Math.floor(sorted.length / 2)] || 0,
    q1,
    q3,
    outliers: outliers.length
  };
};

export const formatNumber = (value: number | undefined) => {
  if (value === undefined || isNaN(value)) return '0.00';
  return value.toFixed(2);
};
