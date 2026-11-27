import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Place, categoryColors } from '../types';

interface MapComponentProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceClick: (place: Place) => void;
  onMapClick: (lat: number, lng: number) => void;
  isAddingMode: boolean;
}

function createCustomIcon(place: Place): L.DivIcon {
  const color = categoryColors[place.category];
  const size = place.visited ? 36 : 28;
  const opacity = place.visited ? 1 : 0.6;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        opacity: ${opacity};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <span style="transform: rotate(45deg); font-size: ${size * 0.4}px;">
          ${place.visited ? '✓' : '?'}
        </span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

export default function MapComponent({ places, selectedPlace, onPlaceClick, onMapClick, isAddingMode }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [59.9343, 30.3351],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isAddingMode) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], {
        icon: createCustomIcon(place),
      });

      marker.on('click', () => {
        onPlaceClick(place);
      });

      markersRef.current!.addLayer(marker);
    });
  }, [places, onPlaceClick]);

  useEffect(() => {
    if (!mapRef.current || !selectedPlace) return;
    mapRef.current.flyTo([selectedPlace.lat, selectedPlace.lng], 15, { duration: 0.8 });
  }, [selectedPlace]);

  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-full ${isAddingMode ? 'cursor-crosshair' : ''}`}
      style={{ minHeight: '400px' }}
    />
  );
}
