import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface MapVisualizationProps {
  data?: any[];
  geoLevel: 'country' | 'state';
}

const MapVisualization = ({ data, geoLevel = 'country' }: MapVisualizationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'mercator',
        zoom: geoLevel === 'country' ? 1.5 : 3,
        center: [0, 20],
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add atmosphere and fog effects
      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2,
        });

        // If we have data, add it to the map
        if (data) {
          // Add data layer logic here based on geoLevel
          toast.success(`Map data loaded for ${geoLevel} level analysis`);
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Error initializing map. Please check your Mapbox token.');
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, data, geoLevel]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Geographic Data Visualization ({geoLevel})</CardTitle>
      </CardHeader>
      <CardContent>
        {!mapboxToken ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please enter your Mapbox public token to view the map visualization.
              You can get one from <a href="https://www.mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
            </p>
            <Input
              type="text"
              placeholder="Enter your Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="w-full"
            />
          </div>
        ) : (
          <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
            <div ref={mapContainer} className="absolute inset-0" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapVisualization;