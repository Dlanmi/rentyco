'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

/**
 * Bespoke animations for /nosotros: hero timeline (label → title → subtitle)
 * plus scroll-triggered reveals across mission, problem, values, colombia,
 * and CTA sections. Counters use the global [data-count] binding.
 */
export default function Animations() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 0.3 });
      heroTl
        .from('[data-about-label]', {
          y: 16,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        })
        .from(
          '[data-about-title]',
          { y: 30, opacity: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.2'
        )
        .from('[data-about-subtitle]', { opacity: 0, duration: 0.6 }, '-=0.3');

      const reveal = (
        target: string,
        from: gsap.TweenVars,
        trigger: string
      ) => {
        gsap.fromTo(
          target,
          from,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: (from.duration as number) ?? 0.6,
            delay: (from.delay as number) ?? 0,
            stagger: from.stagger as number | undefined,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: { trigger, start: 'top 92%', once: true },
          }
        );
      };

      reveal(
        '[data-about-mission] [data-about-section-label]',
        { y: 16, opacity: 0, duration: 0.5 },
        '[data-about-mission]'
      );
      reveal(
        '[data-about-mission] [data-about-section-title]',
        { y: 24, opacity: 0, duration: 0.6, delay: 0.1 },
        '[data-about-mission]'
      );
      reveal(
        '[data-about-mission] [data-about-text]',
        { y: 16, opacity: 0, duration: 0.6, delay: 0.2 },
        '[data-about-mission]'
      );
      reveal(
        '[data-about-stat]',
        { y: 28, opacity: 0, stagger: 0.15, duration: 0.6 },
        '[data-about-stats]'
      );

      reveal(
        '[data-about-problem] [data-about-section-label]',
        { y: 16, opacity: 0, duration: 0.5 },
        '[data-about-problem]'
      );
      reveal(
        '[data-about-problem] [data-about-section-title]',
        { y: 24, opacity: 0, duration: 0.6, delay: 0.1 },
        '[data-about-problem]'
      );
      reveal(
        '[data-about-problem] [data-about-text]',
        { y: 16, opacity: 0, duration: 0.6, delay: 0.2 },
        '[data-about-problem]'
      );

      reveal(
        '[data-about-values] [data-about-section-label]',
        { y: 16, opacity: 0, duration: 0.5 },
        '[data-about-values]'
      );
      reveal(
        '[data-about-values] [data-about-section-title]',
        { y: 24, opacity: 0, duration: 0.6, delay: 0.1 },
        '[data-about-values]'
      );
      reveal(
        '[data-about-value]',
        { y: 28, opacity: 0, stagger: 0.12, duration: 0.6 },
        '[data-about-values-grid]'
      );

      reveal(
        '[data-about-flag]',
        { scale: 0.8, opacity: 0, duration: 0.5 },
        '[data-about-colombia]'
      );
      reveal(
        '[data-about-colombia] [data-about-section-label]',
        { y: 16, opacity: 0, duration: 0.5, delay: 0.1 },
        '[data-about-colombia]'
      );
      reveal(
        '[data-about-colombia] [data-about-section-title]',
        { y: 24, opacity: 0, duration: 0.6, delay: 0.2 },
        '[data-about-colombia]'
      );
      reveal(
        '[data-about-colombia] [data-about-text]',
        { y: 16, opacity: 0, duration: 0.6, delay: 0.3 },
        '[data-about-colombia]'
      );

      reveal(
        '[data-about-cta-content] > *',
        { y: 20, opacity: 0, stagger: 0.12, duration: 0.6 },
        '[data-about-cta]'
      );
    });

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return null;
}
