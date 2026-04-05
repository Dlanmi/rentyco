/**
 * Central GSAP setup — imported once per page, shared across all component scripts.
 * Vite dedupes this module, so plugins register exactly once.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Expose for dev-only debugging (Playwright tests, browser console).
// Vite replaces import.meta.env.DEV at build time, so this is tree-shaken in prod.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).__gsap = gsap;
  (window as any).__ScrollTrigger = ScrollTrigger;
}

export { gsap, ScrollTrigger };

/** True if the user prefers reduced motion — animations should be skipped. */
export const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Reveal helper — animates `sel` in when `trigger` (or `sel`) enters the viewport.
 * Silently no-ops if either the selector or trigger is missing, so components
 * can be safely reused across pages that don't contain every element.
 */
export function reveal(
  sel: string,
  vars: gsap.TweenVars,
  trigger?: string
): void {
  const targets = gsap.utils.toArray<Element>(sel);
  if (!targets.length) return;
  const triggerEl = trigger ? document.querySelector(trigger) : null;

  // Separate animation config from state props so we can build the fromTo pair
  const { duration, delay, stagger, ease, ...fromState } = vars;
  // Derive "to" state — the natural resting values for each animated prop
  const toState: gsap.TweenVars = {};
  for (const key of Object.keys(fromState)) {
    if (key === 'opacity') toState.opacity = 1;
    else if (key === 'y' || key === 'x') toState[key] = 0;
    else if (key === 'scale') toState.scale = 1;
    else if (key === 'rotation' || key === 'rotationX' || key === 'rotationY') toState[key] = 0;
    else toState[key] = 0;
  }

  gsap.fromTo(
    targets,
    fromState,
    {
      ...toState,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger: { trigger: triggerEl || (targets[0] as Element), start: 'top 92%', once: true },
      force3D: true,
    }
  );
}
