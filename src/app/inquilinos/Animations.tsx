'use client';

import { useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Inquilinos-specific GSAP animations: section reveals, journey timeline
 * line, testimonial line. Counters + data-reveal attrs are handled globally.
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
      // Pain points
      reveal('[data-pain-header] > *', { y: 24, opacity: 0, stagger: 0.15, duration: 0.6 }, '[data-section-pain]');
      reveal('[data-pain-card]', { y: 28, opacity: 0, stagger: 0.12, duration: 0.6 }, '[data-pain-cards]');

      // Solutions
      reveal('[data-solutions-header] > *', { y: 24, opacity: 0, stagger: 0.15, duration: 0.6 }, '[data-section-solutions]');
      reveal('[data-solution-card]', { y: 24, opacity: 0, stagger: 0.15, duration: 0.6 }, '[data-solutions-grid]');

      // Journey
      reveal('[data-journey-header] > *', { y: 24, opacity: 0, stagger: 0.15, duration: 0.6 }, '[data-section-journey]');
      reveal('[data-journey-step]', { y: 24, opacity: 0, stagger: 0.15, duration: 0.6 }, '[data-journey-steps]');
      gsap.fromTo(
        '[data-journey-line]',
        { scaleY: 0, scaleX: 0 },
        {
          scaleY: 1,
          scaleX: 1,
          transformOrigin: 'top left',
          duration: 1.2,
          ease: 'power2.inOut',
          force3D: true,
          scrollTrigger: { trigger: '[data-section-journey]', start: 'top 80%', once: true },
        }
      );

      // Testimonial
      gsap.fromTo(
        '[data-section-testimonial] [data-testimonial-line]',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          duration: 0.8,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: { trigger: '[data-section-testimonial]', start: 'top 75%', once: true },
        }
      );
      reveal('[data-section-testimonial] [data-testimonial-quote]', { x: -20, opacity: 0, duration: 0.7 }, '[data-section-testimonial]');
      reveal('[data-section-testimonial] [data-testimonial-narrative]', { opacity: 0, duration: 0.6, delay: 0.2 }, '[data-section-testimonial]');
      reveal('[data-section-testimonial] [data-testimonial-attr]', { y: 16, opacity: 0, duration: 0.5, delay: 0.4 }, '[data-section-testimonial]');

      // FAQ
      reveal('[data-faq-header] > *', { y: 24, opacity: 0, stagger: 0.15, duration: 0.6 }, '[data-section-faq]');
      reveal('[data-faq-item]', { y: 16, opacity: 0, stagger: 0.1, duration: 0.5 }, '[data-faq-list]');

      // CTA (waitlist form)
      reveal(
        '[data-section-cta] [data-waitlist-heading], [data-section-cta] [data-waitlist-subheading], [data-section-cta] [data-waitlist-card]',
        { y: 24, opacity: 0, stagger: 0.12, duration: 0.6 },
        '[data-section-cta]'
      );
    });

    return () => ctx.revert();
  }, []);

  return null;
}
