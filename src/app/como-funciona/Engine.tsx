'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * Interactive engine — the flagship of this page.
 * Drag the track (or click) to move the score; the big gauge ring and
 * verdict pill react live. Clicking a factor highlights it visually.
 */
interface Factor {
  key: 'pago' | 'laboral' | 'capacidad' | 'comportamiento';
  pct: string;
  title: string;
  desc: string;
}
const factors: Factor[] = [
  {
    key: 'pago',
    pct: '40%',
    title: 'Historial de pago',
    desc: 'Arriendos, servicios y cuotas pagadas a tiempo en los últimos 24 meses.',
  },
  {
    key: 'laboral',
    pct: '25%',
    title: 'Estabilidad laboral',
    desc: 'Tiempo en tu trabajo o actividad. Incluye independientes, informales y honorarios.',
  },
  {
    key: 'capacidad',
    pct: '20%',
    title: 'Capacidad de pago',
    desc: 'Ingresos vs. canon. Sin exigir formalidad — movimientos Nequi y Daviplata cuentan.',
  },
  {
    key: 'comportamiento',
    pct: '15%',
    title: 'Comportamiento',
    desc: 'Referencias de arrendadores anteriores, permanencia y cuidado del inmueble.',
  },
];

// Big gauge geometry — radius 132 → circumference ≈ 829.38
const R = 132;
const CIRC = 2 * Math.PI * R;

function verdictFor(n: number): { label: string; tone: 'green' | 'amber' | 'red' } {
  if (n < 400) return { label: 'En construcción', tone: 'red' };
  if (n < 550) return { label: 'Por mejorar', tone: 'red' };
  if (n < 700) return { label: 'Aceptable', tone: 'amber' };
  if (n < 850) return { label: 'Excelente', tone: 'green' };
  return { label: 'Sobresaliente', tone: 'green' };
}

export default function Engine() {
  const [score, setScore] = useState(785);
  const [activeFactor, setActiveFactor] = useState<Factor['key']>('pago');
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setScoreFromEvent = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setScore(Math.round(pct * 1000));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    trackRef.current?.setPointerCapture(e.pointerId);
    setScoreFromEvent(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setScoreFromEvent(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 50 : 10;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setScore((s) => Math.max(0, s - step));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setScore((s) => Math.min(1000, s + step));
    } else if (e.key === 'Home') {
      setScore(0);
    } else if (e.key === 'End') {
      setScore(1000);
    }
  };

  const pct = score / 1000;
  const offset = CIRC * (1 - pct);
  const { label: verdict, tone } = verdictFor(score);

  const toneBg =
    tone === 'green'
      ? 'bg-teal/15 border-teal-light/30 text-teal-light'
      : tone === 'amber'
      ? 'bg-warning/15 border-warning/30 text-warning'
      : 'bg-error/15 border-error/40 text-error';

  return (
    <section
      id="motor"
      className="relative overflow-hidden bg-ink py-14 text-white lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-[300px] h-[800px] w-[800px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,.12), transparent 60%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[200px] -right-[100px] h-[600px] w-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(232,99,74,.08), transparent 60%)' }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-[760px] text-center lg:mb-20">
          <span className="mb-4 inline-flex items-center gap-2.5 font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-coral before:inline-block before:h-px before:w-6 before:bg-current before:opacity-55">
            El motor · Renty Score
          </span>
          <h2
            className="font-display font-400 text-white [letter-spacing:-0.02em]"
            style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1.05, margin: 0 }}
          >
            4 factores. 100% transparentes.<br />
            <em className="italic text-coral">Cero cajas negras.</em>
          </h2>
          <p
            className="mx-auto mt-4 max-w-[56ch] font-body text-white/65"
            style={{ fontSize: 19, lineHeight: 1.55 }}
          >
            Mueve el slider para ver cómo cambia el score. Cada factor pesa distinto, y cada factor
            tiene explicación — nunca vas a recibir un &ldquo;no&rdquo; sin saber por qué.
          </p>
        </div>

        {/* Grid: big gauge + factors */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Big gauge */}
          <div className="relative mx-auto aspect-square w-full min-w-0 max-w-[480px]">
            <svg viewBox="0 0 320 320" className="block h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="cf-grad-teal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#10B981" />
                  <stop offset="1" stopColor="#0D6B58" />
                </linearGradient>
              </defs>
              <circle cx="160" cy="160" r={R} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={20} />
              <circle
                cx="160"
                cy="160"
                r={R}
                fill="none"
                stroke="url(#cf-grad-teal)"
                strokeWidth={20}
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 160 160)"
                style={{ transition: 'stroke-dashoffset 0.25s var(--ease-out-expo)' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-[11px] font-500 tracking-[0.16em] uppercase text-white/55">
                Renty Score
              </span>
              <div
                className="font-mono font-500 leading-none text-white [letter-spacing:-0.03em]"
                style={{
                  fontSize: 'clamp(72px, 10vw, 128px)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {score}
              </div>
              <span className="mt-2 font-mono text-[11px] font-500 tracking-[0.16em] uppercase text-white/45">
                De 1000
              </span>
              <span
                className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-heading text-[13px] font-600 ${toneBg}`}
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                </svg>
                {verdict}
              </span>
            </div>
          </div>

          {/* Factors */}
          <div className="flex min-w-0 flex-col gap-2.5">
            {factors.map((f) => {
              const isActive = f.key === activeFactor;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFactor(f.key)}
                  aria-pressed={isActive}
                  className={`grid cursor-pointer grid-cols-[52px_1fr_28px] items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ease-out-expo sm:grid-cols-[60px_1fr_28px] sm:p-5 ${
                    isActive
                      ? 'border-teal-light/30 bg-white/[0.08]'
                      : 'border-white/10 bg-white/[0.04] hover:-translate-x-1 hover:border-teal-light/30 hover:bg-white/[0.08]'
                  }`}
                >
                  <span
                    className="font-mono text-[22px] font-500 leading-none text-teal-light [letter-spacing:-0.02em] sm:text-[28px]"
                  >
                    {f.pct}
                  </span>
                  <div className="min-w-0">
                    <h5 className="mb-1 font-heading text-[14px] font-600 text-white sm:text-[16px]">
                      {f.title}
                    </h5>
                    <p className="font-body text-[12px] leading-[1.4] text-white/60 sm:text-[14px]">
                      {f.desc}
                    </p>
                  </div>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                      isActive
                        ? '-rotate-45 bg-teal text-white'
                        : 'bg-white/[0.06] text-white/50'
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mx-auto mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 sm:mt-12 sm:max-w-[640px] sm:gap-5 sm:px-7">
          <span className="font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-white/60 sm:text-[11px]">
            Simula tu score
          </span>
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="slider"
            aria-label="Simular Renty Score"
            aria-valuemin={0}
            aria-valuemax={1000}
            aria-valuenow={score}
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="relative h-[6px] min-w-0 flex-1 cursor-pointer rounded-full bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-teal-light focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
            style={{ touchAction: 'none' }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${pct * 100}%`,
                background: 'linear-gradient(90deg, #DC2626 0%, #F59E0B 40%, #16A34A 75%)',
              }}
            />
            <span
              aria-hidden="true"
              className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
              style={{ left: `${pct * 100}%` }}
            />
          </div>
          <span className="min-w-[48px] text-right font-mono text-[16px] font-500 text-white sm:text-[18px]">
            {score}
          </span>
        </div>
      </div>
    </section>
  );
}
