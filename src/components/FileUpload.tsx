import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const processFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (file.name.endsWith('.csv')) {
          // Handle CSV files
          const text = e.target?.result as string;
          const rows = text.split('\n');
          const headers = rows[0].split(',');
          const data = rows.slice(1).map(row => {
            const values = row.split(',');
            return headers.reduce((obj: any, header, index) => {
              obj[header.trim()] = values[index]?.trim();
              return obj;
            }, {});
          });
          onFileUpload(data);
        } else {
          // Handle Excel files
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          onFileUpload(jsonData);
        }
        toast.success('File processed successfully');
      } catch (error) {
        toast.error('Error processing file');
        console.error('File processing error:', error);
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
  }, [onFileUpload]);

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
    <div 
      {...getRootProps()} 
      className={`dropzone ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
      <p className="text-lg font-medium">
        {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Supported formats: CSV, Excel (.xlsx, .xls)
      </p>
    </div>
  );
};

export default FileUpload;