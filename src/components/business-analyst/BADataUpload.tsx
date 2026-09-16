import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, FileText, Database, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Activity, Rows, Columns, Table2, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBAStore } from '@/lib/businessAnalystStore';
import { analyzeDataset } from '@/lib/dataAnalysis';

export const BADataUpload = () => {
  const { rawDataset, datasetSummary, setRawDataset, setActiveSection, setIsDemoMode, datasetHealth, clearWorkspace } = useBAStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateHealth = (data: any[], summary: any) => {
    let missingCells = 0;
    const totalCells = data.length * summary.columnCount;
    
    summary.columns.forEach((col: any) => {
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

  const processData = (data: any[]) => {
    setIsProcessing(true);
    try {
      if (data.length === 0) {
        toast.error('Dataset is empty');
        setIsProcessing(false);
        return;
      }

      const summary = analyzeDataset(data);
      const health = calculateHealth(data, summary);
      
      setRawDataset(data, summary, health);
      
      toast.success('Dataset analyzed successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze dataset');
    } finally {
      setIsProcessing(false);
    }
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let processedData: any[] = [];
        if (file.name.endsWith('.csv')) {
          const text = e.target?.result as string;
          const parsed = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
          processedData = parsed.data;
        } else {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          processedData = XLSX.utils.sheet_to_json(sheet, { raw: false, dateNF: 'yyyy-mm-dd' });
        }
        setIsDemoMode(false);
        processData(processedData);
      } catch (error) {
        toast.error('Error processing file');
        setIsProcessing(false);
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (file && (validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      processFile(file);
    } else {
      toast.error('Please upload a valid CSV or Excel file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  if (datasetHealth) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#E2E2E0]">Dataset Health</h2>
            <p className="text-[#E2E2E0]/70 mt-1">Your data has been successfully profiled.</p>
          </div>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-200"
            onClick={() => setActiveSection('context')}
          >
            Continue to Business Context
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Rows className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-[#E2E2E0]/70">Rows</p>
              <h3 className="text-2xl font-bold text-[#E2E2E0]">{datasetHealth.rows.toLocaleString()}</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Columns className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-[#E2E2E0]/70">Columns</p>
              <h3 className="text-2xl font-bold text-[#E2E2E0]">{datasetHealth.columns}</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${datasetHealth.missingValuesPercent > 5 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                {datasetHealth.missingValuesPercent > 5 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
              <p className="text-sm font-medium text-[#E2E2E0]/70">Missing Values</p>
              <h3 className="text-2xl font-bold text-[#E2E2E0]">{datasetHealth.missingValuesPercent}%</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${datasetHealth.duplicatesPercent > 5 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                {datasetHealth.duplicatesPercent > 5 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
              <p className="text-sm font-medium text-[#E2E2E0]/70">Duplicates</p>
              <h3 className="text-2xl font-bold text-[#E2E2E0]">{datasetHealth.duplicatesPercent}%</h3>
            </CardContent>
          </Card>
          <Card className="border-teal-200 shadow-md shadow-teal-100/50">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                <Activity className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-[#E2E2E0]/70">Quality Score</p>
              <h3 className="text-2xl font-bold text-teal-700">{datasetHealth.dataQualityScore}/100</h3>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" className="text-[#E2E2E0]/70" onClick={() => clearWorkspace()}>
            Upload different file
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 hover:text-purple-800"
            onClick={() => setActiveSection('transform')}
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Transform & Edit Data
          </Button>
        </div>

        {rawDataset.length > 0 && (
          <Card className="border-[#2B7574]/30 shadow-sm mt-8">
            <div className="bg-[#0E2931] border-b border-[#2B7574]/20 p-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center">
                <Table2 className="w-5 h-5 mr-2 text-[#E2E2E0]/60" />
                <h3 className="font-bold text-[#E2E2E0]">Raw Data Viewer</h3>
              </div>
              <span className="text-xs font-medium bg-[rgba(14,41,49,0.9)] text-[#E2E2E0]/80 px-2 py-1 rounded">
                Preview Mode
              </span>
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#12484C] sticky top-0 shadow-sm ring-1 ring-[#2B7574]/20 z-10">
                  <tr>
                    <th className="px-4 py-3 text-[#E2E2E0]/60 font-semibold w-12 text-center bg-[#0E2931] border-r border-[#2B7574]/20">#</th>
                    {datasetSummary?.columns.map(c => (
                      <th key={c.name} className="px-4 py-3 text-[#E2E2E0]/80 font-bold whitespace-nowrap bg-[#12484C] border-b border-[#2B7574]/20">
                        {c.name}
                        <span className="block text-[10px] text-[#E2E2E0]/60 font-normal mt-0.5">{c.type}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B7574]/20">
                  {rawDataset.slice(0, 100).map((row, i) => (
                    <tr key={i} className="hover:bg-[#0E2931]/80 transition-colors">
                      <td className="px-4 py-2 text-[#E2E2E0]/60 text-xs text-center bg-[#0E2931] border-r border-[#2B7574]/20 font-mono">
                        {i + 1}
                      </td>
                      {datasetSummary?.columns.map(c => (
                        <td key={c.name} className="px-4 py-2 text-[#E2E2E0] truncate max-w-[200px]" title={String(row[c.name] || '')}>
                          {String(row[c.name] || '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-[#0E2931] p-3 border-t border-[#2B7574]/20 text-center text-xs text-[#E2E2E0]/70 font-medium rounded-b-xl">
              Showing top {Math.min(100, rawDataset.length)} of {rawDataset.length.toLocaleString()} rows. Full dataset is loaded for AI analysis.
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-3xl font-extrabold text-[#E2E2E0]">Connect Your Business Data</h2>
        <p className="text-[#E2E2E0]/70 text-lg max-w-2xl mx-auto">
          Upload your data to automatically discover KPIs, run root cause analysis, and generate AI insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          {...getRootProps()} 
          className={`col-span-1 md:col-span-2 border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-teal-500 bg-teal-50 shadow-inner' : 'border-[#2B7574]/40 hover:border-teal-400 hover:bg-[#0E2931] bg-[#12484C]'}`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 mx-auto mb-6 bg-[rgba(14,41,49,0.8)] rounded-full flex items-center justify-center">
            {isProcessing ? (
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className={`w-10 h-10 ${isDragActive ? 'text-teal-500' : 'text-[#E2E2E0]/60'}`} />
            )}
          </div>
          <h3 className="text-xl font-bold text-[#E2E2E0] mb-2">
            {isProcessing ? 'Analyzing Dataset...' : (isDragActive ? 'Drop your file here' : 'Drag & drop Excel or CSV')}
          </h3>
          <p className="text-[#E2E2E0]/70 mb-6">
            Supports .xlsx, .xls, and .csv files. Maximum 50MB.
          </p>
          <Button variant="outline" className="pointer-events-none" disabled={isProcessing}>
            Browse Files
          </Button>
        </div>

        <Card className="hover:border-slate-400 transition-colors cursor-pointer opacity-70">
          <CardContent className="p-6 flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#E2E2E0]">Connect Google Sheets</h3>
              <p className="text-sm text-[#E2E2E0]/70 mt-1">Import directly from your Google Drive (Coming soon)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl flex items-start space-x-4">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900">Data Security & Privacy</h4>
          <p className="text-sm text-amber-800 mt-1 leading-relaxed">
            Your raw dataset is processed locally in your browser. Only metadata (column names, statistical summaries) are sent to the AI for analysis. No personally identifiable information (PII) leaves your device.
          </p>
        </div>
      </div>
    </div>
  );
};
