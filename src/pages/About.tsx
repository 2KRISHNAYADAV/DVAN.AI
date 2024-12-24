import React from 'react';
import Navigation from '@/components/Navigation';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12 pt-20">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">About DVAN.AI</h1>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-4">
              DVAN.AI is a powerful data analysis and visualization platform designed to help you extract meaningful insights from your data.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To democratize data analysis by providing intuitive tools that make complex analysis accessible to everyone.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Key Features</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Advanced data visualization capabilities</li>
              <li>Intuitive interface for data analysis</li>
              <li>Support for various data formats</li>
              <li>Real-time data processing</li>
              <li>Interactive dashboards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;