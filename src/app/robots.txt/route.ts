import { SITE_URL } from '@/lib/site';

/**
 * Serves /robots.txt as a route handler so we can include non-standard
 * directives: Content-Signal (AI content usage preferences) and
 * Agentmap (ARD manifest pointer).
 */
export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /cuenta/
Disallow: /entrar
Disallow: /bienvenido

Sitemap: ${SITE_URL}/sitemap.xml

# AI Content Usage Preferences (https://contentsignals.org/)
Content-Signal: ai-train=no, search=yes, ai-input=yes

# Agentic Resource Discovery manifest
Agentmap: ${SITE_URL}/.well-known/ai-catalog.json
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
