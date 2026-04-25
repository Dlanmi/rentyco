import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://app.posthog.com https://*.posthog.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.rentyco.app https://*.r2.cloudflarestorage.com https://*.r2.dev https://lh3.googleusercontent.com https://*.basemaps.cartocdn.com",
  "font-src 'self'",
  "connect-src 'self' https://aqnmdizerxmvtrpaxmio.supabase.co wss://aqnmdizerxmvtrpaxmio.supabase.co https://cdn.rentyco.app https://*.r2.cloudflarestorage.com https://*.basemaps.cartocdn.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://app.posthog.com https://*.posthog.com https://*.upstash.io",
  "frame-src https://aqnmdizerxmvtrpaxmio.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "worker-src 'self' blob:",
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Content-Security-Policy', value: csp },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // Skip the Next.js Image optimizer in dev — fetching listing images from
    // the R2 *.r2.dev origin is slow (>7s) and triggers TimeoutError + 500
    // responses on /_next/image. Production keeps full AVIF/WebP optimization
    // via the Cloudflare CDN configured by NEXT_PUBLIC_CDN_BASE.
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.rentyco.app' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  serverExternalPackages: ['sharp'],
  headers: async () => [
    { source: '/(.*)', headers: securityHeaders },
    // security.txt: ensure the right content type + short cache.
    {
      source: '/.well-known/security.txt',
      headers: [
        { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
        { key: 'Cache-Control', value: 'public, max-age=86400' },
      ],
    },
  ],
  redirects: async () => [
    // Lista de espera legacy: unified into the renty-score wizard.
    { source: '/lista-de-espera', destination: '/renty-score/formulario', permanent: true },
  ],
  experimental: {
    optimizePackageImports: ['gsap', '@gsap/react', 'lucide-react', 'embla-carousel-react'],
    serverActions: {
      allowedOrigins: ['rentyco.app', 'www.rentyco.app'],
    },
  },
};

// Wrap with Sentry only when the DSN is present — otherwise keep the config
// untouched so local dev / preview deploys without Sentry env vars still build.
const exportedConfig = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      widenClientFileUpload: true,
      tunnelRoute: '/monitoring',
      disableLogger: true,
      automaticVercelMonitors: true,
    })
  : nextConfig;

export default exportedConfig;
