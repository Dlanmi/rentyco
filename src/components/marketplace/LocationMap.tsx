'use client';

import dynamic from 'next/dynamic';

/** Dynamically loaded Leaflet map — SSR disabled because Leaflet touches window. */
const LeafletMap = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-sand-dark ring-1 ring-border" />
  ),
});

export function LocationMap({ lat, lng, zoom = 14 }: { lat: number; lng: number; zoom?: number }) {
  return (
    <div>
      <LeafletMap lat={lat} lng={lng} zoom={zoom} />
      <p className="mt-2 font-mono text-[11px] text-ink-muted">
        * Ubicación aproximada. La dirección exacta se comparte al contactar al arrendador.
      </p>
    </div>
  );
}
