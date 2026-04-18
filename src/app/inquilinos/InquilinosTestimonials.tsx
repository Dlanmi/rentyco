'use client';

import { useEffect, useRef, useState } from 'react';

interface Slide {
  initials: string;
  grad: string;
  tag: string;
  quote: string;
  name: string;
  sub: string;
  stats: { k: string; l: string }[];
}

const slides: Slide[] = [
  {
    initials: 'MF',
    grad: 'linear-gradient(140deg, #d4b896, #8b6f54)',
    tag: 'Bogotá · Kennedy',
    quote:
      'Llevaba 8 años pagando arriendo en el mismo barrio. Ninguna inmobiliaria me creía — hasta que mi Renty Score dijo que sí.',
    name: 'María Fernanda, 34 años',
    sub: 'Estilista · Informal · Kennedy, Bogotá',
    stats: [
      { k: '782', l: 'Renty Score' },
      { k: '14 días', l: 'En conseguir arriendo' },
      { k: '$1.4M', l: 'Apto 2 habitaciones' },
    ],
  },
  {
    initials: 'JD',
    grad: 'linear-gradient(140deg, #a89e8a, #5f5142)',
    tag: 'Bogotá · Teusaquillo',
    quote:
      'Soy freelance, gano en dólares. Antes me rechazaban por "sin contrato laboral". Renty entendió mi flujo y eso cambió todo.',
    name: 'Juan David, 29 años',
    sub: 'Diseñador freelance · Teusaquillo, Bogotá',
    stats: [
      { k: '804', l: 'Renty Score' },
      { k: '6 días', l: 'En conseguir arriendo' },
      { k: '$2.1M', l: 'Estudio amoblado' },
    ],
  },
  {
    initials: 'CP',
    grad: 'linear-gradient(140deg, #c9a888, #7a5a3f)',
    tag: 'Bogotá · Chapinero',
    quote:
      'Tenía un reporte de hace 7 años que no me dejaba en paz. El Renty Score miró todo lo demás — y por fin me dieron el "sí".',
    name: 'Carolina, 28 años',
    sub: 'Emprendedora · Peluquería · Chapinero, Bogotá',
    stats: [
      { k: '698', l: 'Renty Score' },
      { k: '21 días', l: 'En conseguir arriendo' },
      { k: '$1.8M', l: 'Casa 3 habitaciones' },
    ],
  },
  {
    initials: 'HR',
    grad: 'linear-gradient(140deg, #b8a590, #685846)',
    tag: 'Bogotá · Suba',
    quote:
      '6 años pagando 1.2 millones por transferencia. Sin contrato, sin nada escrito. Renty lo reconstruyó desde mi Bancolombia.',
    name: 'Héctor, 42 años',
    sub: 'Conductor Uber · Suba, Bogotá',
    stats: [
      { k: '741', l: 'Renty Score' },
      { k: '9 días', l: 'En conseguir arriendo' },
      { k: '$1.6M', l: 'Apto familiar' },
    ],
  },
];

export default function InquilinosTestimonials() {
  const [idx, setIdx] = useState(0);
  const total = slides.length;
  const paused = useRef(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) setIdx((i) => (i + 1) % total);
    }, 7000);
    return () => window.clearInterval(id);
  }, [total]);

  const go = (i: number) => setIdx(((i % total) + total) % total);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
    if (Math.abs(dx) > 48) go(dx < 0 ? idx + 1 : idx - 1);
    touchX.current = null;
  };

  return (
    <div
      className="relative mx-auto max-w-[1040px]"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onFocusCapture={() => { paused.current = true; }}
      onBlurCapture={() => { paused.current = false; }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-out-expo"
          style={{ transform: `translateX(-${idx * 100}%)` }}
          aria-live="polite"
        >
          {slides.map((s) => (
            <article
              key={s.name}
              className="grid w-full shrink-0 grow-0 basis-full grid-cols-1 items-center gap-8 rounded-3xl border border-border bg-white p-8 sm:p-10 lg:grid-cols-[280px_1fr] lg:gap-12 lg:p-14"
            >
              <div
                className="relative mx-auto h-[260px] w-full max-w-[260px] overflow-hidden rounded-2xl shadow-md sm:h-[300px] lg:h-[300px] lg:w-[240px]"
                style={{ background: s.grad }}
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0 flex items-end p-3.5"
                  style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.35))' }}
                >
                  <span className="font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-white">
                    {s.tag}
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <blockquote
                  className="relative m-0 mb-6 font-display font-400 text-ink [letter-spacing:-0.01em]"
                  style={{ fontSize: 'clamp(22px, 2.8vw, 28px)', lineHeight: 1.35 }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-2 -top-8 font-display text-coral/35"
                    style={{ fontSize: 80, lineHeight: 1 }}
                  >
                    &ldquo;
                  </span>
                  {s.quote}
                </blockquote>
                <div className="mb-5 h-px w-10 bg-coral/50" />
                <div className="mb-5">
                  <span className="block font-heading text-[16px] font-600 text-ink">{s.name}</span>
                  <span className="block font-body text-[13px] text-ink-muted">{s.sub}</span>
                </div>
                <div className="flex flex-wrap gap-6 border-t border-border pt-5">
                  {s.stats.map((st) => (
                    <div key={st.l} className="flex flex-col">
                      <span className="font-mono text-[18px] font-500 leading-none text-teal">{st.k}</span>
                      <span className="mt-1.5 font-mono text-[10px] font-500 tracking-[0.12em] uppercase text-ink-muted">
                        {st.l}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <div className="flex gap-1" role="tablist" aria-label="Testimonios">
          {slides.map((s, i) => (
            <button
              key={s.name}
              type="button"
              role="tab"
              aria-selected={i === idx}
              aria-label={`Testimonio ${i + 1} de ${total}`}
              onClick={() => go(i)}
              className="flex h-11 w-8 items-center justify-center p-0"
            >
              <span
                aria-hidden="true"
                className={`rounded-full transition-all duration-200 ${
                  i === idx ? 'h-2 w-6 bg-teal' : 'h-2 w-2 bg-border-strong'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(idx - 1)}
            aria-label="Anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-white text-ink transition-all hover:-translate-y-0.5 hover:border-teal hover:text-teal hover:shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            aria-label="Siguiente"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-white text-ink transition-all hover:-translate-y-0.5 hover:border-teal hover:text-teal hover:shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
