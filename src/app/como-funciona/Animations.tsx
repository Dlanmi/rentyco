'use client';

import { useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Scroll-reveal for `/como-funciona` — a single, generic fade-up driven by
 * ScrollTrigger, targeting `[data-cf-reveal]` elements across all sections.
 * Respects `prefers-reduced-motion`.
 */
export default function Animations() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<Element>('[data-cf-reveal]').forEach((el) => {
        // `fromTo` with explicit target lets CSS pre-hide the element
        // (opacity:0 baseline in globals.css). The SSR HTML paints already
        // hidden so there's no flash when GSAP hydrates. When the scroll
        // trigger fires, GSAP animates the element cleanly from 0 → 1.
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
