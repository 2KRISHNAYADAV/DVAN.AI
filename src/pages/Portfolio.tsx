import React from 'react';
import Navigation from '@/components/Navigation';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12 pt-20">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">Portfolio</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project Cards */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Data Analysis Dashboard</h3>
                <p className="text-gray-600 text-sm">Interactive dashboard for real-time data analysis and visualization.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Predictive Analytics Tool</h3>
                <p className="text-gray-600 text-sm">Machine learning-based tool for predicting future trends.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Data Cleaning Suite</h3>
                <p className="text-gray-600 text-sm">Comprehensive tools for data preprocessing and cleaning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;