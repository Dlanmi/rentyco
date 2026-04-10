'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useReveals } from '@/lib/useReveal';

/*
 * Renty Score — Interactive SVG radial chart
 * Circle r=130, cx/cy=180, circumference ≈ 816.81
 * 5 segments of 163.36 each, 6px gap → visible dash = 157.36
 * Icons at r=165 (outside ring) at each segment midpoint
 */
const R = 130;
const CX = 180;
const CY = 180;
const CIRC = 2 * Math.PI * R;
const SEG = CIRC / 5;
const GAP = 6;
const DASH = SEG - GAP;
const SPACE = CIRC - DASH;
const ICON_R = 165;
const CONN_R = 143;

const pos = (angleDeg: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + ICON_R * Math.cos(rad), y: CY + ICON_R * Math.sin(rad) };
};
const connStart = (angleDeg: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + CONN_R * Math.cos(rad), y: CY + CONN_R * Math.sin(rad) };
};

interface Factor {
  color: string;
  name: string;
  desc: string;
  icon: string;
  offset: number;
  angle: number;
}

const factors: Factor[] = [
  {
    color: '#0D6B58',
    name: 'Historial de arriendo',
    desc: 'Cuánto tiempo llevas arrendando y cómo ha sido tu comportamiento con los pagos de arriendo.',
    icon: 'M-4,-5 L-4,5 L4,5 L4,-5 Z M-2,-2 L-0.5,0.5 L3,-3',
    offset: -(0 * SEG),
    angle: -54,
  },
  {
    color: '#10B981',
    name: 'Capacidad de pago',
    desc: 'Tu relación ingreso-arriendo y tu capacidad real de cumplir con el canon mensual.',
    icon: 'M3,-3 A4.2,4.2,0,1,0,3,3 M3,3 L5,1 M3,3 L1,1',
    offset: -(1 * SEG),
    angle: 18,
  },
  {
    color: '#E8634A',
    name: 'Estabilidad como inquilino',
    desc: 'Tu continuidad en arriendos anteriores y tu comportamiento general como inquilino.',
    icon: 'M0,-5 L1.5,-1.5 L5.5,-1.5 L2.5,1 L3.5,5 L0,2.5 L-3.5,5 L-2.5,1 L-5.5,-1.5 L-1.5,-1.5 Z',
    offset: -(2 * SEG),
    angle: 90,
  },
  {
    color: '#F59E0B',
    name: 'Responsabilidad financiera',
    desc: 'Tus hábitos con servicios públicos y obligaciones recurrentes del día a día.',
    icon: 'M1,-5 L-2,0 L0.5,0 L-1,5 L4,0 L1.5,0 Z',
    offset: -(3 * SEG),
    angle: 162,
  },
  {
    color: '#A8A29E',
    name: 'Perfil financiero digital',
    desc: 'Tu presencia en plataformas financieras digitales y acceso a herramientas de pago modernas.',
    icon: 'M-3,-5 L3,-5 C3.8,-5,4,-4.5,4,-4 L4,4 C4,4.5,3.8,5,3,5 L-3,5 C-3.8,5,-4,4.5,-4,4 L-4,-4 C-4,-4.5,-3.8,-5,-3,-5 Z M-1,3.5 L1,3.5',
    offset: -(4 * SEG),
    angle: 234,
  },
];

