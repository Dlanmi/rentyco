'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import L, { type Map as LeafletMap } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { formatCOP } from '@/lib/format';
import type { ListingMapMarker } from '@/lib/db/listings.repository';

interface Props {
  markers: ListingMapMarker[];
  center: [number, number];
  zoom?: number;
}

function priceShort(cop: number): string {
  if (cop >= 1_000_000) {
    const m = cop / 1_000_000;
    return `$${m.toFixed(m < 10 ? 1 : 0)}M`;
  }
  if (cop >= 1_000) return `$${Math.round(cop / 1_000)}k`;
  return `$${cop}`;
}

/**
 * Custom `divIcon` — Airbnb-style price pill.
 * Teal by default, white text when selected so it pops on the map.
 */
function bubbleIcon(text: string, selected: boolean): L.DivIcon {
  const bg = selected ? '#1C1917' : '#FFFFFF';
  const fg = selected ? '#FFFFFF' : '#1C1917';
  const border = selected ? '#1C1917' : '#0D6B58';
  const shadow = selected
    ? '0 8px 20px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.12)'
    : '0 4px 12px rgba(0,0,0,0.14), 0 1.5px 3px rgba(0,0,0,0.08)';
  return L.divIcon({
    className: 'renty-map-bubble',
    html: `<span style="
      display:inline-flex;align-items:center;justify-content:center;gap:4px;
      padding:8px 14px;border-radius:9999px;
      min-width:54px;min-height:32px;
      background:${bg};color:${fg};
      border:2px solid ${border};
      font-family:'JetBrains Mono', ui-monospace, monospace;
      font-weight:700;font-size:12px;letter-spacing:-0.01em;
      white-space:nowrap;
      box-shadow:${shadow};
      transform:translate(-50%,-50%) scale(${selected ? 1.06 : 1});
      transition:transform 200ms var(--ease-out-expo), box-shadow 200ms;
    ">${text}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/** Child that imperatively pans/zooms when `selectedId` changes */
function Recenter({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.panTo(target, { animate: true, duration: 0.35 });
  }, [target, map]);
  return null;
}

/** Fits the map bounds to all markers once on mount. */
function FitToMarkers({ markers }: { markers: ListingMapMarker[] }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || markers.length < 2) return;
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15, animate: false });
    fitted.current = true;
  }, [map, markers]);
  return null;
}

function ZoomButtons() {
  const map = useMap();
  return (
    <div className="pointer-events-auto absolute right-3 top-3 z-[400] flex flex-col gap-1 rounded-xl border border-border bg-white/95 p-1 shadow-md backdrop-blur">
      <button
        type="button"
        aria-label="Acercar mapa"
        onClick={() => map.zoomIn()}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-sand"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <div className="mx-auto h-px w-5 bg-border" />
      <button
        type="button"
        aria-label="Alejar mapa"
        onClick={() => map.zoomOut()}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-sand"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </button>
    </div>
  );
}

export default function InquilinosMapInner({ markers, center, zoom = 12 }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(markers[0]?.id ?? null);
  const mapRef = useRef<LeafletMap | null>(null);

  const selected = useMemo(
    () => markers.find((m) => m.id === selectedId) ?? null,
    [markers, selectedId]
  );

  const target: [number, number] | null = selected ? [selected.lat, selected.lng] : null;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: '100%', width: '100%', background: '#F0EDE5' }}
        ref={(m) => {
          mapRef.current = m;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <FitToMarkers markers={markers} />
        <Recenter target={target} />
        <ZoomButtons />
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={bubbleIcon(priceShort(m.priceCop), m.id === selectedId)}
            eventHandlers={{
              click: () => setSelectedId(m.id),
            }}
          />
        ))}
      </MapContainer>

      {/* Floating listing card — mirrors the selected marker, Airbnb-style */}
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 z-[400] sm:right-auto sm:w-[340px]">
          <div className="relative rounded-2xl border border-border bg-white/95 shadow-xl backdrop-blur-md">
            <Link
              href={`/${selected.citySlug}/arriendos/${selected.slug}`}
              className="flex items-center gap-3.5 p-3 pr-10 text-left no-underline transition-all duration-200 hover:-translate-y-0.5"
            >
              <div
                className="h-16 w-16 flex-none rounded-xl"
                style={{ background: 'linear-gradient(135deg, #d2c4ad, #8b7a62)' }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-heading text-[14px] font-600 text-ink">
                  {selected.title}
                </div>
                <div className="mt-0.5 truncate font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-muted">
                  {selected.neighborhood ?? '—'} · {selected.bedrooms} hab
                </div>
                <div className="mt-1 font-heading text-[14px] font-600 text-teal">
                  {formatCOP(selected.priceCop)}{' '}
                  <span className="font-400 text-ink-muted">/mes</span>
                </div>
              </div>
            </Link>
            <button
              type="button"
              aria-label="Cerrar tarjeta"
              onClick={() => setSelectedId(null)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-sand hover:text-ink"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Legend — bottom-left (doesn't conflict with zoom controls top-right
          or floating listing card bottom-right on desktop). Hidden when a
          marker is open on mobile so the card has full width. */}
      <div
        className={`pointer-events-none absolute left-3 top-3 z-[399] inline-flex items-center gap-2 rounded-full border border-border bg-white/90 px-3 py-1.5 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-muted backdrop-blur-md ${
          selected ? 'hidden sm:inline-flex' : ''
        }`}
      >
        <span className="inline-block h-2 w-2 rounded-full bg-teal" />
        {markers.length} {markers.length === 1 ? 'arriendo verificado' : 'arriendos verificados'}
      </div>
    </div>
  );
}
