import React, { useState } from 'react';
import Papa from 'papaparse';
import FileUpload from '@/components/FileUpload';
import DataAnalysis from '@/components/DataAnalysis';
import { toast } from 'sonner';

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setData(results.data);
          setColumns(Object.keys(results.data[0]));
          toast.success('File uploaded successfully');
        } else {
          toast.error('Error parsing file');
        }
      },
      error: () => {
        toast.error('Error parsing file');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Data Analysis Tool</h1>
        
        {data.length === 0 ? (
          <div className="max-w-xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <DataAnalysis data={data} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default Index;