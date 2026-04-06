import type { Metadata, Viewport } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE, SITE_URL } from '@/lib/site';
import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';
import ScrollProgress from '@/components/layout/ScrollProgress';
import FloatingCTA from '@/components/layout/FloatingCTA';
import BackToTop from '@/components/layout/BackToTop';
import GlobalScrollController from '@/components/layout/GlobalScrollController';
import GlobalGsapBindings from '@/components/layout/GlobalGsapBindings';
import ConfettiProvider from '@/components/layout/ConfettiProvider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/Toaster';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif-display',
  display: 'swap',
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
    default: 'Renty | Arrienda sin codeudor en Colombia',
    template: '%s | Renty',
  },
  description:
    'Renty es el sistema de scoring alternativo que permite a los colombianos arrendar sin codeudor. Basado en historial de pagos reales, no solo en Datacrédito.',
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
      data-scroll-behavior="smooth"
      className={`scroll-smooth ${dmSans.variable} ${dmSerif.variable}`}
    >
      <body className="min-h-screen">
        <NuqsAdapter>
          <JsonLd data={ORGANIZATION_SCHEMA} id="ld-organization" />
          <JsonLd data={WEBSITE_SCHEMA} id="ld-website" />

          <a href="#main-content" className="skip-nav">Ir al contenido principal</a>
          <ScrollProgress />
          {children}
          <FloatingCTA />
          <BackToTop />

          <GlobalScrollController />
          <GlobalGsapBindings />
          <ConfettiProvider />
          <Toaster />
        </NuqsAdapter>
        <SpeedInsights />
      </body>
    </html>
  );
}
