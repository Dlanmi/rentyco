/**
 * Site-wide constants. Single source of truth for URLs, brand data,
 * and contact info — imported by layout metadata, OG images, JSON-LD, etc.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://rentyco.app';

export const SITE = {
  name: 'Renty',
  legalName: 'Renty SAS',
  locale: 'es-CO',
  description: 'El arriendo sin barreras en Colombia',
  tagline: 'El arriendo sin barreras',
  twitter: '@rentyco_app',
  email: 'soporte@rentyco.app',
  city: 'Bogotá',
  country: 'CO',
  foundingDate: '2026',
  themeColor: '#0D6B58',
} as const;

export const SOCIAL = {
  twitter: 'https://x.com/rentyco_app',
  instagram: 'https://instagram.com/rentyco',
  linkedin: 'https://linkedin.com/company/rentyco',
} as const;

export const absoluteUrl = (path = '/'): string => {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
