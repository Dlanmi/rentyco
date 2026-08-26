import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/site';

/**
 * RFC 9727 — API Catalog for automated API discovery.
 * Serves /.well-known/api-catalog with application/linkset+json.
 */
export function GET() {
  const catalog = {
    linkset: [
      {
        anchor: `${SITE_URL}/api/report`,
        'service-desc': [
          { href: `${SITE_URL}/.well-known/openapi.json` },
        ],
        'service-doc': [
          { href: `${SITE_URL}/.well-known/agent-skills/index.json` },
        ],
      },
    ],
  };

  return NextResponse.json(catalog, {
    headers: {
      'Content-Type': 'application/linkset+json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
