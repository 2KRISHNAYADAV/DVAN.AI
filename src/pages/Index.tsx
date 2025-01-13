import React, { useState, useRef } from 'react';
import FileUpload from '@/components/FileUpload';
import DataAnalysis from '@/components/DataAnalysis';
import ContactForm from '@/components/ContactForm';
import AnalysisMethods from '@/components/AnalysisMethods';
import InferentialAnalysis from '@/components/InferentialAnalysis';
import PredictiveAnalysis from '@/components/PredictiveAnalysis';
import Navigation from '@/components/Navigation';
import { toast } from 'sonner';
import Dashboard from '@/components/dashboard/Dashboard';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  PieChart, 
  Database, 
  Sparkles,
  Mail,
  Instagram,
  Github,
  Linkedin,
  BookOpen
} from 'lucide-react';

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (processedData: any[]) => {
    if (processedData && processedData.length > 0) {
      setData(processedData);
      setColumns(Object.keys(processedData[0]));
    } else {
      toast.error('No data found in file');
    }
  };

  const scrollToDescription = () => {
    descriptionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-16 sm:pt-20">
        {/* Description Button */}
        <div className="text-center mb-6 sm:mb-8">
          <Button 
            onClick={scrollToDescription}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md transition-all w-full sm:w-auto"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            How to Use DVAN.AI
          </Button>
        </div>

        {data.length === 0 ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Description Section */}
            <div ref={descriptionRef} className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-purple-100 animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Welcome to DVAN.AI</h2>
              <div className="text-gray-600 space-y-4 sm:space-y-6">
                <div className="p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <p className="text-purple-800 font-semibold mb-2">Educational Purpose Notice:</p>
                  <p className="text-sm sm:text-base">Currently, this platform is proposed only for educational purposes.</p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Purpose of the Dashboard</h3>
                  <p className="text-sm sm:text-base">DVAN.AI is an interactive data analysis dashboard designed to help users visualize, analyze, and derive insights from structured datasets. It provides various analytical tools and visualizations to make data exploration intuitive and informative.</p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">How to Navigate</h3>
                  <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-sm sm:text-base">
                    <li>Upload your data using the file upload section</li>
                    <li>Explore the overview panel to see your data in a tabular format</li>
                    <li>Use the statistics panel to view descriptive analytics</li>
                    <li>Analyze trends and patterns in the trends section</li>
                    <li>Explore predictive insights in the predictions panel</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Data Handling and Cleaning</h3>
                  <p className="text-sm sm:text-base">All data is processed using DATSH.AI to ensure optimal quality and organization. Our system automatically handles data cleaning and structuring to provide the best analysis experience.</p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Data Requirements</h3>
                  <p className="text-sm sm:text-base">For optimal results, please ensure your data meets these criteria:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm sm:text-base">
                    <li>Clean, structured format (preferably CSV or Excel)</li>
                    <li>Organized in x, y pairs or similar structured format</li>
                    <li>Avoid large unstructured text or messy information</li>
                    <li>Examples of suitable datasets: world population data, COVID-19 statistics, economic indicators</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <LineChart className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Advanced Analytics</h3>
                <p className="text-xs sm:text-sm text-gray-600">Powerful tools for deep data analysis</p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-pink-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <PieChart className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Visual Insights</h3>
                <p className="text-gray-600 text-sm">Beautiful and interactive visualizations</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Data Processing</h3>
                <p className="text-gray-600 text-sm">Support for CSV and Excel files</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-violet-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">AI Powered</h3>
                <p className="text-gray-600 text-sm">Smart insights and predictions</p>
              </div>

            </div>

            <AnalysisMethods />

            {/* Inferential Analysis Section */}
            <div className="mt-8">
              <InferentialAnalysis />
            </div>

            {/* Predictive Analysis Section */}
            <div className="mt-8">
              <PredictiveAnalysis />
            </div>

            {/* Upload Section */}
            <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-purple-100">
              <FileUpload onFileUpload={handleFileUpload} />
            </div>

          </div>
        ) : (
          <Dashboard data={data} columns={columns} />
        )}

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-8 sm:mt-16">
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-4 sm:p-8">
            <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <Mail className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Contact Us</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Have questions or need assistance? Feel free to reach out to us using the form below or email us directly at:
              </p>
              <a 
                href="mailto:darya780945@gmail.com" 
                className="inline-flex items-center space-x-2 text-base sm:text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                <span>darya780945@gmail.com</span>
              </a>
            </div>
            
            <ContactForm />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="max-w-4xl mx-auto mt-8 sm:mt-16 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-4 sm:p-8">
            <div className="text-center space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Connect With Me</h2>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                <a
                  href="https://www.instagram.com/krishnayaduvansy58/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center space-y-2 transition-transform hover:scale-110"
                >
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6">
                    <Instagram className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 group-hover:text-purple-600">Instagram</span>
                </a>

                <a
                  href="https://github.com/2KRISHNAYADAV"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center space-y-2 transition-transform hover:scale-110"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">GitHub</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/krishna-yadav-392b61300"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center space-y-2 transition-transform hover:scale-110"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6">
                    <Linkedin className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">LinkedIn</span>
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
