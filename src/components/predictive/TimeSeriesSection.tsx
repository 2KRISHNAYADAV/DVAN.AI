
import React, { useState } from 'react';
import { Clock, TrendingUp, LineChart, BarChart, ArrowUpDown, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TimeSeriesSection = () => {
  const [activeExample, setActiveExample] = useState<string>('financial');

  const examples = {
    financial: {
      title: "Financial Forecasting",
      description: "Predicting stock prices and market trends",
      metrics: ["Daily Returns", "Volume", "Price Volatility"]
    },
    retail: {
      title: "Retail Analytics",
      description: "Analyzing sales patterns and seasonal trends",
      metrics: ["Daily Sales", "Customer Traffic", "Inventory Levels"]
    },
    weather: {
      title: "Weather Analysis",
      description: "Forecasting weather patterns and climate trends",
      metrics: ["Temperature", "Precipitation", "Wind Speed"]
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Introduction Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-700">
            Understanding Time Series Analysis
          </CardTitle>
          <CardDescription>
            Time series analysis is a statistical technique for analyzing time-ordered data points to extract meaningful patterns and predict future values.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Time series data consists of observations collected at regular intervals, making it crucial for understanding trends and making informed predictions.
          </p>
        </CardContent>
      </Card>

      {/* Key Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-sky-50 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-600" />
              <CardTitle className="text-lg">Trend Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The long-term movement or direction in time series data, showing whether values generally increase, decrease, or remain stable over time.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-sky-500" />
                Linear Trends
              </li>
              <li className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-sky-500" />
                Non-linear Patterns
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Seasonality</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Regular and predictable patterns that repeat over fixed time intervals, such as daily, weekly, or yearly cycles.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                Periodic Patterns
              </li>
              <li className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                Seasonal Variations
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-700">
            Time Series Analysis Techniques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ma">
              <AccordionTrigger>Moving Averages (MA)</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Moving averages smooth out short-term fluctuations to highlight longer-term trends or cycles.
                </p>
                <ul className="space-y-2 text-sm ml-4 list-disc">
                  <li>Simple Moving Average (SMA)</li>
                  <li>Exponential Moving Average (EMA)</li>
                  <li>Weighted Moving Average (WMA)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="arima">
              <AccordionTrigger>ARIMA Models</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  AutoRegressive Integrated Moving Average models combine differencing with autoregression and moving average models.
                </p>
                <ul className="space-y-2 text-sm ml-4 list-disc">
                  <li>Autoregressive (AR) component</li>
                  <li>Integration (I) for stationarity</li>
                  <li>Moving Average (MA) component</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ets">
              <AccordionTrigger>Exponential Smoothing (ETS)</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  A time series forecasting method that gives more weight to recent observations and less weight to older ones.
                </p>
                <ul className="space-y-2 text-sm ml-4 list-disc">
                  <li>Single Exponential Smoothing</li>
                  <li>Double Exponential Smoothing (Holt's method)</li>
                  <li>Triple Exponential Smoothing (Holt-Winters' method)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Real-world Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-700">
            Real-world Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(examples).map((key) => (
              <Button
                key={key}
                variant={activeExample === key ? "default" : "outline"}
                onClick={() => setActiveExample(key)}
                className="transition-all"
              >
                {examples[key as keyof typeof examples].title}
              </Button>
            ))}
          </div>

          <Card className="bg-[#0E2931]">
            <CardHeader>
              <CardTitle className="text-lg">
                {examples[activeExample as keyof typeof examples].title}
              </CardTitle>
              <CardDescription>
                {examples[activeExample as keyof typeof examples].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-medium mb-2">Key Metrics:</h4>
              <ul className="space-y-2 text-sm ml-4 list-disc">
                {examples[activeExample as keyof typeof examples].metrics.map((metric, index) => (
                  <li key={index}>{metric}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Conclusion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-700">
            Why Time Series Analysis Matters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Time series analysis is fundamental to data-driven decision making, enabling organizations to:
          </p>
          <ul className="space-y-2 ml-4 list-disc text-muted-foreground">
            <li>Make informed predictions about future trends</li>
            <li>Identify seasonal patterns and cyclical behaviors</li>
            <li>Understand the impact of external factors on data patterns</li>
            <li>Optimize resource allocation and planning</li>
            <li>Monitor and respond to changes in key metrics over time</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSeriesSection;
