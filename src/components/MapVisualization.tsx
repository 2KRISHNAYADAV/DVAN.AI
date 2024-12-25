import React, { useEffect, useRef, useState } from 'react';
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
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  
  // Default public token
  const defaultToken = 'pk.eyJ1Ijoia3Jpc2huYXlhZGF2MDkyIiwiYSI6ImNtNTJwdDVxbjF3NWoya3A3ZnM4eXU3aDAifQ.5Porn99vKusH4MDAhbK1Wg';

  // Function to get color based on percentage
  const getColor = (percentage: number) => {
    if (percentage >= 75) return '#ef4444'; // red
    if (percentage >= 50) return '#f97316'; // orange
    if (percentage >= 25) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  // Initialize map
  useEffect(() => {
    mapboxgl.accessToken = defaultToken;

    if (!mapContainer.current || map) return;

    try {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 1.5,
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      newMap.addControl(new mapboxgl.FullscreenControl());

      newMap.on('load', () => {
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

      setMap(newMap);
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Error initializing map. Please check network connection.');
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, []);

  // Update map markers when data changes
  useEffect(() => {
    if (!map || !data) return;

    // Remove existing markers
    const markers = document.getElementsByClassName('marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // Process and add new markers
    data.forEach(item => {
      if (!item.latitude || !item.longitude || !item.percentage || !item.country) return;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = getColor(item.percentage);
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

      // Create popup content
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold">${item.country}</h3>
          <p class="text-sm">Percentage: ${item.percentage}%</p>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(popupContent);

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([item.longitude, item.latitude])
        .setPopup(popup)
        .addTo(map);
    });

  }, [map, data, geoLevel]);

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