'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Eyebrow } from '@/components/ui/Eyebrow';

/**
 * Dark "Renty Score" section — 4-factor breakdown (40/25/20/15 weighting)
 * alongside a live simulator. Sliders drive a 0–1000 score shown in a
 * radial gauge, with color + tag feedback.
 */
interface Factor {
  key: 'pay' | 'job' | 'cap' | 'beh';
  pct: string;
  title: string;
  desc: string;
}

const factors: Factor[] = [
  {
    key: 'pay',
    pct: '40%',
    title: 'Historial de pago',
    desc: 'Arriendos y servicios pagados a tiempo, incluso informales.',
  },
  {
    key: 'job',
    pct: '25%',
    title: 'Estabilidad laboral',
    desc: 'Tiempo en tu trabajo o actividad — formal o independiente.',
  },
  {
    key: 'cap',
    pct: '20%',
    title: 'Capacidad de pago',
    desc: 'Ingresos vs. canon, sin exigir prueba de formalidad.',
  },
  {
    key: 'beh',
    pct: '15%',
    title: 'Comportamiento',
    desc: 'Referencias, permanencia y cuidado del inmueble.',
  },
];

// SVG gauge geometry — radius 108, circumference ≈ 678.58
const R = 108;
const CIRC = 2 * Math.PI * R;

function computeScore(pay: number, job: number, cap: number, beh: number) {
  const payN = (pay - 40) / 60; // 40..100 → 0..1
  const jobN = Math.min(1, job / 6);
  const capN = 1 - Math.min(1, Math.max(0, (cap - 15) / 45));
  const behN = beh / 5;
  const composite = payN * 0.4 + jobN * 0.25 + capN * 0.2 + behN * 0.15;
  return Math.round(300 + composite * 700);
}

type ScoreTone = 'low' | 'mid' | 'ok' | 'high';

function scoreMeta(score: number): { tone: ScoreTone; tokenClass: string; tag: string } {
  if (score < 500) return { tone: 'low', tokenClass: 'text-score-low', tag: 'Bajo · Mejora tu perfil' };
  if (score < 650) return { tone: 'mid', tokenClass: 'text-score-mid', tag: 'Regular · En camino' };
  if (score < 800) return { tone: 'ok', tokenClass: 'text-score-ok', tag: 'Bueno · Aprobado' };
  return { tone: 'high', tokenClass: 'text-score-ok', tag: 'Excelente · Pre-aprobado' };
}

