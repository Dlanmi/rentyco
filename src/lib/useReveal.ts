'use client';

import { useEffect, type RefObject } from 'react';
import { gsap, prefersReducedMotion } from './gsap';

/**
 * Reveal recipe — configures a GSAP fromTo with a ScrollTrigger that fires
 * once when the trigger enters the viewport. `vars` contains both the
 * starting state (y/x/opacity/scale/rotation) AND the tween config
 * (duration/delay/stagger/ease). Non-state keys are split out automatically
 * so the "to" state can be derived.
 */
export interface RevealRecipe {
  selector: string;
  vars: gsap.TweenVars;
  triggerSelector?: string;
  start?: string;
}

/**
 * Runs one or more reveal recipes inside a gsap.context scoped to `rootRef`.
 * Skips entirely when the user prefers reduced motion.
 */
export function useReveals(
  rootRef: RefObject<HTMLElement | null>,
  recipes: RevealRecipe[],
  deps: unknown[] = []
): void {
  useEffect(() => {
    if (prefersReducedMotion() || !rootRef.current) return;

    const ctx = gsap.context(() => {
      recipes.forEach((recipe) => {
        const targets = gsap.utils.toArray<Element>(recipe.selector);
        if (!targets.length) return;

        const triggerEl = recipe.triggerSelector
          ? document.querySelector(recipe.triggerSelector)
          : targets[0];
        if (!triggerEl) return;

        const { duration, delay, stagger, ease, ...fromState } = recipe.vars;
        const toState: gsap.TweenVars = {};
        for (const key of Object.keys(fromState)) {
          if (key === 'opacity') toState.opacity = 1;
          else if (key === 'y' || key === 'x') toState[key] = 0;
          else if (key === 'scale') toState.scale = 1;
          else if (key === 'rotation' || key === 'rotationX' || key === 'rotationY')
            toState[key] = 0;
          else toState[key] = 0;
        }

        gsap.fromTo(targets, fromState, {
          ...toState,
          duration,
          delay,
          stagger,
          ease: ease || 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: triggerEl,
            start: recipe.start || 'top 92%',
            once: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
