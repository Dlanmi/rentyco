/**
 * Sentry client-side init. Runs in the browser for unhandled errors,
 * promise rejections, and user-interaction traces.
 *
 * To activate: set NEXT_PUBLIC_SENTRY_DSN in your env. Without it, Sentry
 * is a no-op so local dev stays quiet.
 */
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.replayIntegration({ maskAllText: false, blockAllMedia: true })],
    ignoreErrors: [
      // Browser noise — third-party / extensions / user quirks
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
    ],
  });
}
