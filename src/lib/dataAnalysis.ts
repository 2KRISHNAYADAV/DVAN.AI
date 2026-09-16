import * as ss from 'simple-statistics';

export interface ColumnStats {
  name: string;
  type: 'numeric' | 'categorical' | 'date';
  uniqueValues: number;
  missingCount: number;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
  topCategories?: { value: string; count: number }[];
}

export interface DatasetSummary {
  rowCount: number;
  columnCount: number;
  columns: ColumnStats[];
}

const detectType = (values: any[]): 'numeric' | 'categorical' | 'date' => {
  const nonNull = values.filter(v => v !== null && v !== undefined && v !== '');
  if (nonNull.length === 0) return 'categorical';

  // Strict Date check: Must match a date-like pattern and be parseable
  // Supports YYYY-MM-DD, DD-MM-YYYY, DD-MMM-YYYY, DD MMM YYYY, etc.
  const datePattern = /^(?:\d{4}[-/\s](?:\d{1,2}|[a-zA-Z]{3,})[-/\s]\d{1,2}|\d{1,2}[-/\s](?:\d{1,2}|[a-zA-Z]{3,})[-/\s]\d{2,4})/;
  const isDate = nonNull.every(v => {
    const str = String(v).trim();
    return datePattern.test(str) && !isNaN(Date.parse(str));
  });
  if (isDate) return 'date';

  // Check if mostly numeric (exclude boolean-like 0/1 if they are the only values? No, just standard numeric)
  const isNumeric = nonNull.every(v => !isNaN(Number(v)) && String(v).trim() !== '');
  if (isNumeric) return 'numeric';

  return 'categorical';
};

export const analyzeDataset = (data: any[]): DatasetSummary => {
  if (!data || data.length === 0) {
    return { rowCount: 0, columnCount: 0, columns: [] };
  }

  const headers = Object.keys(data[0]);
  const columns: ColumnStats[] = headers.map(header => {
    const values = data.map(row => row[header]);
    const type = detectType(values);
    
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const missingCount = values.length - nonNullValues.length;
    const uniqueValues = new Set(values).size;

    const colStat: ColumnStats = {
      name: header,
      type,
      uniqueValues,
      missingCount
    };

    if (type === 'numeric') {
      const numValues = nonNullValues.map(v => Number(v));
      if (numValues.length > 0) {
        colStat.min = ss.min(numValues);
        colStat.max = ss.max(numValues);
        colStat.mean = ss.mean(numValues);
        colStat.median = ss.median(numValues);
        colStat.stdDev = ss.standardDeviation(numValues);
      }
    } else {
      const counts: Record<string, number> = {};
      nonNullValues.forEach(v => {
        counts[String(v)] = (counts[String(v)] || 0) + 1;
      });
      colStat.topCategories = Object.entries(counts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    return colStat;
  });

  return {
    rowCount: data.length,
    columnCount: headers.length,
    columns
  };
};

export const calculateDatasetHealth = (data: any[], summary: DatasetSummary) => {
  let missingCells = 0;
  const totalCells = data.length * summary.columnCount;
  
  summary.columns.forEach((col: ColumnStats) => {
    missingCells += col.missingCount;
  });
  
  const missingValuesPercent = totalCells > 0 ? (missingCells / totalCells) * 100 : 0;
  
  // Check duplicates (sample up to 1000 rows for performance)
  const sampleSize = Math.min(data.length, 1000);
  const sample = data.slice(0, sampleSize);
  const rowStrings = sample.map(row => JSON.stringify(row));
  const uniqueRows = new Set(rowStrings);
  const duplicatesPercent = sampleSize > 0 ? ((sampleSize - uniqueRows.size) / sampleSize) * 100 : 0;
  
  let score = 100;
  score -= missingValuesPercent; // subtract 1 point per 1% missing
  score -= (duplicatesPercent * 2); // subtract 2 points per 1% duplicates
  
  return {
    rows: data.length,
    columns: summary.columnCount,
    missingValuesPercent: Number(missingValuesPercent.toFixed(1)),
    duplicatesPercent: Number(duplicatesPercent.toFixed(1)),
    dataQualityScore: Math.max(0, Math.round(score))
  };
};
