/**
 * PostHog analytics bootstrap.
 *
 * Activated by setting NEXT_PUBLIC_POSTHOG_KEY (and optionally
 * NEXT_PUBLIC_POSTHOG_HOST — defaults to posthog.com US cloud). Without the
 * key, all helpers no-op so local dev and preview builds stay quiet.
 *
 * Usage (client):
 *   import { track } from '@/lib/analytics';
 *   track('waitlist_submit', { city: 'Bogotá' });
 *
 * Page views are captured automatically by <AnalyticsProvider /> mounted in
 * the root layout.
 */
'use client';

import posthog from 'posthog-js';

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

let initialized = false;

export function initAnalytics(): void {
  if (initialized || !KEY || typeof window === 'undefined') return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false, // fired manually per route change in provider
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage+cookie',
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-mask]',
    },
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') ph.debug(false);
    },
  });
  initialized = true;
}

export function track(event: string, props?: Record<string, unknown>): void {
  if (!KEY || typeof window === 'undefined' || !initialized) return;
  posthog.capture(event, props);
}

export function identify(userId: string, props?: Record<string, unknown>): void {
  if (!KEY || typeof window === 'undefined' || !initialized) return;
  posthog.identify(userId, props);
}

export function reset(): void {
  if (!KEY || typeof window === 'undefined' || !initialized) return;
  posthog.reset();
}

export function capturePageview(path: string): void {
  if (!KEY || typeof window === 'undefined' || !initialized) return;
  posthog.capture('$pageview', { $current_url: path });
}
