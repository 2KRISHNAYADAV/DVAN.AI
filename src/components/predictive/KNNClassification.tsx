import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Brain, GitCompare } from 'lucide-react';

const KNNClassification = () => {
  const [neighbors, setNeighbors] = useState([3]);
  const [data, setData] = useState<any>(null);

  // Generate sample dataset (moons-like)
  useEffect(() => {
    const generateMoonData = () => {
      const points = 100;
      const dataset = {
        x1: [],
        y1: [],
        x2: [],
        y2: [],
      };

      for (let i = 0; i < points; i++) {
        const angle1 = (i / points) * Math.PI;
        const angle2 = (i / points) * Math.PI;

        dataset.x1.push(Math.cos(angle1) + Math.random() * 0.2);
        dataset.y1.push(Math.sin(angle1) + Math.random() * 0.2);
        
        dataset.x2.push(1.5 - Math.cos(angle2) + Math.random() * 0.2);
        dataset.y2.push(0.5 - Math.sin(angle2) + Math.random() * 0.2);
      }

      return dataset;
    };

    setData(generateMoonData());
  }, []);

  // Calculate decision boundary (simplified version)
  const calculateDecisionBoundary = () => {
    if (!data) return null;

    const gridSize = 50;
    const x_min = Math.min(...data.x1, ...data.x2) - 0.5;
    const x_max = Math.max(...data.x1, ...data.x2) + 0.5;
    const y_min = Math.min(...data.y1, ...data.y2) - 0.5;
    const y_max = Math.max(...data.y1, ...data.y2) + 0.5;

    const x_range = Array.from({ length: gridSize }, (_, i) => 
      x_min + (i * (x_max - x_min) / (gridSize - 1))
    );
    const y_range = Array.from({ length: gridSize }, (_, i) => 
      y_min + (i * (y_max - y_min) / (gridSize - 1))
    );

    const z = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));

    // Simple k-NN implementation
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const point = [x_range[i], y_range[j]];
        let class1Count = 0;
        const distances = [];

        // Calculate distances to all points
        for (let k = 0; k < data.x1.length; k++) {
          distances.push({
            dist: Math.sqrt(
              Math.pow(point[0] - data.x1[k], 2) + 
              Math.pow(point[1] - data.y1[k], 2)
            ),
            class: 1
          });
          distances.push({
            dist: Math.sqrt(
              Math.pow(point[0] - data.x2[k], 2) + 
              Math.pow(point[1] - data.y2[k], 2)
            ),
            class: 2
          });
        }

        // Sort distances and count nearest neighbors
        distances.sort((a, b) => a.dist - b.dist);
        for (let k = 0; k < neighbors[0]; k++) {
          if (distances[k].class === 1) class1Count++;
        }

        z[j][i] = class1Count > neighbors[0] / 2 ? 1 : 2;
      }
    }

    return { x_range, y_range, z };
  };

  const boundary = calculateDecisionBoundary();

  const plotData = data ? [
    {
      type: 'scatter',
      x: data.x1,
      y: data.y1,
      mode: 'markers',
      name: 'Class 1',
      marker: { color: 'blue', size: 8 }
    },
    {
      type: 'scatter',
      x: data.x2,
      y: data.y2,
      mode: 'markers',
      name: 'Class 2',
      marker: { color: 'red', size: 8 }
    },
    ...(boundary ? [{
      type: 'contour',
      x: boundary.x_range,
      y: boundary.y_range,
      z: boundary.z,
      showscale: false,
      opacity: 0.3,
      contours: {
        coloring: 'lines',
        showlabels: true
      },
      line: { width: 2 },
      colorscale: [[0, 'blue'], [1, 'red']]
    }] : [])
  ] : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            k-NN Classification Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label>Number of Neighbors (k)</Label>
            <Slider
              value={neighbors}
              onValueChange={setNeighbors}
              min={1}
              max={15}
              step={2}
              className="my-4"
            />
            <div className="text-sm text-[#E2E2E0]/70">
              Current k value: {neighbors[0]}
            </div>
          </div>
          <div className="h-[400px] w-full">
            <Plot
              data={plotData}
              layout={{
                title: 'k-NN Decision Boundary',
                xaxis: { title: 'X' },
                yaxis: { title: 'Y' },
                hovermode: 'closest',
                width: undefined,
                height: undefined,
                autosize: true,
                margin: { l: 50, r: 50, b: 50, t: 50 }
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-purple-600" />
            Comparison with ML Regression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold mb-2">k-NN Classification</h3>
              <ul className="space-y-2 text-sm">
                <li>• Non-parametric, instance-based learning</li>
                <li>• No training phase required</li>
                <li>• Suitable for non-linear decision boundaries</li>
                <li>• Memory-intensive for large datasets</li>
                <li>• Prediction time increases with dataset size</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">ML Regression</h3>
              <ul className="space-y-2 text-sm">
                <li>• Predicts continuous values</li>
                <li>• Requires model training</li>
                <li>• Better for linear relationships</li>
                <li>• More efficient predictions</li>
                <li>• Less memory-intensive</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KNNClassification;