'use client';

import { useRef } from 'react';
import { useReveals } from '@/lib/useReveal';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface Step {
  n: string;
  tag: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    n: '01',
    tag: 'Regístrate',
    title: 'Crea tu perfil',
    desc: 'Correo, cédula y los datos básicos. 2 minutos, sin letra chica.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="16" cy="14" r="5.5" />
        <path d="M6 32c0-5.2 4.5-9 10-9s10 3.8 10 9" />
        <path d="M30 12v8M26 16h8" />
      </svg>
    ),
  },
  {
    n: '02',
    tag: '12 preguntas',
    title: 'Calcula tu score',
    desc: 'En 3 minutos conoces tu Renty Score — y qué palancas lo mueven.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="8" y="6" width="24" height="28" rx="3" />
        <path d="M14 8V6h12v2" />
        <path d="M13 18l3 3 7-7" />
        <path d="M13 28h14" />
      </svg>
    ),
  },
  {
    n: '03',
    tag: 'Explora',
    title: 'Filtra arriendos',
    desc: 'Ve solo los arriendos donde tu score te pre-califica.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="18" r="10" />
        <path d="M26 26l6 6" />
      </svg>
    ),
  },
  {
    n: '04',
    tag: 'Firma',
    title: 'Recibe las llaves',
    desc: 'Tu historial hace el trabajo. Menos papeles, menos fiadores.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="14" cy="20" r="7" />
        <path d="M21 20l13 0M31 17v6M27 17v6" />
      </svg>
    ),
  },
];

export default function Steps() {
  const ref = useRef<HTMLElement>(null);

  useReveals(ref, [
    {
      selector: '[data-step]',
      vars: { y: 28, opacity: 0, stagger: 0.15, duration: 0.6 },
      triggerSelector: '[data-steps]',
    },
    {
      selector: '[data-steps-head] > *',
      vars: { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 },
      triggerSelector: '[data-steps-head]',
    },
  ]);

  return (
    <section
      ref={ref}
      id="como-funciona"
      className="relative overflow-hidden bg-sand-dark py-14 lg:py-24"
    >
      {/* soft teal radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(13,107,88,0.06), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div data-steps-head className="mx-auto mb-14 max-w-[820px] text-center lg:mb-16">
          <Eyebrow tone="teal" className="mb-4">Cómo funciona</Eyebrow>
          <h2
            className="font-display font-400 text-ink [letter-spacing:-0.02em]"
            style={{ fontSize: 'clamp(32px, 5vw, 68px)', lineHeight: 1.05, margin: 0 }}
          >
            Arrendar con Renty es <em className="italic text-teal">así de simple.</em>
          </h2>
          <p
            className="mx-auto mt-4 max-w-[58ch] font-body text-ink-secondary"
            style={{ fontSize: 19, lineHeight: 1.55 }}
          >
            Cuatro pasos. Cero letra chica. Sin pedir que te conviertas en alguien que no eres.
          </p>
        </div>

        <div
          data-steps
          className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* dashed connector */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[5%] right-[5%] top-[92px] z-0 hidden h-[2px] opacity-25 lg:block"
            style={{
              backgroundImage:
                'linear-gradient(to right, var(--color-teal) 50%, transparent 0%)',
              backgroundSize: '16px 2px',
              backgroundRepeat: 'repeat-x',
            }}
          />

          {steps.map((s) => (
            <div
              key={s.n}
              data-step
              className="group relative z-[1] rounded-3xl border border-border bg-white p-6 transition-all duration-300 ease-out-expo hover:-translate-y-1.5 hover:shadow-lg lg:p-8"
            >
              <div
                className="mb-5 inline-block rounded-full border border-coral/25 bg-coral-light px-3 py-1.5 font-mono text-[11px] font-500 tracking-[0.16em] uppercase text-coral"
              >
                {s.n} · {s.tag}
              </div>
              <div
                className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-teal-lighter text-teal transition-[background,color,transform] duration-300 ease-out-expo group-hover:-rotate-6 group-hover:bg-teal group-hover:text-white"
              >
                <div className="h-8 w-8">{s.icon}</div>
              </div>
              <h4 className="mb-2 font-heading text-[17px] font-600 text-ink">{s.title}</h4>
              <p className="font-body text-[14px] leading-[1.55] text-ink-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
