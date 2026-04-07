/**
 * City config used for hero copy, zones, default map centers.
 * Persistent DB-backed config lives in `cities` + `neighborhoods` tables;
 * this module holds presentational copy that doesn't fit in the DB.
 */
export interface CityConfig {
  slug: string;
  name: string;
  geoRegion: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSub: string;
  heroImage: string;
  mapCenter: [number, number];
  mapZoom: number;
  stats: { label: string; value: string; count?: number }[];
  featuredZones: { slug: string; name: string; image: string; blurb: string }[];
}

export const CITIES: Record<string, CityConfig> = {
  bogota: {
    slug: 'bogota',
    name: 'Bogotá',
    geoRegion: 'CO-DC',
    heroEyebrow: 'Arriendo transparente · sin codeudor',
    heroTitle: 'Bogotá',
    heroSub: 'Arriendos en Chapinero, Chicó, Usaquén, Cedritos y más.',
    heroImage: '/images/cities/bogota-hero.jpg',
    mapCenter: [4.6533, -74.0836],
    mapZoom: 12,
    stats: [
      { label: 'Inmuebles activos', value: '0', count: 0 },
      { label: 'Barrios cubiertos', value: '15', count: 15 },
      { label: 'Tiempo promedio', value: '2 días' },
      { label: 'Sin codeudor', value: '100%' },
    ],
    featuredZones: [
      { slug: 'chapinero',  name: 'Chapinero',  image: '/images/zones/chapinero.jpg',  blurb: 'Vida nocturna y transporte' },
      { slug: 'chico',      name: 'Chicó',      image: '/images/zones/chico.jpg',      blurb: 'Tranquilo y verde' },
      { slug: 'usaquen',    name: 'Usaquén',    image: '/images/zones/usaquen.jpg',    blurb: 'Gastronomía y mercado' },
      { slug: 'cedritos',   name: 'Cedritos',   image: '/images/zones/cedritos.jpg',   blurb: 'Familiar y conectado' },
      { slug: 'teusaquillo',name: 'Teusaquillo',image: '/images/zones/teusaquillo.jpg',blurb: 'Cultural y arbolado' },
      { slug: 'salitre',    name: 'Salitre',    image: '/images/zones/salitre.jpg',    blurb: 'Parques y avenidas' },
    ],
  },
};

export function getCity(slug: string): CityConfig | null {
  return CITIES[slug] ?? null;
}

export function listCities(): CityConfig[] {
  return Object.values(CITIES);
}
