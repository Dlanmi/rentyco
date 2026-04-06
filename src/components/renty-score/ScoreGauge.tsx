'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import type { ScoreColor } from '@/lib/renty-score/types';

interface Props {
  score: number;
  color: ScoreColor;
  label: string;
}

const COLOR_MAP: Record<ScoreColor, string> = {
  verde: '#0D6B58',
  amarillo: '#F59E0B',
  naranja: '#E8634A',
  rojo: '#DC2626',
};

const BG_MAP: Record<ScoreColor, string> = {
  verde: '#E8F5F0',
  amarillo: '#FEF3C7',
  naranja: '#FCEAE6',
  rojo: '#FEE2E2',
};

export function ScoreGauge({ score, color, label }: Props) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / 1000, 1);

  useEffect(() => {
    const numberEl = numberRef.current;
    const circleEl = circleRef.current;
    if (!numberEl || !circleEl) return;

    // Check for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      numberEl.textContent = String(score);
      circleEl.style.strokeDashoffset = String(circumference * (1 - progress));
      return;
    }

    // Animate number counting up
    const duration = 1500;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);

      const currentScore = Math.round(eased * score);
      if (numberEl) numberEl.textContent = String(currentScore);

      const currentOffset = circumference * (1 - eased * progress);
      if (circleEl) circleEl.style.strokeDashoffset = String(currentOffset);

      if (t < 1) requestAnimationFrame(animate);
    }

    // Start from zero
    circleEl.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(animate);
  }, [score, circumference, progress]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[220px] w-[220px]">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={BG_MAP[color]}
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <circle
            ref={circleRef}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={COLOR_MAP[color]}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            ref={numberRef}
            className="font-display text-5xl font-bold"
            style={{ color: COLOR_MAP[color] }}
          >
            0
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink-muted">
            Renty Score
          </span>
        </div>
      </div>

      {/* Label badge */}
      <div
        className="mt-4 rounded-full px-5 py-2 text-sm font-semibold"
        style={{ backgroundColor: BG_MAP[color], color: COLOR_MAP[color] }}
      >
        {label}
      </div>
    </div>
  );
}
