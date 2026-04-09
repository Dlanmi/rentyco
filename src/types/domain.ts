/**
 * Hand-written domain types used across DAL, Server Actions, and UI.
 * Keep in sync with migration schema. Eventually replaceable by `supabase gen types`.
 */

export type PropertyType = 'apartamento' | 'casa' | 'apartaestudio' | 'habitacion' | 'estudio';
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'paused' | 'archived';
export type UserRole = 'tenant' | 'landlord' | 'admin';
export type InquiryStatus = 'new' | 'contacted' | 'closed';

export interface ListingImage {
  id: string;
  url: string;
  blurhash: string | null;
  width: number;
  height: number;
  altText: string | null;
  order: number;
}

export interface ListingCard {
  id: string;
  slug: string;
  citySlug: string;
  title: string;
  neighborhood: string | null;
  neighborhoodSlug: string | null;
  priceCop: number;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  propertyType: PropertyType;
  isFurnished: boolean;
  images: ListingImage[];
  isFavorited?: boolean;
  ownerVerified?: boolean;
  acceptsRentyScore: boolean;
}

export interface ListingDetail extends ListingCard {
  description: string;
  adminFeeCop: number | null;
  depositCop: number | null;
  floor: number | null;
  parking: number;
  estrato: number | null;
  antiguedad: number | null;
  amenities: string[];
  rules: string | null;
  lat: number | null;
  lng: number | null;
  status: ListingStatus;
  publishedAt: string | null;
  owner: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
    verified: boolean;
    memberSince: string;
  };
}

export interface City {
  id: number;
  slug: string;
  name: string;
  active: boolean;
}

export interface Neighborhood {
  id: number;
  cityId: number;
  slug: string;
  name: string;
  lat: number | null;
  lng: number | null;
}

export interface Inquiry {
  id: string;
  listingId: string;
  userId: string;
  message: string;
  contactPhone: string | null;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

// Result helpers for Server Actions
export type ActionErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'LIMIT_EXCEEDED'
  | 'CONFLICT'
  | 'UNKNOWN';

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; code: ActionErrorCode; message: string };

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const err = (code: ActionErrorCode, message: string): Result<never> => ({
  ok: false,
  code,
  message,
});

export const AMENITY_OPTIONS = [
  // Servicios del edificio/conjunto
  { value: 'elevator',      label: 'Ascensor',          group: 'edificio', types: ['apartamento', 'apartaestudio', 'estudio'] },
  { value: 'security',      label: 'Portería 24/7',     group: 'edificio', types: ['apartamento', 'apartaestudio', 'estudio', 'casa'] },
  { value: 'gym',           label: 'Gimnasio',          group: 'edificio', types: ['apartamento', 'apartaestudio', 'estudio', 'casa'] },
  { value: 'pool',          label: 'Piscina',           group: 'edificio', types: ['apartamento', 'apartaestudio', 'estudio', 'casa'] },
  { value: 'bbq',           label: 'Zona BBQ',          group: 'edificio', types: ['apartamento', 'apartaestudio', 'estudio', 'casa'] },
  { value: 'coworking',     label: 'Coworking',         group: 'edificio', types: ['apartamento', 'apartaestudio', 'estudio'] },
  { value: 'rooftop',       label: 'Terraza común',     group: 'edificio', types: ['apartamento', 'apartaestudio', 'estudio'] },
  { value: 'storage',       label: 'Depósito/Útil',     group: 'edificio', types: ['apartamento', 'casa'] },
  // Interior del inmueble
  { value: 'balcony',       label: 'Balcón',            group: 'interior', types: ['apartamento', 'apartaestudio', 'estudio'] },
  { value: 'terrace',       label: 'Terraza privada',   group: 'interior', types: ['apartamento', 'casa'] },
  { value: 'kitchen',       label: 'Cocina integral',   group: 'interior', types: ['apartamento', 'apartaestudio', 'estudio', 'casa'] },
  { value: 'laundry',       label: 'Zona de lavado',    group: 'interior', types: ['apartamento', 'casa', 'apartaestudio'] },
  { value: 'ac',            label: 'Aire acondicionado',group: 'interior', types: ['apartamento', 'casa', 'apartaestudio', 'estudio'] },
  { value: 'gas',           label: 'Gas natural',       group: 'interior', types: ['apartamento', 'casa', 'apartaestudio'] },
  { value: 'closets',       label: 'Closets',           group: 'interior', types: ['apartamento', 'casa', 'apartaestudio'] },
  { value: 'wifi',          label: 'WiFi incluido',     group: 'servicios', types: ['apartamento', 'casa', 'apartaestudio', 'estudio', 'habitacion'] },
  { value: 'pets',          label: 'Acepta mascotas',   group: 'servicios', types: ['apartamento', 'casa', 'apartaestudio', 'estudio', 'habitacion'] },
  // Casa específicos
  { value: 'garden',        label: 'Jardín',            group: 'exterior', types: ['casa'] },
  { value: 'patio',         label: 'Patio',             group: 'exterior', types: ['casa'] },
  // Habitación específicos
  { value: 'private_bath',  label: 'Baño privado',      group: 'habitacion', types: ['habitacion'] },
  { value: 'kitchen_access',label: 'Acceso a cocina',   group: 'habitacion', types: ['habitacion'] },
  { value: 'utils_included',label: 'Servicios incluidos', group: 'habitacion', types: ['habitacion'] },
] as const;

export type AmenityKey = (typeof AMENITY_OPTIONS)[number]['value'];

/** Get amenities relevant for a property type */
export function getAmenitiesForType(type: PropertyType): typeof AMENITY_OPTIONS[number][] {
  return AMENITY_OPTIONS.filter((a) => (a.types as readonly string[]).includes(type));
}
