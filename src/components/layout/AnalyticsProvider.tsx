'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initAnalytics, capturePageview } from '@/lib/analytics';

/**
 * Boots PostHog on mount and fires a $pageview on every client-side route
 * change. Next.js App Router doesn't auto-fire pageviews for SPA navigation,
 * so we bind to `usePathname` + `useSearchParams`.
 */
export default function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    capturePageview(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
