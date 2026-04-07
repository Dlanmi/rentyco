'use client';

import { useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Como-funciona-specific GSAP animations: hero timeline, step reveals,
 * mockup entrances, divider lines, factor cards, FAQ items.
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
      // Hero timeline
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from('[data-como-label]', { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' })
        .from('[data-como-title]', { y: 30, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
        .from('[data-como-text]', { opacity: 0, duration: 0.6 }, '-=0.3');

      // Steps — each step reveals children on scroll
      document.querySelectorAll('[data-como-step]').forEach((step) => {
        gsap.from(step.children, {
          y: 24,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: { trigger: step, start: 'top 85%', once: true },
        });
      });

      // Mockups — each triggers independently on scroll
      document.querySelectorAll('[data-como-mockup]').forEach((mockup) => {
        gsap.from(mockup, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: { trigger: mockup, start: 'top 88%', once: true },
        });
      });

      // Dividers — scaleY from top
      document.querySelectorAll('[data-como-divider]').forEach((div) => {
        gsap.from(div, {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 0.8,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: { trigger: div, start: 'top 90%', once: true },
        });
      });

      // Factors header
      reveal(
        '[data-como-factors-header] > *',
        { y: 24, opacity: 0, stagger: 0.15, duration: 0.6 },
        '[data-como-factors-header]'
      );

      // Factor cards
      reveal(
        '[data-como-factor]',
        { y: 28, opacity: 0, stagger: 0.12, duration: 0.6 },
        '[data-como-factors-grid]'
      );

      // FAQ header
      reveal(
        '[data-como-faq-header] > *',
        { y: 16, opacity: 0, stagger: 0.12, duration: 0.5 },
        '[data-como-faq-header]'
      );

      // FAQ items
      reveal(
        '[data-faq-item]',
        { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 },
        '[data-como-faq-list]'
      );
    });

    return () => ctx.revert();
  }, []);

  return null;
}
