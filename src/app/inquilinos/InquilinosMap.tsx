'use client';

import dynamic from 'next/dynamic';
import type { ListingMapMarker } from '@/lib/db/listings.repository';

/**
 * Airbnb-style multi-marker map for /inquilinos.
 * Leaflet is dynamic-imported (SSR off) because it touches `window`.
 */
const Inner = dynamic(() => import('./InquilinosMapInner'), {
  ssr: false,
  loading: () => (
    <div
      aria-live="polite"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, var(--color-sand) 0%, var(--color-sand-dark) 60%, var(--color-sand) 100%)',
      }}
    >
      {/* subtle grid — matches map visual while tiles load */}
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-40">
        <defs>
          <pattern id="inq-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(13,107,88,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#inq-grid)" />
      </svg>
      <div className="relative flex flex-col items-center gap-3 text-center">
        <span
          className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal"
          style={{ animation: 'renty-pulse-dot 2s infinite' }}
        >
          <span className="h-3 w-3 rounded-full bg-teal" />
        </span>
        <span className="font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-ink-muted">
          Cargando arriendos verificados…
        </span>
      </div>
    </div>
  ),
});

interface Props {
  markers: ListingMapMarker[];
  center?: [number, number];
  zoom?: number;
}

export default function InquilinosMap({
  markers,
  center = [4.667, -74.064], // Bogotá center
  zoom = 12,
}: Props) {
  if (!markers.length) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-sand-dark">
        <p className="max-w-[24ch] text-center font-body text-[13px] text-ink-muted">
          Pronto publicaremos los primeros arriendos en Bogotá. Apúntate a la lista.
        </p>
      </div>
    );
  }
  return <Inner markers={markers} center={center} zoom={zoom} />;
}
