import { DatasetSummary, ColumnStats } from './dataAnalysis';
import { getGeminiInsight } from './geminiClient';

export interface ChartRecommendation {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'kpi' | 'map';
  title: string;
  description: string;
  xAxis?: string;
  yAxis?: string;
  category?: string;
  value?: string;
  engine: 'recharts' | 'plotly';
}

const isFinance = (colName: string) => /rev|sale|price|profit|cost|margin/i.test(colName);
const isHR = (colName: string) => /emp|salary|attrition|hire|department/i.test(colName);
const isLocation = (colName: string) => /lat|lon|city|country|region|state/i.test(colName);

export const generateRuleBasedCharts = (summary: DatasetSummary): ChartRecommendation[] => {
  const recommendations: ChartRecommendation[] = [];
  const { columns } = summary;

  const dateCols = columns.filter(c => c.type === 'date');
  const numCols = columns.filter(c => c.type === 'numeric');
  const catCols = columns.filter(c => c.type === 'categorical');
  const locCols = columns.filter(c => isLocation(c.name));

  // Intelligent KPIs
  let kpiAdded = 0;
  numCols.forEach(numCol => {
    if (kpiAdded >= 4) return;
    
    let title = `Total ${numCol.name}`;
    if (isFinance(numCol.name)) title = `${numCol.name.toUpperCase()} (Financial)`;
    if (isHR(numCol.name)) title = `${numCol.name} Metric (HR)`;

    recommendations.push({
      id: `kpi-${numCol.name}`,
      type: 'kpi',
      title,
      description: `Aggregation of ${numCol.name}`,
      value: numCol.name,
      engine: 'recharts'
    });
    kpiAdded++;
  });

  // Trend Analysis
  if (dateCols.length > 0 && numCols.length > 0) {
    recommendations.push({
      id: `trend-${dateCols[0].name}-${numCols[0].name}`,
      type: 'line',
      title: `${numCols[0].name} Trend over Time`,
      description: `Analysis of ${numCols[0].name} by ${dateCols[0].name}`,
      xAxis: dateCols[0].name,
      yAxis: numCols[0].name,
      engine: 'recharts'
    });
  }

  // Category Analysis
  if (catCols.length > 0 && numCols.length > 0) {
    recommendations.push({
      id: `bar-${catCols[0].name}-${numCols[0].name}`,
      type: 'bar',
      title: `${numCols[0].name} by ${catCols[0].name}`,
      description: `Comparison of ${numCols[0].name} across ${catCols[0].name}`,
      xAxis: catCols[0].name,
      yAxis: numCols[0].name,
      engine: 'recharts'
    });
    
    // Distribution
    recommendations.push({
      id: `pie-${catCols[0].name}-${numCols[0].name}`,
      type: 'pie',
      title: `${numCols[0].name} Share by ${catCols[0].name}`,
      description: `Distribution of ${numCols[0].name}`,
      xAxis: catCols[0].name, // Using xAxis for pie nameKey
      yAxis: numCols[0].name, // Using yAxis for pie dataKey
      engine: 'recharts'
    });
  }

  // Correlation Scatter
  if (numCols.length >= 2) {
    recommendations.push({
      id: `scatter-${numCols[0].name}-${numCols[1].name}`,
      type: 'scatter',
      title: `Correlation: ${numCols[0].name} vs ${numCols[1].name}`,
      description: `Relationship between variables`,
      xAxis: numCols[0].name,
      yAxis: numCols[1].name,
      engine: 'plotly'
    });
  }

  return recommendations;
};

export const enhanceChartsWithAI = async (summary: DatasetSummary, baseCharts: ChartRecommendation[]): Promise<ChartRecommendation[]> => {
  try {
    const prompt = `
    I have a dataset with the following schema:
    ${JSON.stringify(summary.columns.map(c => ({ name: c.name, type: c.type })), null, 2)}
    
    I have already created these charts:
    ${JSON.stringify(baseCharts.map(c => c.title))}
    
    Recommend 2 additional highly insightful charts (types: bar, pie, heatmap) based on the business meaning of the columns (e.g. Sales, HR, Finance).
    Format response as JSON array:
    [{ "type": "bar|pie|heatmap", "title": "Chart Title", "description": "Why this matters", "xAxis": "colName", "yAxis": "colName" }]
    Return only valid JSON.
    `;

    const aiResponse = await getGeminiInsight(prompt);
    const jsonStrMatch = aiResponse.match(/\[.*\]/s);
    if (jsonStrMatch) {
      const aiCharts = JSON.parse(jsonStrMatch[0]);
      const enhanced = aiCharts.map((chart: any, i: number) => ({
        ...chart,
        id: `ai-chart-${i}`,
        engine: chart.type === 'heatmap' ? 'plotly' : 'recharts'
      }));
      return [...baseCharts, ...enhanced];
    }
  } catch (error) {
    console.error("AI enhancement failed, falling back to rule-based:", error);
  }
  return baseCharts;
};
