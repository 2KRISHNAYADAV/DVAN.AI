import React from 'react';
import Navigation from '@/components/Navigation';
import { 
  Brain, 
  LineChart, 
  Database, 
  Code2, 
  Users, 
  Target,
  Sparkles,
  GraduationCap
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-purple-600 text-white">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/02d0e3fb-c750-4fbf-84e2-f0da643878f5.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in">
              About DVAN.AI
            </h1>
            <p className="text-xl sm:text-2xl text-purple-100 max-w-3xl mx-auto animate-fade-in">
              Empowering data analysis through intelligent visualization and advanced analytics
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            At DVAN.AI, we're committed to democratizing data analysis by making powerful analytical tools accessible to everyone. Our platform bridges the gap between complex data science and practical business insights, enabling users to make data-driven decisions with confidence.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow animate-fade-in">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Innovation</h3>
            <p className="text-gray-600">
              Continuously pushing boundaries in data analysis and visualization techniques
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow animate-fade-in">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
            <p className="text-gray-600">
              Making advanced analytics accessible to users of all skill levels
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow animate-fade-in">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
            <p className="text-gray-600">
              Delivering high-quality, reliable analytics solutions
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <LineChart className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Key Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Database className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Data Processing</h3>
                <p className="text-gray-600">Advanced algorithms for efficient data cleaning and preparation</p>
              </div>
            </div>

            <div className="flex gap-4">
              <LineChart className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Interactive Visualizations</h3>
                <p className="text-gray-600">Dynamic charts and graphs for intuitive data exploration</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Brain className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600">Machine learning algorithms for predictive analytics</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Code2 className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Custom Integration</h3>
                <p className="text-gray-600">Flexible API and export options for seamless workflow integration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Focus */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-sm p-8 text-white animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Educational Purpose</h2>
          </div>
          <p className="text-lg leading-relaxed mb-6">
            DVAN.AI is currently focused on educational purposes, providing students and educators with a powerful platform for learning data analysis and visualization techniques. Our tools are designed to support academic exploration and skill development in data science.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Learning Resources</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Interactive tutorials
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Practical examples
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Guided projects
                </li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Academic Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Hands-on experience
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Real-world applications
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Skill development
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;