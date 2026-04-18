'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

/**
 * Dark "cómo funciona tu score" section with a semicircular gauge and
 * 5 weighted factor sliders. Score: 300..900.
 */
interface Factor {
  key: 'f1' | 'f2' | 'f3' | 'f4' | 'f5';
  icon: React.ReactNode;
  label: string;
  unit: '%' | 'años';
  min: number;
  max: number;
  default: number;
  weight: number;
  desc: string;
  norm: (v: number) => number;
}

const factors: Factor[] = [
  {
    key: 'f1',
    label: 'Puntualidad de pago',
    unit: '%',
    min: 40,
    max: 100,
    default: 92,
    weight: 0.35,
    desc: '% de pagos de arriendo a tiempo en los últimos 24 meses.',
    norm: (v) => (v - 40) / 60,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M9 15l2 2 4-4" /></svg>
    ),
  },
  {
    key: 'f2',
    label: 'Años de historial',
    unit: 'años',
    min: 0,
    max: 15,
    default: 6,
    weight: 0.20,
    desc: 'Tiempo arrendando — verbal o escrito, los dos cuentan.',
    norm: (v) => Math.min(v / 12, 1),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    ),
  },
  {
    key: 'f3',
    label: 'Estabilidad de ingresos',
    unit: '%',
    min: 30,
    max: 100,
    default: 80,
    weight: 0.20,
    desc: 'Ingresos constantes — Nequi, facturación, nómina, o mezcla.',
    norm: (v) => (v - 30) / 70,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="17 7 22 7 22 12" /></svg>
    ),
  },
  {
    key: 'f4',
    label: 'Estabilidad de vivienda',
    unit: '%',
    min: 20,
    max: 100,
    default: 75,
    weight: 0.15,
    desc: 'Menos de 2 mudanzas en los últimos 5 años.',
    norm: (v) => (v - 20) / 80,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2V10z" /></svg>
    ),
  },
  {
    key: 'f5',
    label: 'Verificaciones completas',
    unit: '%',
    min: 0,
    max: 100,
    default: 60,
    weight: 0.10,
    desc: 'Identidad, arrendador anterior, empleo, ingresos.',
    norm: (v) => v / 100,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
    ),
  },
];

function tierFor(score: number): { tier: string; tone: 'teal' | 'amber' | 'coral'; verdict: string } {
  if (score >= 780) return { tier: 'Excelente inquilino', tone: 'teal', verdict: '"Renty verifica tu historial — sin codeudor con finca raíz."' };
  if (score >= 700) return { tier: 'Buen inquilino', tone: 'teal', verdict: '"Tu historial es sólido. La mayoría de arriendos están abiertos para ti."' };
  if (score >= 620) return { tier: 'Inquilino estable', tone: 'amber', verdict: '"Un par de verificaciones extra y estás listo para aplicar."' };
  if (score >= 540) return { tier: 'Construyendo historial', tone: 'amber', verdict: '"Estás empezando. Te mostramos cómo mejorar cada factor."' };
  return { tier: 'Necesita fortalecer', tone: 'coral', verdict: '"Te acompañamos paso a paso para construir tu score."' };
}

// Semicircular arc length for the gauge (radius 130, half circle)
const ARC_LEN = Math.PI * 130;

