'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import type { ScoreColor } from '@/lib/renty-score/types';

/**
 * Animated radial score gauge. Colors come from CSS tokens — `stroke="currentColor"`
 * on each circle lets us swap the tone via a Tailwind class on the wrapper,
 * which means re-theming the score ramp (`--color-score-*`) updates every
 * instance without touching JS.
 */
interface Props {
  score: number;
  color: ScoreColor;
  label: string;
}

type Tone = 'high' | 'ok' | 'mid' | 'low';

const COLOR_TO_TONE: Record<ScoreColor, Tone> = {
  verde: 'high',
  amarillo: 'mid',
  naranja: 'mid',
  rojo: 'low',
};

const FG_CLASS: Record<Tone, string> = {
  high: 'text-score-high',
  ok: 'text-score-ok',
  mid: 'text-score-mid',
  low: 'text-score-low',
};

const TRACK_CLASS: Record<Tone, string> = {
  high: 'text-score-high-bg',
  ok: 'text-score-ok-bg',
  mid: 'text-score-mid-bg',
  low: 'text-score-low-bg',
};

const BADGE_CLASS: Record<Tone, string> = {
  high: 'bg-score-high-bg text-score-high',
  ok: 'bg-score-ok-bg text-score-ok',
  mid: 'bg-score-mid-bg text-score-mid',
  low: 'bg-score-low-bg text-score-low',
};

export function ScoreGauge({ score, color, label }: Props) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / 1000, 1);
  const tone = COLOR_TO_TONE[color];

  useEffect(() => {
    const numberEl = numberRef.current;
    const circleEl = circleRef.current;
    if (!numberEl || !circleEl) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      numberEl.textContent = String(score);
      circleEl.style.strokeDashoffset = String(circumference * (1 - progress));
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      const currentScore = Math.round(eased * score);
      if (numberEl) numberEl.textContent = String(currentScore);

      const currentOffset = circumference * (1 - eased * progress);
      if (circleEl) circleEl.style.strokeDashoffset = String(currentOffset);

      if (t < 1) requestAnimationFrame(animate);
    }

    circleEl.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(animate);
  }, [score, circumference, progress]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-square w-[220px] max-w-full">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          {/* Track (lighter background ring) */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className={TRACK_CLASS[tone]}
          />
          {/* Progress arc */}
          <circle
            ref={circleRef}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            className={FG_CLASS[tone]}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            ref={numberRef}
            className={cn('font-display text-5xl font-bold tabular-nums', FG_CLASS[tone])}
          >
            0
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink-muted">
            Renty Score
          </span>
        </div>
      </div>

      <div
        className={cn(
          'mt-4 rounded-full px-5 py-2 text-sm font-semibold',
          BADGE_CLASS[tone],
        )}
      >
        {label}
      </div>
    </div>
  );
}
