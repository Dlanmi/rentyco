/**
 * Sentry server-side init. Runs in Node.js (Server Components, Route Handlers,
 * Server Actions). Set NEXT_PUBLIC_SENTRY_DSN (it's public by design — Sentry
 * DSNs are safe to expose).
 */
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  });
}
