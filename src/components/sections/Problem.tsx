'use client';

import { useRef } from 'react';
import { useReveals } from '@/lib/useReveal';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface Stat {
  eyebrow: string;
  num: string;
  unit: string;
  label: string;
  desc: string;
  source: string;
  illus: React.ReactNode;
}

const stats: Stat[] = [
  {
    eyebrow: 'Contratos',
    num: '57',
    unit: '%',
    label: 'de los contratos son verbales.',
    desc: 'Millones de familias arriendan sin un documento que respalde sus años de pago puntual.',
    source: 'Fuente · Fedelonjas 2024',
    illus: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="20" y="18" width="70" height="90" rx="6" />
        <path d="M32 38h46M32 52h46M32 66h30" />
        <path d="M72 84l8 8 18-22" strokeDasharray="4 4" />
      </svg>
    ),
  },
  {
    eyebrow: 'Informalidad',
    num: '55.8',
    unit: '%',
    label: 'trabajan en la informalidad.',
    desc: 'Freelancers, comerciantes, taxistas, vendedores — todos con ingresos reales que ningún sistema quiere medir.',
    source: 'Fuente · DANE Q2 2024',
    illus: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="60" cy="44" r="18" />
        <path d="M24 104c0-18 16-32 36-32s36 14 36 32" />
        <path d="M90 32l10 -10M96 46l14 -4M92 60l12 4" opacity={0.6} />
      </svg>
    ),
  },
  {
    eyebrow: 'Familias',
    num: '7.3',
    unit: 'M',
    label: 'familias sin reputación formal.',
    desc: 'Arriendan año tras año, cumplen, pero no existen para el sistema financiero tradicional.',
    source: 'Fuente · Camacol 2023',
    illus: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 70 L60 36 L100 70 V100 H20 Z" />
        <path d="M46 100 V78 H74 V100" />
        <path d="M28 58 V42 H38" opacity={0.6} />
      </svg>
    ),
  },
];

export default function Problem() {
  const ref = useRef<HTMLElement>(null);

  useReveals(ref, [
    {
      selector: '[data-problem-header] > *',
      vars: { y: 24, opacity: 0, stagger: 0.15, duration: 0.6 },
      triggerSelector: '[data-problem]',
    },
    {
      selector: '[data-stat-card]',
      vars: { y: 28, opacity: 0, stagger: 0.15, duration: 0.6 },
      triggerSelector: '[data-stats]',
    },
    { selector: '[data-quote]', vars: { scale: 0.96, opacity: 0, duration: 0.7 } },
  ]);

  return (
    <section
      ref={ref}
      data-problem
      id="problema"
      className="relative overflow-hidden bg-sand py-14 lg:py-24"
    >
      {/* soft coral radial glow behind the cards */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-8%] top-[20%] h-[360px] w-[360px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(232,99,74,0.08), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div data-problem-header className="mb-12 max-w-[820px] lg:mb-16">
          <Eyebrow tone="coral" className="mb-4">El problema</Eyebrow>
          <h2 className="font-display font-400 text-ink [letter-spacing:-0.02em]" style={{ fontSize: 'clamp(32px, 5vw, 68px)', lineHeight: 1.05, margin: 0 }}>
            El sistema de arriendo en Colombia{' '}
            <em className="italic text-teal">está roto.</em>
          </h2>
          <p className="mt-4 max-w-[58ch] font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
            Papeles que no reflejan tu realidad. Codeudores con finca raíz que nadie tiene.
            Décadas pagando cumplido que no cuentan para nada.
          </p>
        </div>

        <div data-stats className="grid gap-6 md:grid-cols-3">
          {stats.map((s, i) => {
            const isDark = i === 1;
            return (
              <article
                key={s.eyebrow}
                data-stat-card
                className={`group relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl border p-7 pt-8 transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-2 hover:shadow-xl sm:min-h-[380px] sm:p-8 sm:pt-9 ${
                  isDark ? 'border-transparent bg-ink text-white' : 'border-border bg-white'
                }`}
              >
                {/* illustration — hidden on mobile to keep text airy */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute right-[-24px] top-6 hidden h-[120px] w-[120px] transition-transform duration-500 ease-out-expo group-hover:scale-[1.06] group-hover:-rotate-3 sm:block ${
                    isDark ? 'text-coral/20' : 'text-teal-lighter'
                  }`}
                  style={{ opacity: 0.85 }}
                >
                  {s.illus}
                </div>

                <span
                  className={`mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-500 tracking-[0.16em] uppercase before:inline-block before:h-px before:w-[18px] before:bg-current before:opacity-50 ${
                    isDark ? 'text-coral-light' : 'text-coral'
                  }`}
                >
                  {s.eyebrow}
                </span>

                <div
                  className={`flex items-baseline gap-1 font-mono font-500 [letter-spacing:-0.03em] ${
                    isDark ? 'text-coral' : 'text-teal'
                  }`}
                  style={{ fontSize: 'clamp(56px, 14vw, 88px)', lineHeight: 0.95 }}
                >
                  {s.num}
                  <span
                    className={`font-500 opacity-70 ${isDark ? 'text-coral-light' : 'text-teal-dark'}`}
                    style={{ fontSize: 'clamp(28px, 6vw, 40px)' }}
                  >
                    {s.unit}
                  </span>
                </div>

                <h3
                  className={`mb-3 mt-4 max-w-[18ch] font-display font-400 [letter-spacing:-0.01em] ${
                    isDark ? 'text-white' : 'text-ink'
                  }`}
                  style={{ fontSize: 24, lineHeight: 1.25 }}
                >
                  {s.label}
                </h3>

                <p
                  className={`mb-auto max-w-[26ch] font-body ${
                    isDark ? 'text-white/65' : 'text-ink-muted'
                  }`}
                  style={{ fontSize: 14, lineHeight: 1.55 }}
                >
                  {s.desc}
                </p>

                <div
                  className={`mt-6 border-t pt-4 font-mono text-[11px] font-500 tracking-[0.14em] uppercase ${
                    isDark ? 'border-white/10 text-white/40' : 'border-border text-ink-muted'
                  }`}
                >
                  {s.source}
                </div>
              </article>
            );
          })}
        </div>

        {/* Quote strip */}
        <div
          data-quote
          className="mt-12 grid items-center gap-8 rounded-3xl border border-coral/15 p-10 md:grid-cols-[auto_1fr] md:px-12"
          style={{ background: 'linear-gradient(135deg, var(--color-coral-light), var(--color-sand))' }}
        >
          <div
            aria-hidden="true"
            className="font-display leading-[0.6] text-coral/50 md:text-[120px]"
            style={{ fontSize: 72 }}
          >
            &ldquo;
          </div>
          <div>
            <p
              className="mb-3.5 max-w-[52ch] font-display font-400 text-ink [letter-spacing:-0.01em]"
              style={{ fontSize: 'clamp(20px, 2.4vw, 30px)', lineHeight: 1.35, margin: 0 }}
            >
              &ldquo;¿Tienes codeudor{' '}
              <em className="italic text-coral-dark">con finca raíz</em>
              {' '}en Bogotá?&rdquo; Si la respuesta es no — y para 8 de cada 10 colombianos lo es
              {' '}— el resto del formulario no importa.
            </p>
            <div className="mt-3 font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-ink-muted">
              — Renty, sobre por qué existimos
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
