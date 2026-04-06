'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

/**
 * Bespoke animations for /lista-de-espera:
 *  - count-up counter that climbs smoothly then ticks 1/sec to target
 *  - hero timeline (label → title → subtitle)
 *  - form card scroll-triggered fade-in
 *  - section reveals (benefits, timeline, CTA)
 */
export default function Animations() {
  useEffect(() => {
    const reducedMotion = prefersReducedMotion();

    const counterEl = document.querySelector<HTMLElement>('[data-waitlist-counter]');
    if (counterEl) {
      const target = Number(counterEl.dataset.counterTarget ?? 0);
      if (reducedMotion) {
        counterEl.textContent = String(target);
      } else {
        const state = { value: 0 };
        const tl = gsap.timeline({ delay: 1.1 });
        tl.to(state, {
          value: target - 4,
          duration: 5,
          ease: 'power2.out',
          snap: { value: 1 },
          onUpdate: () => {
            counterEl.textContent = String(state.value);
          },
        });
        for (let i = 3; i >= 0; i--) {
          const n = target - i;
          tl.call(
            () => {
              counterEl.textContent = String(n);
            },
            [],
            '+=1'
          );
        }
      }
    }

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 0.3 });
      heroTl
        .fromTo(
          '[data-waitlist-label]',
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        )
        .fromTo(
          '[data-waitlist-title]',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo(
          '[data-waitlist-subtitle]',
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.3'
        );

      gsap.fromTo(
        '[data-waitlist-card]',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: '[data-waitlist-form-section]',
            start: 'top 80%',
            once: true,
          },
        }
      );

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
        '[data-waitlist-benefits] [data-waitlist-section-label]',
        { y: 16, opacity: 0, duration: 0.5 },
        '[data-waitlist-benefits]'
      );
      reveal(
        '[data-waitlist-benefits] [data-waitlist-section-title]',
        { y: 24, opacity: 0, duration: 0.6, delay: 0.1 },
        '[data-waitlist-benefits]'
      );
      reveal(
        '[data-waitlist-benefit]',
        { y: 28, opacity: 0, stagger: 0.15, duration: 0.6 },
        '[data-waitlist-benefits-grid]'
      );

      reveal(
        '[data-waitlist-timeline] [data-waitlist-section-label]',
        { y: 16, opacity: 0, duration: 0.5 },
        '[data-waitlist-timeline]'
      );
      reveal(
        '[data-waitlist-timeline] [data-waitlist-section-title]',
        { y: 24, opacity: 0, duration: 0.6, delay: 0.1 },
        '[data-waitlist-timeline]'
      );
      reveal(
        '[data-waitlist-milestone]',
        { y: 24, opacity: 0, stagger: 0.2, duration: 0.6 },
        '[data-waitlist-timeline-track]'
      );

      reveal(
        '[data-waitlist-cta-content] > *',
        { y: 20, opacity: 0, stagger: 0.12, duration: 0.6 },
        '[data-waitlist-cta]'
      );
    });

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return null;
}
