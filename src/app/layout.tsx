import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { SITE, SITE_URL } from '@/lib/site';
import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import ScrollProgress from '@/components/layout/ScrollProgress';
import { DeferredComponents } from '@/components/layout/DeferredComponents';
import ConfettiProvider from '@/components/layout/ConfettiProvider';
import AnalyticsProvider from '@/components/layout/AnalyticsProvider';
import { Toaster } from '@/components/ui/Toaster';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif-display',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: SITE.themeColor,
  colorScheme: 'light',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Renty | Arrienda sin Codeudor en Colombia — Scoring Alternativo',
    template: '%s | Renty',
  },
  description:
    'Arrienda sin codeudor ni fiador en Colombia. Renty evalúa tu historial de pagos reales y te da un puntaje como inquilino en 3 minutos. Calcula tu Renty Score gratis.',
  applicationName: SITE.name,
  appleWebApp: {
    title: SITE.name,
    capable: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/icon.svg', color: SITE.themeColor }],
  },
  manifest: '/site.webmanifest',
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-CO"
      className={`${dmSans.variable} ${dmSerif.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://cdn.rentyco.app" />
        <link rel="preconnect" href="https://aqnmdizerxmvtrpaxmio.supabase.co" />
      </head>
      <body className="min-h-screen">
        <noscript><style>{'[data-reveal],[data-reveal-stagger]>*{opacity:1!important;transform:none!important}'}</style></noscript>
          <JsonLd data={ORGANIZATION_SCHEMA} id="ld-organization" />
          <JsonLd data={WEBSITE_SCHEMA} id="ld-website" />

          <a href="#main-content" className="skip-nav">Ir al contenido principal</a>
          <ScrollProgress />
          {children}
          <DeferredComponents />
          <ConfettiProvider />
          <Toaster />
        <SpeedInsights />
        <Analytics />
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
      </body>
    </html>
  );
}
