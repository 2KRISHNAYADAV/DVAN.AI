import React from 'react';
import { Clock, TrendingUp, LineChart, BarChart } from 'lucide-react';

const TimeSeriesSection = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-indigo-600 animate-pulse" />
            <h3 className="font-semibold">Time Series Components</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Trend Analysis</li>
            <li>Seasonality Patterns</li>
            <li>Cyclical Components</li>
            <li>Random Variations</li>
          </ul>
        </div>

        <div className="p-4 bg-cyan-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-cyan-600 animate-pulse" />
            <h3 className="font-semibold">Forecasting Models</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>ARIMA Models</li>
            <li>Exponential Smoothing</li>
            <li>Prophet</li>
            <li>Neural Networks</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-teal-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <LineChart className="h-5 w-5 text-teal-600 animate-pulse" />
            <h3 className="font-semibold">Evaluation Metrics</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>MAPE</li>
            <li>RMSE</li>
            <li>MAE</li>
            <li>Forecast Accuracy</li>
          </ul>
        </div>

        <div className="p-4 bg-emerald-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <BarChart className="h-5 w-5 text-emerald-600 animate-pulse" />
            <h3 className="font-semibold">Visualization</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>Time Series Plots</li>
            <li>Seasonal Decomposition</li>
            <li>ACF/PACF Plots</li>
            <li>Forecast Intervals</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesSection;