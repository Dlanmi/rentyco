'use client';

import { useRef } from 'react';
import { useReveals } from '@/lib/useReveal';

export default function Testimonial() {
  const ref = useRef<HTMLElement>(null);

  useReveals(ref, [
    {
      selector: '[data-testimonial-card]',
      vars: { y: 24, opacity: 0, stagger: 0.18, duration: 0.6 },
      triggerSelector: '[data-testimonial-grid]',
    },
  ]);

  return (
    <section ref={ref} data-testimonial className="bg-sand-dark py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
          <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral">
            Historias representativas
          </span>
          <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink">
            Dos lados de la misma moneda.
          </h2>
        </div>

        <div data-testimonial-grid className="grid gap-8 lg:grid-cols-2">
          {/* ── Inquilina ── */}
          <div data-testimonial-card className="rounded-2xl border border-border bg-surface p-8">
            <span className="mb-5 inline-block rounded-full bg-teal-lighter px-3 py-1 font-heading text-[11px] font-600 text-teal-dark">
              Inquilina
            </span>

            <blockquote className="font-display text-[clamp(1.1rem,2.5vw,1.35rem)] leading-[1.55] text-ink">
              &ldquo;Llevamos 10 años pagando arriendo sin fallar un solo mes.
              Pero cuando quisimos cambiarnos de apto, nos rechazaron en 4
              inmobiliarias porque no teníamos codeudor con finca raíz.&rdquo;
            </blockquote>

            <p className="mt-5 font-body text-[14px] leading-relaxed text-ink-muted">
              Paga $1.800.000 mensuales desde 2014. Empleo estable, servicios al
              día, jamás un atraso. Pero para el sistema formal, su historial es
              invisible.
            </p>

            <div className="mt-5 rounded-xl border border-teal/20 bg-teal-lighter/30 p-5">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal/10">
                  <svg className="h-3.5 w-3.5 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-heading text-[12px] font-600 text-teal-dark">
                  Cómo Renty cambiaría este caso
                </span>
              </div>
              <p className="font-body text-label leading-relaxed text-ink-secondary">
                Con un <strong className="text-teal-dark">Renty Score alto</strong>,
                podría presentar su perfil a arrendadores con más confianza — sin
                depender de un codeudor.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4 border-t border-border pt-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-lighter font-heading text-sm font-700 text-teal">
                CM
              </div>
              <div>
                <span className="block font-heading text-md font-600 text-ink">Camila M.</span>
                <span className="font-body text-label text-ink-muted">
                  Trabajadora independiente · Bogotá — 10 años
                </span>
              </div>
            </div>
          </div>

          {/* ── Arrendador ── */}
          <div data-testimonial-card className="rounded-2xl border border-border bg-surface p-8">
            <span className="mb-5 inline-block rounded-full bg-coral-light px-3 py-1 font-heading text-[11px] font-600 text-coral">
              Arrendador
            </span>

            <blockquote className="font-display text-[clamp(1.1rem,2.5vw,1.35rem)] leading-[1.55] text-ink">
              &ldquo;Mi último inquilino tenía codeudor con finca raíz y me dejó
              4 meses de arriendo sin pagar. El codeudor nunca me respondió. Un
              score basado en historial real me hubiera dado mejor
              información.&rdquo;
            </blockquote>

            <p className="mt-5 font-body text-[14px] leading-relaxed text-ink-muted">
              Tiene 2 apartamentos en Cedritos. Después del impago, pasó 8 meses
              entre desahucio, reparaciones y búsqueda de nuevo inquilino. Pérdida
              estimada: más de $14 millones.
            </p>

            <div className="mt-5 rounded-xl border border-coral/20 bg-coral-light/30 p-5">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-coral/10">
                  <svg className="h-3.5 w-3.5 text-coral" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-heading text-[12px] font-600 text-coral">
                  Cómo Renty cambiaría este caso
                </span>
              </div>
              <p className="font-body text-label leading-relaxed text-ink-secondary">
                Con el <strong className="text-coral">Renty Score</strong>, habría
                visto el historial de pagos real del candidato — no solo un papel
                firmado por un tercero.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4 border-t border-border pt-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral-light font-heading text-sm font-700 text-coral">
                RA
              </div>
              <div>
                <span className="block font-heading text-md font-600 text-ink">Ricardo A.</span>
                <span className="font-body text-label text-ink-muted">
                  Propietario · Bogotá — 2 inmuebles en arriendo
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center font-mono text-[11px] leading-relaxed text-ink-muted/70">
          * Historias basadas en casos recurrentes recopilados en nuestra
          investigación. Nombres modificados por privacidad. Renty está en
          pre-lanzamiento.
        </p>
      </div>
    </section>
  );
}
