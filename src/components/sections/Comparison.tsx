'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

export default function Comparison() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const commonTrigger = { trigger: ref.current!, start: 'top 92%', once: true } as const;

      mm.add('(min-width: 1024px)', () => {
        gsap.fromTo(
          '[data-compare-old] > *',
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: commonTrigger,
          }
        );
        gsap.fromTo(
          '[data-compare-new] > *',
          { x: 20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.5,
            delay: 0.3,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: commonTrigger,
          }
        );
      });

      mm.add('(max-width: 1023px)', () => {
        gsap.fromTo(
          '[data-compare-old] > *',
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.4,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: commonTrigger,
          }
        );
        gsap.fromTo(
          '[data-compare-new] > *',
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.4,
            delay: 0.2,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: commonTrigger,
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const oldItems = [
    { text: <>Necesitas <strong className="text-ink">2 codeudores con finca raíz</strong> para rentas mayores a $1.5M</> },
    { text: <>Certificados laborales, extractos bancarios, declaración de renta</> },
    { text: <>Promedio de <strong className="text-ink">3.9 meses</strong> para completar el proceso en Bogotá</> },
    { text: <>¿Eres independiente, migrante o no tienes patrimonio? <strong className="text-ink">Ni te molestes en aplicar.</strong></> },
    { text: <>10 años pagando cumplido <strong className="text-ink">no cuentan si no tienes los papeles</strong></> },
  ];

  const newItems = [
    { text: <>Tu <strong className="text-teal-dark">historial de pago verificado</strong> reemplaza al codeudor</> },
    { text: <>Score basado en datos alternativos: pagos de servicios, Nequi, Daviplata</> },
    { text: <>Perfil verificado en <strong className="text-teal-dark">minutos, no meses</strong></> },
    { text: <>Funciona para informales, migrantes y familias sin patrimonio</> },
    { text: <>Tus años pagando bien <strong className="text-teal-dark">finalmente cuentan</strong></> },
  ];

  return (
    <section ref={ref} data-compare className="py-24 lg:py-32" id="comparacion">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
            Antes vs. después
          </span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
            Arrendar no debería ser
            <br />
            una carrera de obstáculos.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div
            data-compare-old
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-light">
                <svg
                  className="h-5 w-5 text-coral"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-700 text-ink">Sistema tradicional</h3>
            </div>
            <ul className="space-y-4">
              {oldItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral text-xs">
                    ✕
                  </span>
                  <span className="font-body text-[15px] text-ink-secondary">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-3 py-1 lg:hidden">
            <div className="h-px flex-1 bg-border" />
            <span className="font-heading text-[13px] font-700 tracking-wider text-coral uppercase">
              vs
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div
            data-compare-new
            className="rounded-2xl border-2 border-teal/20 bg-teal-lighter/30 p-6 ring-1 ring-teal/10 sm:p-8 lg:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
                <svg
                  className="h-5 w-5 text-teal"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-700 text-teal-dark">Con Renty</h3>
            </div>
            <ul className="space-y-4">
              {newItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal text-xs">
                    ✓
                  </span>
                  <span className="font-body text-[15px] text-ink-secondary">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/renty-score/formulario"
            className="inline-flex items-center gap-2 rounded-xl bg-teal px-7 py-3.5 font-heading text-[15px] font-600 text-white no-underline shadow-lg shadow-teal/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-xl hover:shadow-teal/25"
          >
            Empieza gratis — toma 3 minutos
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-3 font-body text-[13px] text-ink-muted">Sin costo · Sin documentos</p>
        </div>
      </div>
    </section>
  );
}
