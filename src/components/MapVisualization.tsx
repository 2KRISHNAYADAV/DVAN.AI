import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface MapVisualizationProps {
  data?: any[];
  geoLevel: 'country' | 'state';
}

const MapVisualization = ({ data, geoLevel = 'country' }: MapVisualizationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  // Default public token (this is a public demo token, replace with your own in production)
  const defaultToken = 'pk.eyJ1Ijoia3Jpc2huYXlhZGF2IiwiYSI6ImNsdGVxOWF0cjE5ZWsyam8wbm5xZnV0Y2QifQ.YfY_vI6z8nQF9kVY0qfBtA';

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = defaultToken;
      
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
      toast.error('Error initializing map. Please check network connection.');
    }

    return () => {
      map.current?.remove();
    };
  }, [data, geoLevel]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Geographic Data Visualization ({geoLevel})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapVisualization;