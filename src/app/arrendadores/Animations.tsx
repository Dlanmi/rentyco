'use client';

import { useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Arrendadores-specific GSAP animations: hero timeline, section reveals,
 * testimonial line. Counters (data-count) are handled globally.
 */
export default function Animations() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const reveal = (
      selector: string,
      vars: gsap.TweenVars,
      triggerSelector: string
    ) => {
      const targets = gsap.utils.toArray<Element>(selector);
      if (!targets.length) return;
      const triggerEl = document.querySelector(triggerSelector);
      if (!triggerEl) return;

      const { duration, delay, stagger, ease, ...fromState } = vars;
      const toState: gsap.TweenVars = {};
      for (const key of Object.keys(fromState)) {
        if (key === 'opacity') toState.opacity = 1;
        else if (key === 'y' || key === 'x') toState[key] = 0;
        else toState[key] = 0;
      }

      gsap.fromTo(targets, fromState, {
        ...toState,
        duration,
        delay,
        stagger,
        ease: ease || 'power2.out',
        force3D: true,
        scrollTrigger: { trigger: triggerEl, start: 'top 92%', once: true },
      });
    };

    const ctx = gsap.context(() => {
      // Hero
      const heroTl = gsap.timeline({ delay: 0.3 });
      heroTl
        .from('[data-hero-label]', { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' })
        .from('[data-hero-title] > *', { y: 30, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power2.out' }, '-=0.2')
        .from('[data-hero-text]', { opacity: 0, duration: 0.6 }, '-=0.3')
        .from('[data-hero-ctas] > *', { y: 16, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.2')
        .from('[data-hero-proof]', { opacity: 0, duration: 0.4 }, '-=0.1');

      // Problem
      reveal('[data-problem-header] > *', { y: 24, opacity: 0, stagger: 0.15, duration: 0.6 }, '[data-problem]');
      reveal('[data-stat-card]', { y: 28, opacity: 0, stagger: 0.15, duration: 0.6 }, '[data-stats]');

      // Landlord cards
      reveal('[data-landlord-card]', { y: 24, opacity: 0, stagger: 0.12, duration: 0.6 }, '[data-landlord-grid]');

      // Testimonial
      gsap.fromTo(
        '[data-testimonial-line]',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          duration: 0.8,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: { trigger: '[data-testimonial]', start: 'top 75%', once: true },
        }
      );
      reveal('[data-testimonial-quote]', { x: -20, opacity: 0, duration: 0.7 }, '[data-testimonial]');
      reveal('[data-testimonial-narrative]', { opacity: 0, duration: 0.6, delay: 0.2 }, '[data-testimonial]');
      reveal('[data-testimonial-attr]', { y: 16, opacity: 0, duration: 0.5, delay: 0.4 }, '[data-testimonial]');

      // FAQ
      reveal('[data-faq-item]', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 }, '[data-faq-list]');

      // Waitlist
      reveal(
        '[data-waitlist] [data-waitlist-heading], [data-waitlist] [data-waitlist-subheading], [data-waitlist] [data-waitlist-card]',
        { y: 24, opacity: 0, stagger: 0.12, duration: 0.6 },
        '[data-waitlist]'
      );
    });

    return () => ctx.revert();
  }, []);

  return null;
}
