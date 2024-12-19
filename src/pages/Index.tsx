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
        <h1 className="text-4xl font-bold text-center mb-2">
          <span className="inline-block animate-bounce text-[#9b87f5]">d</span>
          <span className="inline-block animate-bounce delay-75 text-[#D946EF]">a</span>
          <span className="inline-block animate-bounce delay-100 text-[#8B5CF6]">t</span>
          <span className="inline-block animate-bounce delay-150 text-[#7E69AB]">t</span>
          <span className="inline-block animate-bounce delay-200 text-[#6E59A5]">a</span>
          <span className="inline-block animate-bounce delay-300 text-[#D6BCFA]">v</span>
          <span className="inline-block animate-bounce delay-300 text-[#9b87f5]">i</span>
          <span className="inline-block animate-bounce delay-400 text-[#D946EF]">s</span>
          <span className="inline-block animate-bounce delay-500 text-[#8B5CF6]">h</span>
          <span className="inline-block animate-bounce delay-600 text-[#7E69AB]">l</span>
          <span className="inline-block animate-bounce delay-700 text-[#6E59A5]">e</span>
          <span className="inline-block animate-bounce delay-800 text-[#D6BCFA]">s</span>
          <span className="inline-block animate-bounce delay-900 text-[#9b87f5]">h</span>
          <span className="inline-block animate-bounce delay-1000 text-[#D946EF]">a</span>
          <span className="inline-block animate-bounce delay-1100 text-[#8B5CF6]">n</span>
          <span className="inline-block text-[#7E69AB]">.AI</span>
        </h1>
        <p className="text-center text-gray-500 mb-8">(DVAN.AI)</p>
        
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