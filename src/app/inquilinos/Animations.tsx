'use client';

import { useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Generic scroll reveal for `/inquilinos`. Elements with `data-inq-reveal`
 * fade up as they enter the viewport. Skipped entirely when the user
 * prefers reduced motion.
 */
export default function Animations() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<Element>('[data-inq-reveal]').forEach((el) => {
        // fromTo with explicit target — CSS pre-hides the element so there's
        // no flash between SSR paint and GSAP hydration. See
        // como-funciona/Animations.tsx for the full rationale.
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
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
