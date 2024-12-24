import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface MapVisualizationProps {
  data: any[];
  geoLevel?: 'country' | 'state';
}

const MapVisualization = ({ data, geoLevel = 'country' }: MapVisualizationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  
  // Default public token (this is a public demo token, replace with your own in production)
  const defaultToken = 'pk.eyJ1Ijoia3Jpc2huYXlhZGF2IiwiYSI6ImNsdGVxOWF0cjE5ZWsyam8wbm5xZnV0Y2QifQ.YfY_vI6z8nQF9kVY0qfBtA';

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      if (!mapContainer.current || !isMounted) return;

      try {
        // Clean up existing map instance
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }

        mapboxgl.accessToken = defaultToken;
        
        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [0, 20],
          zoom: 1.5,
        });

        // Only store the map instance if component is still mounted
        if (isMounted) {
          mapInstance.current = newMap;

          newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
          newMap.addControl(new mapboxgl.FullscreenControl());

          // Add atmosphere and terrain for better visualization
          newMap.on('load', () => {
            if (!isMounted) return;
            
            newMap.setFog({
              'color': 'rgb(186, 210, 235)',
              'high-color': 'rgb(36, 92, 223)',
              'horizon-blend': 0.02
            });

            newMap.addSource('mapbox-dem', {
              'type': 'raster-dem',
              'url': 'mapbox://mapbox.terrain-rgb'
            });

            newMap.setTerrain({
              'source': 'mapbox-dem',
              'exaggeration': 1.5
            });
          });
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        if (isMounted) {
          toast.error('Error initializing map. Please check network connection.');
        }
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
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