'use client';

import { usePathname } from 'next/navigation';

/**
 * Sticky floating CTA that appears after scrolling 15% and hides near #waitlist.
 * Visibility is toggled by GlobalScrollController.
 * Hidden on marketplace / account / admin / auth routes where other CTAs take precedence.
 */
export default function FloatingCTA() {
  const pathname = usePathname();
  const hidden =
    pathname.startsWith('/bogota') ||
    pathname.includes('/arriendos') ||
    pathname.startsWith('/cuenta') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/entrar') ||
    pathname.startsWith('/auth');
  if (hidden) return null;
  return (
    <div
      data-floating-cta
      className="fixed bottom-6 right-6 z-40 translate-y-20 opacity-0 transition-all duration-300"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <a
        href="/renty-score/formulario"
        className="flex items-center gap-2 rounded-full bg-teal px-5 py-3 font-heading text-[14px] font-600 text-white no-underline shadow-xl shadow-teal/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-teal/30"
        style={{ pointerEvents: 'auto' }}
        tabIndex={-1}
      >
        Calcula tu score
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </a>
    </div>
  );
}
