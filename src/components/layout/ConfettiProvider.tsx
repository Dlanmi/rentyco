'use client';

/**
 * Exposes a `window.rentyConfetti` function that fires a lightweight dot
 * animation over the waitlist section. Called from the WaitlistForm after a
 * successful submission. Respects reduced-motion and self-throttles.
 */
import { useEffect } from 'react';

declare global {
  interface Window {
    rentyConfetti?: () => Promise<void>;
  }
}

export default function ConfettiProvider() {
  useEffect(() => {
    let running = false;
    window.rentyConfetti = async () => {
      if (running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      running = true;

      const { gsap } = await import('@/lib/gsap');
      const colors = ['#0D6B58', '#10B981', '#E8634A', '#F59E0B', '#E8F5F0'];
      const container =
        document.querySelector<HTMLElement>('[data-waitlist]') || document.body;
      container.style.position = 'relative';

      const total = 50;
      let completed = 0;
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.style.cssText =
          'position:absolute;width:8px;height:8px;border-radius:50%;pointer-events:none;z-index:100;';
        dot.style.background = colors[Math.floor(Math.random() * colors.length)]!;
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = '50%';
        container.appendChild(dot);

        gsap.to(dot, {
          y: -(100 + Math.random() * 200),
          x: (Math.random() - 0.5) * 200,
          opacity: 0,
          duration: 1 + Math.random(),
          ease: 'power2.out',
          force3D: true,
          onComplete() {
            (this.targets()[0] as HTMLElement).remove();
            completed++;
            if (completed >= total) running = false;
          },
        });
      }
    };

    return () => {
      delete window.rentyConfetti;
    };
  }, []);

  return null;
}
