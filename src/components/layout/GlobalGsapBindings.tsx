'use client';

/**
 * Scans the DOM on every route for elements with `data-count`, `data-reveal`,
 * and `data-reveal-stagger` attrs and wires them up to GSAP ScrollTriggers.
 *
 * Mirrors the Astro inline script 1:1, preserving easing, durations,
 * stagger timings and the `clearProps` hygiene that keeps transforms from
 * leaking after the animation finishes.
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

const parseRevealNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseFloat(value ?? '');
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function GlobalGsapBindings() {
  const pathname = usePathname();

  useEffect(() => {
    const hasTargets = Boolean(
      document.querySelector('[data-count], [data-reveal], [data-reveal-stagger]')
    );
    if (!hasTargets) return;

    const triggers: ScrollTrigger[] = [];
    const reducedMotion = prefersReducedMotion();

    // For reduced-motion users, immediately show all reveal elements
    // (CSS media query handles this too, but this is a JS safety net)
    if (reducedMotion) {
      document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger] > *').forEach((el) => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'none';
      });
    }

    // Counters
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count || '0');
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          gsap.to(
            { val: 0 },
            {
              val: target,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate() {
                el.textContent =
                  prefix +
                  (this.targets()[0] as { val: number }).val.toFixed(decimals) +
                  suffix;
              },
            }
          );
        },
      });
      triggers.push(st);
    });

    if (!reducedMotion) {
      // Single-element reveals
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        const start = el.dataset.revealStart || 'top 92%';
        const y = parseRevealNumber(el.dataset.revealY, 20);
        const duration = parseRevealNumber(el.dataset.revealDuration, 0.6);
        const delay = parseRevealNumber(el.dataset.revealDelay, 0);
        const fade = el.dataset.revealFade !== 'false';
        const fromVars: gsap.TweenVars = fade ? { y, autoAlpha: 0 } : { y };
        const toVars: gsap.TweenVars = fade ? { y: 0, autoAlpha: 1 } : { y: 0 };

        const tween = gsap.fromTo(el, fromVars, {
          ...toVars,
          duration,
          delay,
          ease: 'power2.out',
          force3D: true,
          overwrite: 'auto',
          // Only clear transform (hygiene). Keep inline opacity/visibility so
          // the element stays visible — the CSS-first baseline in globals.css
          // sets `[data-reveal] { opacity: 0 }` to kill the SSR→hydration flash;
          // if we cleared opacity here, the element would revert to opacity:0
          // after the animation completed.
          clearProps: 'transform',
          scrollTrigger: { trigger: el, start, once: true },
        });
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      // Stagger reveals
      document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((el) => {
        const start = el.dataset.revealStart || 'top 92%';
        const y = parseRevealNumber(el.dataset.revealY, 20);
        const duration = parseRevealNumber(el.dataset.revealDuration, 0.5);
        const staggerEach = parseRevealNumber(el.dataset.revealStaggerEach, 0.1);
        const fade = el.dataset.revealFade !== 'false';
        const children = Array.from(el.children);
        if (!children.length) return;

        const fromVars: gsap.TweenVars = fade ? { y, autoAlpha: 0 } : { y };
        const toVars: gsap.TweenVars = fade ? { y: 0, autoAlpha: 1 } : { y: 0 };

        const tween = gsap.fromTo(children, fromVars, {
          ...toVars,
          stagger: staggerEach,
          duration,
          ease: 'power2.out',
          force3D: true,
          overwrite: 'auto',
          // Only clear transform — see the matching block above for rationale.
          clearProps: 'transform',
          scrollTrigger: { trigger: el, start, once: true },
        });
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });
    }

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    }
    window.addEventListener('load', refresh, { once: true });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [pathname]);

  return null;
}
