'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Blip {
  name: string;
  x: number;
  y: number;
  blip: string;
}

interface MapProps {
  blips?: Blip[];
  centerX?: number;
  centerY?: number;
  zoom?: number;
  className?: string;
}

export default function Map({ 
  blips = [], 
  centerX, 
  centerY, 
  zoom = 4,
  className = ''
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' && 
        (args[0].includes('Failed to load resource') || 
         args[0].includes('404') ||
         args[0].includes('GET') && args[0].includes('images/map'))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    const CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
      projection: L.Projection.LonLat,
      scale: (zoom: number) => Math.pow(2, zoom),
      distance: (pos1: L.LatLng, pos2: L.LatLng) => {
        const xDiff = pos2.lng - pos1.lng;
        const yDiff = pos2.lat - pos1.lat;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      },
      transformation: new L.Transformation(0.01423, 58.89, -0.01423, 119.4),
      infinite: true
    });

    const tileLayer = L.tileLayer('/images/map/{z}/{x}x{y}.png', {
      minZoom: 2,
      maxZoom: 6,
      noWrap: true,
      // @ts-ignore
      continuousWorld: false,
      id: 'map',
      errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    });

    const layerGroup = L.layerGroup();
    layerGroupRef.current = layerGroup;

    const map = L.map(mapRef.current, {
      crs: CUSTOM_CRS as any,
      minZoom: 2,
      maxZoom: 6,
      zoom: zoom,
      preferCanvas: true,
      layers: [tileLayer, layerGroup],
      center: [centerY || 0, centerX || 0],
      attributionControl: false,
      zoomControl: true,
      scrollWheelZoom: true,
      maxBounds: [[-5000, -5000], [8000, 5000]],
      maxBoundsViscosity: 1.0
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      console.error = originalError;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    blips.forEach((blip) => {
      const icon = L.icon({
        iconUrl: `/images/blips/${blip.blip}.png`,
        iconSize: [30, 30],
        iconAnchor: [15, 20],
        popupAnchor: [0, -25]
      });

      const marker = L.marker([blip.y, blip.x], { icon })
        .addTo(layerGroupRef.current!)
        .bindPopup(blip.name);

      const iconElement = marker.getElement();
      if (iconElement) {
        const img = iconElement.querySelector('img');
        if (img) {
          img.onerror = () => {
            img.style.display = 'none';
          };
        }
      }
    });
  }, [blips]);

  useEffect(() => {
    if (mapInstanceRef.current && centerX !== undefined && centerY !== undefined) {
      mapInstanceRef.current.setView([centerY, centerX], zoom);
    }
  }, [centerX, centerY, zoom]);

  return <div ref={mapRef} className={className} />;
}