export default function Score() {
  const ref = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const iconPositions = useMemo(() => factors.map((f) => pos(f.angle)), []);
  const connStarts = useMemo(() => factors.map((f) => connStart(f.angle)), []);

  const toggleFactor = (i: number) => setActiveIndex((prev) => (prev === i ? null : i));

  // Entrance + ambient animation
  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current!, start: 'top 65%', once: true },
      });

      tl.to('[data-score-bg-ring]', { opacity: 1, duration: 0.6, ease: 'power2.out' })
        .to(
          '.score-segment',
          {
            opacity: 1,
            stagger: { each: 0.15, from: 'start' },
            duration: 0.7,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .to('[data-score-inner-ring]', { opacity: 1, duration: 0.4 }, '-=0.4')
        .to('[data-score-orbit]', { opacity: 0.15, duration: 0.8, ease: 'power1.out' }, '-=0.6')
        .to(
          '.score-connector',
          { opacity: 0.25, stagger: 0.08, duration: 0.4, ease: 'power2.out' },
          '-=0.4'
        )
        .to(
          '.score-icon-node',
          {
            opacity: 1,
            stagger: { each: 0.1, from: 'start' },
            duration: 0.45,
            ease: 'power2.out',
          },
          '-=0.3'
        );

      const scoreNum = document.querySelector('[data-score-number]');
      if (scoreNum) {
        tl.to(scoreNum, { opacity: 1, duration: 0.3 }, '-=0.5');
        tl.to(
          { val: 0 },
          {
            val: 785,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate() {
              scoreNum.textContent = Math.round(
                (this.targets()[0] as { val: number }).val
              ).toString();
            },
          },
          '-=0.3'
        );
      }
      tl.to('[data-score-label-svg]', { opacity: 1, duration: 0.4 }, '-=1.2');

      gsap.to('[data-score-orbit]', {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: 'none',
        transformOrigin: '180px 180px',
        force3D: true,
      });
      gsap.to('[data-score-bg-ring]', {
        scale: 1.04,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: '180px 180px',
        force3D: true,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  useReveals(ref, [
    { selector: '[data-score-label]', vars: { y: 16, opacity: 0, duration: 0.5 }, triggerSelector: '[data-score]' },
    { selector: '[data-score-title]', vars: { y: 20, opacity: 0, duration: 0.6, delay: 0.1 }, triggerSelector: '[data-score]' },
    { selector: '[data-score-text]', vars: { y: 16, opacity: 0, duration: 0.5, delay: 0.2 }, triggerSelector: '[data-score]' },
    { selector: '[data-score-hint]', vars: { opacity: 0, duration: 0.4, delay: 0.4 }, triggerSelector: '[data-score]' },
    { selector: '[data-score-cta]', vars: { y: 12, opacity: 0, duration: 0.5, delay: 0.5 }, triggerSelector: '[data-score]' },
    { selector: '.score-pill', vars: { y: 12, opacity: 0, stagger: 0.08, duration: 0.5 }, triggerSelector: '[data-score-factors]' },
  ]);

  const active = activeIndex !== null ? factors[activeIndex] : null;

  return (
    <section
      ref={ref}
      data-score
      className="overflow-hidden bg-ink py-24 lg:py-32"
      id="renty-score"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <span
              data-score-label
              className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral"
            >
              Renty Score
            </span>
            <h2
              data-score-title
              className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-white"
            >
              Un puntaje que mide
              <br />
              cómo pagas, no cuánto tienes.
            </h2>
            <p
              data-score-text
              className="mt-4 max-w-lg font-body text-lg leading-relaxed text-white/75"
            >
              DataCrédito solo ve si debes plata. El Renty Score evalúa cómo eres
              como inquilino — tu historial de pagos, estabilidad, capacidad financiera
              y responsabilidad con tus obligaciones.
            </p>

            <div
              className="mt-6 overflow-hidden rounded-xl border bg-white/5 backdrop-blur-sm"
              aria-live="polite"
              aria-atomic="true"
              style={{
                maxHeight: active ? '200px' : '0',
                opacity: active ? 1 : 0,
                padding: active ? '1.25rem' : '0',
                borderColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                transition:
                  'max-height 0.4s ease, opacity 0.3s ease, padding 0.3s ease, border-color 0.3s ease',
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-block h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ background: active?.color ?? 'transparent' }}
                />
                <div>
                  <h4 className="font-heading text-md font-600 text-white">
                    {active?.name || ''}
                  </h4>
                  <p className="mt-1.5 font-body text-label leading-relaxed text-white/60">
                    {active?.desc || ''}
                  </p>
                </div>
              </div>
            </div>

            <p data-score-hint className="mt-4 font-body text-label text-white/40">
              Haz clic en los iconos del gráfico para explorar cada factor.
            </p>

            <div data-score-cta className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/renty-score/formulario"
                className="inline-flex items-center gap-2 rounded-xl bg-coral px-6 py-3 font-heading text-[14px] font-600 text-white no-underline transition-all duration-200 hover:-translate-y-px hover:bg-coral-dark"
              >
                Calcular mi Renty Score
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/renty-score"
                className="inline-flex min-h-[44px] items-center font-heading text-label font-500 text-white/60 no-underline transition-colors hover:text-white"
              >
                Conoce más sobre el Renty Score &rarr;
              </a>
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative mx-auto aspect-square w-full max-w-[380px]">
              <svg
                viewBox="-10 -10 380 380"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  {factors.map((f, i) => {
                    const r = parseInt(f.color.slice(1, 3), 16) / 255;
                    const g = parseInt(f.color.slice(3, 5), 16) / 255;
                    const b = parseInt(f.color.slice(5, 7), 16) / 255;
                    return (
                      <filter
                        key={i}
                        id={`glow-${i}`}
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                      >
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                        <feColorMatrix
                          in="blur"
                          type="matrix"
                          values={`0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 0.6 0`}
                        />
                        <feMerge>
                          <feMergeNode />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    );
                  })}
                </defs>

                <circle
                  data-score-orbit
                  cx={CX}
                  cy={CY}
                  r="155"
                  stroke="#0D6B58"
                  strokeWidth="0.4"
                  style={{ opacity: 0 }}
                  fill="none"
                  strokeDasharray="4 8"
                />
                <circle
                  data-score-bg-ring
                  cx={CX}
                  cy={CY}
                  r={R}
                  stroke="#292524"
                  strokeWidth="16"
                  fill="none"
                  style={{ opacity: 0 }}
                />

                {factors.map((f, i) => (
                  <circle
                    key={i}
                    data-segment={i}
                    className={`score-segment ${activeIndex === i ? 'is-active' : ''}`}
                    cx={CX}
                    cy={CY}
                    r={R}
                    stroke={f.color}
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${DASH} ${SPACE}`}
                    strokeDashoffset={f.offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${CX} ${CY})`}
                    style={{ cursor: 'pointer', opacity: 0 }}
                    filter={activeIndex === i ? `url(#glow-${i})` : undefined}
                    onClick={() => toggleFactor(i)}
                  />
                ))}

                <circle
                  data-score-inner-ring
                  cx={CX}
                  cy={CY}
                  r="108"
                  stroke="#292524"
                  strokeWidth="0.5"
                  fill="none"
                  style={{ opacity: 0 }}
                />

                <text
                  data-score-number
                  x={CX}
                  y="172"
                  textAnchor="middle"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fontSize="52"
                  fontWeight="500"
                  fill="white"
                  style={{ opacity: 0 }}
                >
                  0
                </text>
                <text
                  data-score-label-svg
                  x={CX}
                  y="198"
                  textAnchor="middle"
                  fontFamily="'DM Sans', sans-serif"
                  fontSize="11"
                  fill="#A8A29E"
                  letterSpacing="0.14em"
                  style={{ opacity: 0 }}
                >
                  RENTY SCORE
                </text>

                {factors.map((f, i) => {
                  const cs = connStarts[i]!;
                  const ip = iconPositions[i]!;
                  return (
                    <line
                      key={i}
                      data-connector={i}
                      className={`score-connector ${activeIndex === i ? 'is-active' : ''}`}
                      x1={cs.x}
                      y1={cs.y}
                      x2={ip.x}
                      y2={ip.y}
                      stroke={f.color}
                      strokeWidth="1"
                      style={{ opacity: 0 }}
                      strokeDasharray="3 3"
                    />
                  );
                })}

                {factors.map((f, i) => {
                  const ip = iconPositions[i]!;
                  return (
                    <g
                      key={i}
                      className={`score-icon-node ${activeIndex === i ? 'is-active' : ''}`}
                      style={
                        activeIndex === i
                          ? ({ cursor: 'pointer', opacity: 0, ['--active-color' as string]: f.color } as React.CSSProperties)
                          : { cursor: 'pointer', opacity: 0 }
                      }
                      onClick={() => toggleFactor(i)}
                    >
                      <circle cx={ip.x} cy={ip.y} r="22" fill="transparent" />
                      <circle
                        cx={ip.x}
                        cy={ip.y}
                        r="18"
                        fill="#1C1917"
                        stroke={f.color}
                        strokeWidth="2"
                        className="score-icon-bg"
                      />
                      <g transform={`translate(${ip.x}, ${ip.y})`}>
                        <path
                          d={f.icon}
                          stroke={f.color}
                          strokeWidth="1.3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="score-icon-path"
                        />
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        <div
          data-score-factors
          className="mt-12 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-10 lg:gap-6"
        >
          {factors.map((f, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleFactor(i)}
              className={`score-pill ${activeIndex === i ? 'is-active' : ''} flex cursor-pointer items-center gap-2 rounded-full border border-transparent px-4 py-3 transition-all duration-200 hover:border-white/20 hover:bg-white/5`}
              aria-label={`Explorar factor: ${f.name}`}
            >
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: f.color }}
              />
              <span className="font-heading text-[12px] font-500 text-white/70">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        :global(.score-icon-bg) {
          transition:
            fill 0.35s cubic-bezier(0.16, 1, 0.3, 1),
            stroke-width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
            r 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        :global(.score-icon-path) {
          transition: stroke 0.3s;
        }
        :global(.score-icon-node:hover .score-icon-bg) {
          stroke-width: 3;
          r: 20;
        }
        :global(.score-icon-node.is-active .score-icon-bg) {
          fill: var(--active-color);
          stroke-width: 3;
          r: 20;
        }
        :global(.score-icon-node.is-active .score-icon-path) {
          stroke: white;
        }
        :global(.score-segment) {
          transition:
            stroke-width 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.3s;
        }
        :global(.score-segment.is-active) {
          stroke-width: 22;
        }
        :global(.score-connector) {
          transition: opacity 0.3s;
        }
        :global(.score-connector.is-active) {
          opacity: 0.6 !important;
        }
        :global(.score-pill) {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        :global(.score-pill.is-active) {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }
        :global(.score-pill.is-active span:last-child) {
          color: white;
        }
      `}</style>
    </section>
  );
}
