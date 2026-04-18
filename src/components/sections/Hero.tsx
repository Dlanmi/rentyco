'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const HeroShader = dynamic(() => import('./HeroShader'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-sand via-sand-dark/40 to-transparent"
    />
  ),
});

/**
 * Landing hero — an editorial serif headline layered over an interactive
 * WebGL plasma shader, with two floating proof cards (score + listing)
 * on the right. The left column stays anchored in a sand wash so the
 * copy is always legible regardless of the shader state.
 */
export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-6 pb-20 lg:min-h-screen lg:pt-10"
      style={{ minHeight: 'min(100vh, 820px)' }}
    >
      <HeroShader />

      {/* Hint pill — fades out after ~5s */}
      <div
        className="renty-hint-fade pointer-events-none absolute right-4 top-[96px] z-[3] hidden items-center gap-2 rounded-full border border-teal/15 bg-white/70 px-3.5 py-2 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-muted backdrop-blur-md sm:inline-flex sm:right-8"
      >
        <span className="renty-pulse-dot h-1.5 w-1.5 rounded-full bg-coral" />
        Mueve el cursor · haz click
      </div>

      <div className="relative z-[2] mx-auto grid max-w-[1280px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
        {/* ── Left column: text ── */}
        <div className="relative min-w-0">
          {/* Sand wash behind text for legibility */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[40px] lg:-inset-x-14"
            style={{
              background:
                'radial-gradient(ellipse at 35% 50%, rgba(250,247,242,.92) 0%, rgba(250,247,242,.75) 45%, rgba(250,247,242,.25) 80%, transparent 100%)',
            }}
          />

          <span className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-teal/20 bg-white/85 px-4 py-2 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-teal-dark backdrop-blur-md sm:text-[11px]">
            <span className="renty-pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
            <span className="sm:hidden">Disponible en Bogotá</span>
            <span className="hidden sm:inline">Disponible en Bogotá · Próximamente Medellín</span>
          </span>

          <h1 className="font-display font-400 text-ink [letter-spacing:-0.025em]" style={{ fontSize: 'clamp(40px, 7.2vw, 104px)', lineHeight: 1.05, margin: 0 }}>
            El arriendo{' '}
            <span className="relative mt-[0.08em] inline-block w-max max-w-full italic text-teal" style={{ lineHeight: 1.15, paddingBottom: '0.15em' }}>
              sin barreras.
              <svg
                aria-hidden="true"
                viewBox="0 0 300 18"
                preserveAspectRatio="none"
                className="absolute -left-1 -right-1 bottom-[-8px] h-[18px] w-[calc(100%+8px)]"
              >
                <path
                  className="renty-underline-path"
                  d="M2 12 C 60 4, 140 16, 220 8 S 295 10, 298 6"
                  stroke="#E8634A"
                  strokeWidth={3}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="mb-9 mt-10 max-w-[54ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
            7.3 millones de familias en Colombia arriendan, pero el sistema las trata como riesgo.
            ¿Pagas cumplido hace años? Da igual: sin codeudor con finca raíz, no existes. Renty
            cambia eso — aquí vale cómo pagas, no cuánto tienes.
          </p>

          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              href="/renty-score/formulario"
              className="inline-flex h-[54px] items-center gap-2.5 rounded-[14px] bg-teal px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
            >
              Calcular mi score gratis
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/bogota/arriendos"
              className="inline-flex h-[54px] items-center gap-2.5 rounded-[14px] border border-border-strong bg-white px-7 font-heading text-[15px] font-600 text-ink no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-teal hover:text-teal"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              Buscar arriendo
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-ink-secondary sm:text-[11px]">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <svg className="h-3.5 w-3.5 text-teal/80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
              Encriptados
            </span>
            <span aria-hidden="true" className="text-ink-muted/45">·</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <svg className="h-3.5 w-3.5 text-teal/80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Score transparente
            </span>
            <span aria-hidden="true" className="text-ink-muted/45">·</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true">🇨🇴</span>
              Hecho en Colombia
            </span>
          </div>
        </div>

        {/* ── Right column: floating cards ── */}
        <div className="relative mx-auto h-auto w-full max-w-none lg:mx-0 lg:h-[520px]">
          {/* Mobile stack wrapper */}
          <div className="flex flex-col gap-5 lg:block">
            {/* Score card */}
            <div className="renty-float-a relative top-0 right-0 z-[2] w-full rounded-[20px] border border-white/90 bg-white/92 p-6 shadow-[0_24px_48px_rgba(13,107,88,0.12),0_4px_10px_rgba(0,0,0,0.04)] backdrop-blur-[14px] sm:p-[22px] lg:absolute lg:top-10 lg:right-2 lg:w-[280px]">
              <div className="renty-mono text-ink-muted">Tu Renty Score</div>
              <div className="mb-2.5 mt-3 flex items-baseline justify-between">
                <div className="font-mono font-500 leading-none text-teal" style={{ fontSize: 56 }}>
                  785
                </div>
                <span className="renty-mono rounded-full bg-teal-lighter px-2 py-1 text-teal">
                  +18 ↗
                </span>
              </div>
              <span className="mb-3.5 inline-block rounded-full bg-teal-lighter px-2.5 py-1 font-heading text-label font-600 text-teal-dark">
                Excelente
              </span>
              <div className="h-1.5 overflow-hidden rounded-full bg-sand-dark">
                <span className="renty-grow-bar block h-full rounded-full" style={{ width: '78%', background: 'linear-gradient(90deg, var(--color-teal), var(--color-teal-light))' }} />
              </div>
              <div className="mt-2.5 flex justify-between renty-mono text-ink-muted">
                <span>0</span>
                <span>1000</span>
              </div>
            </div>

            {/* Listing card */}
            <div className="renty-float-b relative bottom-0 left-0 z-[2] w-full rounded-[20px] border border-white/90 bg-white/92 p-4 shadow-[0_24px_48px_rgba(13,107,88,0.12),0_4px_10px_rgba(0,0,0,0.04)] backdrop-blur-[14px] sm:p-[14px] lg:absolute lg:bottom-10 lg:-left-3 lg:w-[260px]">
              <div
                className="relative mb-3 overflow-hidden rounded-xl"
                style={{
                  aspectRatio: '16 / 10',
                  background: 'linear-gradient(135deg, #d8cfc2, #a89880 60%, #8b7a62)',
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 40%, rgba(255,255,255,.25), transparent 50%), radial-gradient(circle at 70% 80%, rgba(13,107,88,.15), transparent 50%)',
                  }}
                />
                <span className="renty-mono absolute left-2 top-2 z-[2] inline-flex items-center gap-1 rounded-full bg-teal/90 px-2.5 py-[3px] text-white">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3 3 4-1 1 4 3 3-3 3-1 4-4-1-3 3-3-3-4 1-1-4-3-3 3-3 1-4 4 1z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  Verificado
                </span>
              </div>
              <h5 className="m-0 mb-0.5 font-heading text-[17px] font-600 text-ink">Chapinero, Bogotá</h5>
              <p className="m-0 font-body text-[14px] text-ink-muted">2 hab · 62 m² · Amoblado</p>
              <div className="mt-2 font-body text-[15px] font-600 text-ink">
                $2.450.000 <span className="font-400 text-[13px] text-ink-muted">/mes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-[3] hidden -translate-x-1/2 flex-col items-center gap-2 renty-mono text-ink-muted sm:flex">
        <span>Scroll</span>
        <div className="renty-scroll-line h-8 w-px bg-current opacity-40" />
      </div>
    </section>
  );
}
