'use client';

import { useEffect, useRef, useState } from 'react';
import { useReveals } from '@/lib/useReveal';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface Voice {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const voices: Voice[] = [
  {
    quote:
      'Llevaba 8 años pagando cumplido. Nadie lo valoraba. Con Renty firmé en una semana, sin codeudor.',
    name: 'María Rodríguez',
    role: 'Bogotá · Chapinero · 2025',
    initials: 'MR',
  },
  {
    quote:
      'Soy freelance, nunca tuve contrato. Mi Renty Score demostró lo que mi contador no podía.',
    name: 'Juan Felipe Ortiz',
    role: 'Bogotá · Teusaquillo · 2025',
    initials: 'JF',
  },
  {
    quote:
      'Como arrendadora alquilé en 4 días. Sabía exactamente con quién firmaba y por qué.',
    name: 'Carolina Peñaranda',
    role: 'Arrendadora · Bogotá · 2026',
    initials: 'CP',
  },
];

export default function Testimonial() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const total = voices.length;
  const paused = useRef(false);
  const touchX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
    if (Math.abs(dx) > 48) {
      setIndex((i) => (dx < 0 ? (i + 1) % total : (i - 1 + total) % total));
    }
    touchX.current = null;
  };

  useReveals(ref, [
    {
      selector: '[data-testimonial-head] > *',
      vars: { y: 16, opacity: 0, stagger: 0.1, duration: 0.5 },
      triggerSelector: '[data-testimonial]',
    },
  ]);

  // Auto-advance every 7s, pause on hover/focus within.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % total);
    }, 7000);
    return () => window.clearInterval(id);
  }, [total]);

  const go = (i: number) => setIndex(((i % total) + total) % total);

  return (
    <section
      ref={ref}
      data-testimonial
      className="relative overflow-hidden bg-sand py-14 lg:py-24"
    >
      {/* giant editorial quote mark in corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-5 top-10 font-display leading-none text-coral/[0.08] sm:text-[200px] lg:text-[320px]"
        style={{ fontSize: 200 }}
      >
        &ldquo;
      </div>

      <div
        className="relative mx-auto max-w-[1280px] px-5 sm:px-8"
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; }}
        onFocusCapture={() => { paused.current = true; }}
        onBlurCapture={() => { paused.current = false; }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div data-testimonial-head className="mx-auto mb-10 max-w-[820px] text-center">
          <Eyebrow tone="coral">Voces reales</Eyebrow>
        </div>

        <div
          className="relative z-[1]"
          aria-live="polite"
          aria-atomic="true"
        >
          {voices.map((v, i) => (
            <article
              key={v.name}
              className={`${i === index ? 'renty-fade-slide block' : 'hidden'} text-center`}
            >
              <div className="mx-auto mb-8 h-px w-14 bg-coral/50" />
              <blockquote
                className="mx-auto mb-10 max-w-[20ch] font-display font-400 leading-[1.35] text-ink [letter-spacing:-0.01em] sm:max-w-[26ch] sm:leading-[1.3]"
                style={{ fontSize: 'clamp(22px, 4vw, 42px)', margin: '0 auto 40px' }}
              >
                {v.quote}
              </blockquote>
              <div className="inline-flex items-center gap-3.5">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-white font-heading text-[18px] font-700"
                  style={{ background: 'linear-gradient(135deg, #E8634A, #0D6B58)' }}
                  aria-hidden="true"
                >
                  {v.initials}
                </div>
                <div className="text-left">
                  <span className="block font-heading text-[16px] font-600 text-ink">
                    {v.name}
                  </span>
                  <span className="block font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-ink-muted">
                    {v.role}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Testimonio anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:border-teal hover:text-teal"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-1" role="tablist" aria-label="Testimonios">
            {voices.map((v, i) => (
              <button
                key={v.name}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonio ${i + 1} de ${total}`}
                onClick={() => go(i)}
                className="flex h-11 w-8 items-center justify-center p-0"
              >
                <span
                  aria-hidden="true"
                  className={`rounded-full transition-all duration-200 ${
                    i === index ? 'h-2 w-6 bg-teal' : 'h-2 w-2 bg-ink-subtle'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Siguiente testimonio"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:border-teal hover:text-teal"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
