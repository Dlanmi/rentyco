'use client';

import { useRef } from 'react';
import { useReveals } from '@/lib/useReveal';

interface Benefit {
  title: string;
  desc: string;
  color: string;
  icon: React.ReactNode;
}

const benefits: Benefit[] = [
  {
    title: 'Historial verificado',
    desc: 'Vea el historial real de pagos de su candidato, verificado directamente con arrendadores anteriores. No solo DataCrédito.',
    color: '#0D6B58',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M18 3l13 7v11c0 7-13 13-13 13S5 28 5 21V10L18 3z" />
        <path d="M12 18l4 4 8-8" />
      </svg>
    ),
  },
  {
    title: 'Menos vacancia',
    desc: 'Tiempo promedio para arrendar en Bogotá: 3.9 meses. Con inquilinos pre-verificados, usted arrienda más rápido.',
    color: '#10B981',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <circle cx="18" cy="18" r="14" />
        <polyline points="18,8 18,18 26,22" />
      </svg>
    ),
  },
  {
    title: 'Menos riesgo de impago',
    desc: 'Inquilinos con Renty Score alto tienen historial comprobado. Un desahucio en Colombia tarda 3-12 meses. Mejor prevenir.',
    color: '#E8634A',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <polyline points="3,28 10,22 17,25 24,14 33,6" />
        <polyline points="24,6 33,6 33,14" />
      </svg>
    ),
  },
  {
    title: 'Contratos formales',
    desc: 'Formalice su arriendo. El 57% de contratos colombianos son verbales. Con Renty, ambas partes quedan protegidas legalmente.',
    color: '#0D6B58',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <rect x="5" y="3" width="26" height="30" rx="2" />
        <line x1="11" y1="11" x2="25" y2="11" />
        <line x1="11" y1="17" x2="25" y2="17" />
        <line x1="11" y1="23" x2="20" y2="23" />
      </svg>
    ),
  },
];

export default function Landlords() {
  const ref = useRef<HTMLElement>(null);

  useReveals(ref, [
    {
      selector: '[data-landlord-card]',
      vars: { y: 24, opacity: 0, stagger: 0.12, duration: 0.6 },
      triggerSelector: '[data-landlord-grid]',
    },
  ]);

  return (
    <section ref={ref} className="py-24 lg:py-32" id="arrendadores">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
          <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
            Para arrendadores
          </span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
            Arriende con datos,
            <br />
            no con fe.
          </h2>
          <p className="mt-4 font-body text-lg leading-relaxed text-ink-secondary">
            Usted no quiere un codeudor con finca raíz. Usted quiere la certeza de que le van a
            pagar. Renty le da esa certeza con datos reales, no con papeles.
          </p>
        </div>
        <div data-landlord-grid className="grid gap-5 md:grid-cols-2">
          {benefits.map((b) => (
            <div
              key={b.title}
              data-landlord-card
              className="rounded-2xl border border-border bg-sand-dark p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03]"
            >
              <div className="mb-4" style={{ color: b.color }}>
                <div className="h-9 w-9">{b.icon}</div>
              </div>
              <h3 className="mb-2 font-heading text-[17px] font-700 text-ink">{b.title}</h3>
              <p className="font-body text-[14px] leading-relaxed text-ink-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
