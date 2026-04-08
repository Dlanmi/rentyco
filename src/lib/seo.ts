import type { Metadata } from 'next';
import { SITE, SITE_URL, absoluteUrl } from './site';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface PageSeoOptions {
  title: string;
  description: string;
  path: string;
  ogSlug?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  listing?: { priceCop: number };
}

/**
 * Builds Next.js Metadata for a page. Keeps OG image naming consistent
 * with the /og/[slug].png route and preserves the hreflang + canonical
 * setup from the Astro layout.
 */
export function buildMetadata(opts: PageSeoOptions): Metadata {
  const canonical = absoluteUrl(opts.path);
  const ogImage = opts.ogImage || absoluteUrl(`/og/${opts.ogSlug || 'default'}.png`);
  const robots = opts.noindex
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
        'max-video-preview': -1,
      };

  return {
    metadataBase: new URL(SITE_URL),
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical,
      languages: {
        'es-CO': canonical,
        es: canonical,
        'x-default': canonical,
      },
    },
    robots,
    openGraph: {
      type: opts.ogType || 'website',
      siteName: SITE.name,
      title: opts.title,
      description: opts.description,
      url: canonical,
      locale: 'es_CO',
      alternateLocale: ['es_ES'],
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: opts.title,
        },
      ],
      ...(opts.ogType === 'article' && {
        publishedTime: opts.publishedTime,
        modifiedTime: opts.modifiedTime,
        authors: opts.author ? [opts.author] : undefined,
        section: opts.section,
        tags: opts.tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [ogImage],
      site: SITE.twitter,
      creator: SITE.twitter,
    },
    other: {
      'format-detection': 'telephone=no',
      ...(opts.listing && {
        'product:price:amount': String(opts.listing.priceCop),
        'product:price:currency': 'COP',
      }),
    },
  };
}

/* ── JSON-LD schema builders ── */

export function buildWebPageSchema(opts: {
  title: string;
  description: string;
  path: string;
  ogSlug?: string;
  hasBreadcrumb?: boolean;
}): Record<string, unknown> {
  const canonical = absoluteUrl(opts.path);
  const ogImage = absoluteUrl(`/og/${opts.ogSlug || 'default'}.png`);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: opts.title,
    description: opts.description,
    inLanguage: SITE.locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImage },
    ...(opts.hasBreadcrumb && { breadcrumb: { '@id': `${canonical}#breadcrumb` } }),
  };
}

export function buildBreadcrumbSchema(
  path: string,
  items: BreadcrumbItem[]
): Record<string, unknown> {
  const canonical = absoluteUrl(path);
  return {
    '@context': 'https://schema.org',
    '@id': `${canonical}#breadcrumb`,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.url.startsWith('http') ? b.url : absoluteUrl(b.url),
    })),
  };
}

export const ORGANIZATION_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/icon.svg`,
    width: 64,
    height: 64,
  },
  description:
    'Sistema de scoring alternativo que permite a los colombianos arrendar sin codeudor, basado en historial de pagos reales.',
  foundingDate: SITE.foundingDate,
  areaServed: { '@type': 'Country', name: 'Colombia' },
  address: {
    '@type': 'PostalAddress',
    addressCountry: SITE.country,
    addressLocality: SITE.city,
  },
  slogan: 'El arriendo sin barreras',
  knowsAbout: ['Arriendo en Colombia', 'Scoring alternativo', 'Arrendamiento sin codeudor', 'Renty Score'],
  sameAs: ['https://x.com/rentyco_app'],
  knowsLanguage: SITE.locale,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      email: SITE.email,
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'es'],
      areaServed: SITE.country,
    },
  ],
};

export const WEBSITE_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE.name,
  description: SITE.tagline + ' en Colombia',
  inLanguage: SITE.locale,
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/bogota/arriendos?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};