export default function InquilinosScoreDemo() {
  const [values, setValues] = useState<Record<Factor['key'], number>>({
    f1: factors[0]!.default,
    f2: factors[1]!.default,
    f3: factors[2]!.default,
    f4: factors[3]!.default,
    f5: factors[4]!.default,
  });

  const score = useMemo(() => {
    const weighted = factors.reduce((acc, f) => acc + f.norm(values[f.key]) * f.weight, 0);
    return Math.round(300 + weighted * 600);
  }, [values]);

  const { tier, tone, verdict } = tierFor(score);
  const pct = (score - 300) / 600;
  const offset = ARC_LEN * (1 - pct);

  const toneColor = tone === 'teal' ? '#10B981' : tone === 'amber' ? '#F59E0B' : '#E8634A';

  return (
    <section
      id="score-demo"
      className="relative overflow-hidden bg-ink py-20 text-white lg:py-[120px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 20%, rgba(16,185,129,.12), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(232,99,74,.08), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto mb-14 max-w-[720px] text-center lg:mb-16">
          <span className="mb-4 inline-flex items-center gap-2.5 font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-teal-light before:inline-block before:h-px before:w-[18px] before:bg-current before:opacity-55">
            Cómo funciona tu score
          </span>
          <h2
            className="mt-4 font-display font-400 text-white [letter-spacing:-0.02em]"
            style={{ fontSize: 'clamp(32px, 4.6vw, 54px)', lineHeight: 1.1 }}
          >
            Tu historial, traducido en un <em className="italic text-teal-light">número.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] font-body text-white/65" style={{ fontSize: 18, lineHeight: 1.55 }}>
            Ajusta los factores y mira cómo se construye el Renty Score. Lo calculamos con 12
            señales — estas son las 5 principales.
          </p>
        </div>

        <div className="mx-auto grid max-w-[1040px] grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* ── Gauge card ── */}
          <div className="relative min-w-0 rounded-[28px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md sm:p-10">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] font-500 tracking-[0.16em] uppercase text-teal-light">
                Renty Score · Vista previa
              </div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-white/50">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-teal-light"
                  style={{ boxShadow: '0 0 8px var(--color-teal-light)' }}
                />
                En tiempo real
              </div>
            </div>

            <svg viewBox="0 0 340 200" className="mx-auto mt-4 block h-auto w-full max-w-[340px]" aria-hidden="true">
              <defs>
                <linearGradient id="inq-gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E8634A" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              <path d="M 40 170 A 130 130 0 0 1 300 170" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} strokeLinecap="round" />
              <path
                d="M 40 170 A 130 130 0 0 1 300 170"
                fill="none"
                stroke="url(#inq-gauge-grad)"
                strokeWidth={14}
                strokeLinecap="round"
                strokeDasharray={ARC_LEN}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 400ms var(--ease-out-expo)' }}
              />
              <text x="40" y="198" fill="#6B6560" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="10" textAnchor="middle">300</text>
              <text x="170" y="18" fill="#6B6560" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="10" textAnchor="middle">600</text>
              <text x="300" y="198" fill="#6B6560" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="10" textAnchor="middle">900</text>
            </svg>

            <div
              className="-mt-28 text-center font-mono font-500 [letter-spacing:-0.02em]"
              style={{
                fontSize: 72,
                lineHeight: 1,
                color: toneColor,
                fontVariantNumeric: 'tabular-nums',
                transition: 'color 300ms',
              }}
            >
              {score}
            </div>
            <div
              className="mt-3 text-center font-mono text-[11px] font-500 tracking-[0.16em] uppercase"
              style={{ color: toneColor, transition: 'color 300ms' }}
            >
              {tier}
            </div>
            <p
              aria-live="polite"
              className="mx-auto mt-6 max-w-[28ch] text-center font-display text-[18px] italic leading-[1.4] text-white/90 sm:text-[20px]"
            >
              {verdict}
            </p>
          </div>

          {/* ── Factor sliders ── */}
          <div className="flex min-w-0 flex-col gap-4">
            {factors.map((f) => (
              <div
                key={f.key}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors duration-200 hover:border-teal-light/30"
              >
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <label htmlFor={`inq-${f.key}`} className="inline-flex items-center gap-2.5 font-heading text-[13px] font-500 text-white">
                    <span className="inline-block h-4 w-4 text-teal-light">{f.icon}</span>
                    {f.label}
                  </label>
                  <span className="font-mono text-[14px] font-500 text-teal-light">
                    {values[f.key]}
                    {f.unit === '%' ? '%' : ` ${f.unit}`}
                  </span>
                </div>
                <input
                  id={`inq-${f.key}`}
                  type="range"
                  min={f.min}
                  max={f.max}
                  value={values[f.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: parseInt(e.target.value, 10) }))}
                  className="renty-slider w-full"
                />
                <p className="mt-2 font-body text-[12px] leading-[1.5] text-white/60">{f.desc}</p>
              </div>
            ))}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/renty-score/formulario"
                className="inline-flex h-[54px] items-center gap-2.5 rounded-[14px] bg-teal px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
              >
                Calcular mi score real
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <span className="font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-white/60">
                3 min · 12 preguntas · Gratis
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
