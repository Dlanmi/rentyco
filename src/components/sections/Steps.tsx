'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useReveals } from '@/lib/useReveal';

interface Step {
  n: string;
  title: string;
  desc: string;
  color: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    n: '01',
    title: 'Crea tu perfil',
    desc: 'Regístrate en 2 minutos. Sin documentos. Solo tu información básica y tu historial de dónde has vivido.',
    color: '#0D6B58',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <circle cx="20" cy="14" r="6" />
        <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Responde 12 preguntas',
    desc: 'Cuéntanos sobre tu experiencia como inquilino: tiempo arrendando, pagos, estabilidad. Son preguntas sencillas.',
    color: '#10B981',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M20 4l14 8v12c0 8-14 14-14 14S6 32 6 24V12L20 4z" />
        <path d="M14 20l4 4 8-8" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Recibe tu Renty Score',
    desc: 'Un puntaje basado en tu comportamiento real: pagos, continuidad, referencias. No en tu patrimonio.',
    color: '#E8634A',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <rect x="4" y="24" width="8" height="12" rx="1" />
        <rect x="16" y="16" width="8" height="20" rx="1" />
        <rect x="28" y="8" width="8" height="28" rx="1" />
      </svg>
    ),
  },
  {
    n: '04',
    title: 'Comparte tu perfil',
    desc: 'Muestra tu Renty Score a arrendadores y demuestra tu historial como inquilino responsable.',
    color: '#0D6B58',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M6 20L20 8l14 12" />
        <path d="M10 18v14a2 2 0 002 2h16a2 2 0 002-2V18" />
        <rect x="16" y="24" width="8" height="10" />
      </svg>
    ),
  },
];

export default function Steps() {
  const ref = useRef<HTMLElement>(null);

  useReveals(ref, [
    {
      selector: '[data-step]',
      vars: { y: 24, opacity: 0, stagger: 0.18, duration: 0.6 },
      triggerSelector: '[data-steps]',
    },
  ]);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-steps-line]',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left',
          duration: 1.2,
          ease: 'power2.inOut',
          force3D: true,
          scrollTrigger: { trigger: '[data-steps]', start: 'top 85%', once: true },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32" id="como-funciona">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-14 text-center lg:mb-20">
          <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
            Cómo funciona
          </span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
            Tu puntaje en 4 pasos.
            <br />
            Así de fácil.
          </h2>
        </div>

        <div data-steps className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div
            data-steps-line
            className="absolute top-7 right-[12%] left-[12%] hidden h-px bg-border lg:block"
          />

          {steps.map((s) => (
            <div
              key={s.n}
              data-step
              className="relative z-10 rounded-2xl border border-border bg-surface p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03] sm:p-8"
            >
              <div
                className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full font-mono text-[13px] font-500 text-white"
                style={{ backgroundColor: s.color }}
              >
                {s.n}
              </div>
              <div
                className="mx-auto mb-4 flex h-11 w-11 items-center justify-center"
                style={{ color: s.color }}
              >
                {s.icon}
              </div>
              <h3 className="mb-2 font-heading text-[16px] font-700 text-ink">{s.title}</h3>
              <p className="font-body text-[14px] leading-relaxed text-ink-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