export default function Score() {
  const ref = useRef<HTMLElement>(null);
  const [pay, setPay] = useState(95);
  const [job, setJob] = useState(4);
  const [cap, setCap] = useState(28);
  const [beh, setBeh] = useState(2);

  const score = useMemo(() => computeScore(pay, job, cap, beh), [pay, job, cap, beh]);
  const { tokenClass, tag } = scoreMeta(score);
  const pct = (score - 300) / 700;
  const offset = CIRC * (1 - pct);

  return (
    <section
      ref={ref}
      id="renty-score"
      className="relative overflow-hidden bg-ink py-14 text-white lg:py-24"
    >
      {/* ambient radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(13,107,88,.3), transparent 50%), radial-gradient(circle at 80% 70%, rgba(232,99,74,.15), transparent 50%)',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-14 max-w-[820px] lg:mb-16">
          <Eyebrow tone="inverse" className="mb-4 text-teal-light">Renty Score</Eyebrow>
          <h2
            className="font-display font-400 text-white [letter-spacing:-0.02em]"
            style={{ fontSize: 'clamp(32px, 5vw, 68px)', lineHeight: 1.05, margin: 0 }}
          >
            Un puntaje que <em className="italic text-coral">entiende tu realidad.</em>
          </h2>
          <p
            className="mt-4 max-w-[58ch] font-body text-white/70"
            style={{ fontSize: 19, lineHeight: 1.55 }}
          >
            Tu score no mide cuánto tienes. Mide cómo pagas, qué tan estable eres, y cómo te
            comportas. 4 factores, 100% transparentes.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ── Left: factors + simulator ── */}
          <div className="min-w-0">
            <div className="flex flex-col gap-3">
              {factors.map((f) => (
                <div
                  key={f.key}
                  className="group flex cursor-default items-start gap-4 rounded-[14px] border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 ease-out-expo hover:translate-x-1 hover:border-teal-light/30 hover:bg-white/[0.08]"
                >
                  <span className="min-w-[54px] font-mono text-[18px] font-500 text-coral">
                    {f.pct}
                  </span>
                  <div>
                    <h5 className="mb-1 font-heading text-[17px] font-600 text-white">
                      {f.title}
                    </h5>
                    <p className="font-body text-[14px] leading-[1.5] text-white/60">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-dashed border-white/20 bg-white/[0.05] p-6">
              <h4 className="mb-5 font-heading text-[17px] font-600 text-white">
                Prueba la lógica — simulador inline
              </h4>

              <SliderRow
                label="Pagos puntuales"
                min={40}
                max={100}
                step={1}
                value={pay}
                onChange={setPay}
                format={(v) => `${v}%`}
              />
              <SliderRow
                label="Años en tu trabajo"
                min={0}
                max={10}
                step={0.5}
                value={job}
                onChange={setJob}
                format={(v) => v.toFixed(1)}
              />
              <SliderRow
                label="Canon / ingreso"
                min={15}
                max={60}
                step={1}
                value={cap}
                onChange={setCap}
                format={(v) => `${v}%`}
              />
              <SliderRow
                label="Referencias"
                min={0}
                max={5}
                step={1}
                value={beh}
                onChange={setBeh}
                format={(v) => `${v}`}
              />
            </div>
          </div>

          {/* ── Right: live gauge ── */}
          <div className="flex min-w-0 items-center justify-center">
            <div
              className="relative w-full max-w-[380px] rounded-[28px] border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-md sm:p-8 lg:p-10"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(16,185,129,.1), transparent 60%)',
                }}
              />

              <svg
                viewBox="0 0 260 260"
                className={cn('relative mx-auto block h-auto w-full max-w-[260px]', tokenClass)}
                aria-hidden="true"
              >
                <circle
                  cx="130"
                  cy="130"
                  r={R}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.15}
                  strokeWidth={16}
                  className="text-white"
                />
                <circle
                  cx="130"
                  cy="130"
                  r={R}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={16}
                  strokeDasharray={CIRC}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 130 130)"
                  className="transition-[stroke-dashoffset,color] duration-[400ms] ease-[var(--ease-out-expo)]"
                />
                <text
                  x={130}
                  y={132}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fontWeight={500}
                  fontSize={72}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {score}
                </text>
                <text
                  x={130}
                  y={168}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.5)"
                  fontFamily='"DM Sans", sans-serif'
                  fontSize={11}
                  letterSpacing="0.14em"
                >
                  RENTY SCORE
                </text>
              </svg>

              <div
                aria-live="polite"
                className="mt-3.5 font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-white/45"
              >
                {tag}
              </div>

              <div className="relative mt-7">
                <Link
                  href="/renty-score/formulario"
                  className="inline-flex h-[54px] items-center gap-2.5 rounded-[14px] bg-coral px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-lg hover:shadow-coral/20"
                >
                  Calcular el mío real
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SliderRowProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}
function SliderRow({ label, min, max, step, value, onChange, format }: SliderRowProps) {
  return (
    <label className="mb-4 flex flex-col gap-1.5 last:mb-0 sm:mb-3 sm:flex-row sm:items-center sm:gap-4">
      <span className="flex items-baseline justify-between gap-3 font-body text-[13px] text-white/70 sm:w-[140px] sm:flex-none sm:justify-start sm:text-[14px]">
        {label}
        <span className="font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-coral sm:hidden">
          {format(value)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="renty-slider w-full min-w-0 sm:flex-1"
      />
      <span className="hidden w-[64px] flex-none text-right font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-coral sm:inline">
        {format(value)}
      </span>
    </label>
  );
}
