'use client';

import { useRef } from 'react';
import { useReveals } from '@/lib/useReveal';

const stats = [
  {
    value: 7.3,
    suffix: 'M',
    label: 'hogares arriendan en Colombia',
    detail:
      'Superando por primera vez a los propietarios. 40.3% de los hogares colombianos viven en arriendo.',
    source: 'DANE / Fedelonjas 2025',
    decimals: 1,
  },
  {
    value: 57,
    suffix: '%',
    label: 'de contratos son verbales',
    detail:
      'Sin protección legal para nadie. En estratos 1-3, la cifra sube al 95%. Son COP $18 billones anuales en acuerdos de palabra.',
    source: 'Fedelonjas 2024',
    decimals: 0,
  },
  {
    value: 55.8,
    suffix: '%',
    label: 'trabajan en la informalidad',
    detail:
      '12.6 millones de colombianos no pueden mostrar certificado laboral ni colillas de pago. Quedan excluidos del arriendo formal.',
    source: 'DANE Q2 2024',
    decimals: 1,
  },
] as const;

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
    <section ref={ref} data-problem className="bg-sand-dark py-24 lg:py-32" id="problema">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div data-problem-header className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
          <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral">
            El problema
          </span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
            El sistema de arriendo en Colombia
            <br />
            está diseñado para dejarte por fuera.
          </h2>
          <p className="mt-4 font-body text-lg leading-relaxed text-ink-secondary">
            Para arrendar un apto en Bogotá toca conseguir codeudor con finca raíz, certificados
            laborales, extractos bancarios, pólizas… y aún así esperar hasta 3.9 meses. ¿Lo peor?
            No importa si llevas años pagando cumplido. Si no tienes papeles, no existes.
          </p>
        </div>

        <div data-stats className="grid gap-5 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              data-stat-card
              className="group rounded-2xl border border-border border-l-[3px] border-l-teal/40 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03] sm:border-l sm:border-l-border sm:p-8"
            >
              <span
                className="block font-mono text-[clamp(2.5rem,4vw,3.2rem)] font-500 leading-none text-teal"
                data-count={stat.value}
                data-suffix={stat.suffix}
                data-decimals={stat.decimals}
              >
                0{stat.suffix}
              </span>
              <span className="mt-2 block font-heading text-md font-600 text-ink">
                {stat.label}
              </span>
              <p className="mt-2 font-body text-[14px] leading-relaxed text-ink-muted">
                {stat.detail}
              </p>
              <span className="mt-3 block font-mono text-[11px] text-ink-muted/60">
                {stat.source}
              </span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 h-px w-16 bg-coral/40" />
        <blockquote data-quote className="mx-auto mt-8 max-w-xl text-center">
          <p className="font-display text-[clamp(1.1rem,2.5vw,1.4rem)] leading-relaxed text-ink-secondary">
            &ldquo;Mi mamá lleva 10 años pagando arriendo sin fallar un solo mes. Nunca un día
            tarde. Pero cuando quisimos cambiarnos de apto, nos rechazaron en todas partes porque
            no tiene codeudor con finca raíz. O sea, 10 años pagando cumplido y eso no vale
            nada.&rdquo;
          </p>
          <cite className="mt-4 block font-body text-sm text-ink-muted not-italic">
            — Testimonio recopilado en Bogotá
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
