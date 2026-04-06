import type { NextConfig } from 'next';

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.rentyco.app https://*.r2.cloudflarestorage.com https://*.r2.dev https://lh3.googleusercontent.com https://*.basemaps.cartocdn.com",
  "font-src 'self'",
  "connect-src 'self' https://aqnmdizerxmvtrpaxmio.supabase.co wss://aqnmdizerxmvtrpaxmio.supabase.co https://cdn.rentyco.app https://*.r2.cloudflarestorage.com https://*.basemaps.cartocdn.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-src https://aqnmdizerxmvtrpaxmio.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Content-Security-Policy-Report-Only', value: csp },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
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
  ],
  experimental: {
    optimizePackageImports: ['gsap', '@gsap/react'],
    serverActions: {
      allowedOrigins: ['rentyco.app', 'www.rentyco.app'],
    },
  },
};

export default nextConfig;
