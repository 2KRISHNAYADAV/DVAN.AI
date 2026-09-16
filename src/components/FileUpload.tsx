import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [validatedData, setValidatedData] = useState<any[] | null>(null);
  const [validationScore, setValidationScore] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateDataset = (rawData: any[]) => {
    const errors: string[] = [];
    if (!rawData || rawData.length === 0) {
      errors.push('Dataset is empty');
      return { score: 0, errors, cleanedData: rawData };
    }

    // Clean headers: remove empty headers or __EMPTY columns (from XLSX)
    const rawHeaders = Object.keys(rawData[0]);
    const validHeaders = rawHeaders.filter(h => h && h.trim() !== '' && !h.startsWith('__EMPTY'));

    if (validHeaders.length === 0) {
      errors.push('No valid columns found');
      return { score: 0, errors, cleanedData: rawData };
    }

    // Filter out rows that are completely empty across valid headers
    let cleanedData = rawData.filter(row => {
      return validHeaders.some(h => row[h] !== undefined && row[h] !== null && row[h] !== '');
    });

    if (cleanedData.length === 0) {
      errors.push('Dataset contains no valid rows');
      return { score: 0, errors, cleanedData };
    }
    
    // Find completely empty columns and remove them from validHeaders
    const actuallyValidHeaders = validHeaders.filter(h => !cleanedData.every(row => row[h] === undefined || row[h] === null || row[h] === ''));

    // Create new objects with only valid headers to avoid issues with hidden/empty columns
    cleanedData = cleanedData.map(row => {
      const newRow: any = {};
      actuallyValidHeaders.forEach(h => {
        // If string, trim it, sometimes spaces are parsed as values
        const val = row[h];
        newRow[h] = typeof val === 'string' ? val.trim() : val;
      });
      return newRow;
    });

    // We no longer reject the dataset for having missing values or duplicates, 
    // as real-world datasets often have them and AI can handle them.

    const score = errors.length === 0 ? 100 : Math.max(0, 100 - (errors.length * 25));
    return { score, errors, cleanedData };
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    setValidatedData(null);
    setValidationErrors([]);
    setValidationScore(null);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        let processedData: any[] = [];
        if (file.name.endsWith('.csv')) {
          const text = e.target?.result as string;
          const parsed = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
          });
          processedData = parsed.data;
        } else {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          processedData = XLSX.utils.sheet_to_json(sheet, { raw: false });
        }

        const { score, errors, cleanedData } = validateDataset(processedData);
        setValidationScore(score);
        
        if (score === 100) {
          setValidatedData(cleanedData);
          toast.success('Dataset validated successfully');
        } else {
          setValidationErrors(errors);
          toast.error('Dataset is not ready for analysis. Please clean your dataset before uploading.');
        }
      } catch (error) {
        toast.error('Error processing file');
        console.error('File processing error:', error);
      } finally {
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
    
    if (file && (validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      processFile(file);
    } else {
      toast.error('Please upload a valid CSV or Excel file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md flex items-start">
        <ShieldAlert className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-yellow-800">Data Privacy Warning</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Upload only authorized datasets. Avoid sensitive personal information (PII). By uploading, you agree that basic statistical metadata (but not raw rows) may be processed by AI to generate insights.
          </p>
        </div>
      </div>

      {!validatedData && !validationErrors.length && (
        <div 
          {...getRootProps()} 
          className={`dropzone border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}`}
        >
          <input {...getInputProps()} />
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-purple-600' : 'text-[#E2E2E0]/60'}`} />
          <p className="text-lg font-medium text-[#E2E2E0]">
            {isProcessing ? 'Validating Dataset...' : (isDragActive ? 'Drop your file here' : 'Drag & drop your dataset here')}
          </p>
          <p className="text-sm text-[#E2E2E0]/70 mt-2">
            Supported formats: CSV, Excel (.xlsx, .xls)
          </p>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-semibold">Dataset Rejected</h3>
          </div>
          <p className="text-sm text-red-700 mb-4">Dataset is not ready for analysis. Please clean your dataset before uploading.</p>
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1 mb-6">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
          <Button variant="outline" onClick={() => setValidationErrors([])}>
            Try Another File
          </Button>
        </div>
      )}

      {validatedData && validationScore === 100 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fade-in">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-700 mb-2">Dataset Ready ✓</h3>
          <div className="flex justify-center space-x-6 text-sm text-green-800 mb-6">
            <div><strong>Score:</strong> 100% Quality</div>
            <div><strong>Rows:</strong> {validatedData.length}</div>
            <div><strong>Columns:</strong> {Object.keys(validatedData[0]).length}</div>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-8"
            onClick={() => onFileUpload(validatedData)}
          >
            Generate Dashboard
          </Button>
          <div className="mt-4">
             <Button variant="ghost" onClick={() => setValidatedData(null)} className="text-[#E2E2E0]/70 hover:text-[#E2E2E0]">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;