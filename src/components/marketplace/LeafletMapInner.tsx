'use client';

import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LeafletMapInner({
  lat,
  lng,
  zoom = 14,
}: {
  lat: number;
  lng: number;
  zoom?: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-border">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="aspect-[16/9] w-full"
        style={{ background: 'var(--color-sand-dark)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Circle
          center={[lat, lng]}
          radius={350}
          pathOptions={{ color: '#0D6B58', fillColor: '#0D6B58', fillOpacity: 0.18, weight: 2 }}
        />
      </MapContainer>
    </div>
  );
}
