/**
 * Next.js instrumentation hook — runs once when the server boots in any
 * runtime (Node.js + Edge). Routes Sentry init to the right runtime file.
 *
 * Activated automatically by Next.js. No explicit import needed elsewhere.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

// Forward uncaught request errors to Sentry (Next 16+ hook).
export async function onRequestError(
  err: unknown,
  request: {
    path: string;
    method: string;
    headers: Record<string, string | string[] | undefined>;
  },
  context: { routerKind: string; routePath: string; routeType: string },
) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = await import('@sentry/nextjs');
    Sentry.captureRequestError(err, request, context);
  }
}
