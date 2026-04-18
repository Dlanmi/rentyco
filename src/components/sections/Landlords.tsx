'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useReveals } from '@/lib/useReveal';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface Feat {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const feats: Feat[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'Score verificado de verdad',
    desc: 'Sabemos si cumple requisitos antes de que te llame. Tú decides si recibir la solicitud.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 2h4M12 4v4" />
        <circle cx="12" cy="14" r="8" />
        <path d="M12 10v4l3 2" />
      </svg>
    ),
    title: 'Hasta 60% menos tiempo',
    desc: 'Filtra inquilinos con datos reales en vez de intuición y teléfonos.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 12V8a2 2 0 00-2-2H5a2 2 0 000 4h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V10" />
        <circle cx="17" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: '0% comisión al publicar',
    desc: 'Publicas tu inmueble gratis. Cobramos solo al cerrar. Sin letra chica.',
  },
];

interface Row {
  k: string;
  v: string;
  good?: boolean;
}
const rows: Row[] = [
  { k: 'Renty Score', v: '785 · Excelente', good: true },
  { k: 'Historial de pago', v: '96% puntual', good: true },
  { k: 'Estabilidad laboral', v: '4.2 años · Mismo trabajo' },
  { k: 'Canon / ingreso', v: '28%', good: true },
  { k: 'Referencias', v: '2 verificadas' },
  { k: 'Documento', v: 'CC · Validada biométrica' },
];

export default function Landlords() {
  const ref = useRef<HTMLElement>(null);

  useReveals(ref, [
    {
      selector: '[data-landlord-left] > *',
      vars: { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 },
      triggerSelector: '[data-landlord-left]',
    },
    {
      selector: '[data-landlord-card]',
      vars: { y: 28, opacity: 0, duration: 0.7 },
      triggerSelector: '[data-landlord-card]',
    },
  ]);

  return (
    <section ref={ref} id="arrendadores" className="bg-white py-14 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* ── Left ── */}
          <div data-landlord-left className="min-w-0">
            <Eyebrow tone="coral" className="mb-4">Para arrendadores</Eyebrow>
            <h2
              className="mb-5 mt-4 font-display font-400 text-ink [letter-spacing:-0.02em]"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1.05, margin: '18px 0 20px' }}
            >
              Inquilinos evaluados.
              <br />
              <em className="italic text-teal">Riesgo medible.</em>
            </h2>
            <p
              className="max-w-[48ch] font-body text-ink-secondary"
              style={{ fontSize: 18, lineHeight: 1.55 }}
            >
              Cada inquilino que te llega por Renty trae su score verificado, su historial de pago
              y su perfil laboral. Menos tiempo revisando, menos inmuebles vacíos.
            </p>

            <div className="mt-8 grid gap-5">
              {feats.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-4 rounded-[14px] p-4 transition-colors duration-200 hover:bg-sand"
                >
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-lighter text-teal">
                    <div className="h-5 w-5">{f.icon}</div>
                  </div>
                  <div>
                    <h5 className="mb-1 font-heading text-[16px] font-600 text-ink">{f.title}</h5>
                    <p className="font-body text-[14px] leading-[1.5] text-ink-muted">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/arrendadores"
                className="inline-flex h-[54px] items-center gap-2.5 rounded-[14px] bg-teal px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
              >
                Publicar mi inmueble
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── Right: tenant card ── */}
          <div
            data-landlord-card
            className="relative min-w-0 rounded-[28px] border border-border p-6 shadow-[0_12px_24px_rgba(0,0,0,0.08),0_4px_8px_rgba(0,0,0,0.04)] sm:p-8"
            style={{ background: 'linear-gradient(180deg, var(--color-sand), var(--color-sand-dark))' }}
          >
            {/* teal top accent line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[20%] right-[20%] -top-px h-0.5"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-teal), transparent)' }}
            />

            <div className="mb-5 flex items-center justify-between border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white font-heading text-[15px] font-700"
                  style={{ background: 'linear-gradient(135deg, #E8634A, #0D6B58)' }}
                  aria-hidden="true"
                >
                  MR
                </div>
                <div>
                  <h4 className="m-0 font-heading text-[16px] font-600 text-ink">María Rodríguez</h4>
                  <div className="font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-ink-muted">
                    Inquilina · 34 años · Bogotá
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal px-2.5 py-1 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-white">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3 3 4-1 1 4 3 3-3 3-1 4-4-1-3 3-3-3-4 1-1-4-3-3 3-3 1-4 4 1z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Verificada
              </span>
            </div>

            <dl className="space-y-0">
              {rows.map((r, i) => (
                <div
                  key={r.k}
                  className={`flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
                    i < rows.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <dt className="font-body text-[13px] text-ink-muted sm:text-[14px]">{r.k}</dt>
                  <dd
                    className={`m-0 font-heading text-[14px] font-600 sm:text-right ${
                      r.good ? 'text-teal' : 'text-ink'
                    }`}
                  >
                    {r.v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-teal px-5 font-heading text-[13px] font-600 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
              >
                Aceptar solicitud
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-border-strong bg-white px-5 font-heading text-[13px] font-600 text-ink transition-all duration-200 hover:border-teal hover:text-teal"
              >
                Ver perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
