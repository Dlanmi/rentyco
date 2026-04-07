/** Lightweight Renty Score event tracking. */
export function trackScoreEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    // eslint-disable-next-line no-console
    console.info(`[RentyScore] ${event}`, data ?? '');
  } catch {
    // silently ignore
  }
}
