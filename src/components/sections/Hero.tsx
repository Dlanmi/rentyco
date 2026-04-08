'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Hero section with staged GSAP entrance — desktop uses a timeline with
 * title / text / CTAs / proof, mobile condenses to a single group animation.
 * The SVG house nodes animate in after the text.
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const heroEls = '[data-hero-title] > *, [data-hero-text], [data-hero-ctas] > *, [data-hero-proof]';

      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          delay: 0.3,
          onComplete() { gsap.set(heroEls, { clearProps: 'opacity,y' }); },
        });
        tl.from('[data-hero-title] > *', {
          y: 30,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out',
          force3D: true,
        })
          .from('[data-hero-text]', { opacity: 0, duration: 0.6, force3D: true }, '-=0.3')
          .from(
            '[data-hero-ctas] > *',
            { y: 16, opacity: 0, stagger: 0.1, duration: 0.5, force3D: true },
            '-=0.2'
          )
          .from('[data-hero-proof]', { opacity: 0, duration: 0.4, force3D: true }, '-=0.1');

        gsap.from('.hero-dot', {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          stagger: 0.025,
          delay: 0.8,
          ease: 'back.out(1.7)',
          force3D: true,
        });
        gsap.from('.hero-line', {
          opacity: 0,
          duration: 1,
          delay: 2,
          ease: 'power2.inOut',
          force3D: true,
        });
      });

      mm.add('(max-width: 1023px)', () => {
        // On mobile: only animate non-LCP elements (title, CTAs, proof).
        // The <p> (data-hero-text) stays visible — it's the LCP element.
        gsap.from(
          '[data-hero-title], [data-hero-ctas], [data-hero-proof]',
          {
            y: 12,
            opacity: 0,
            stagger: 0.08,
            duration: 0.4,
            delay: 0.1,
            ease: 'power2.out',
            force3D: true,
            onComplete() { gsap.set('[data-hero-title], [data-hero-ctas], [data-hero-proof]', { clearProps: 'opacity,y' }); },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[90vh] items-center overflow-hidden px-6 pt-24 pb-16 lg:px-12"
      id="inicio"
    >
      <div
        data-parallax="0.08"
        className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full opacity-[0.07]"
        style={{
          background: 'radial-gradient(circle, var(--color-teal) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      <div
        data-parallax="0.12"
        className="pointer-events-none absolute -left-48 bottom-0 h-[400px] w-[400px] rounded-full opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, var(--color-coral) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="text-center lg:text-left">
          <div className="mb-6 flex justify-center lg:justify-start">
            <div className="h-1 w-12 rounded-full bg-teal" />
          </div>

          <h1
            data-hero-title
            className="font-display text-[clamp(2.5rem,5.5vw,4.2rem)] leading-[1.08] tracking-tight text-ink"
          >
            <span className="block">El arriendo</span>
            <span className="block text-teal">sin barreras.</span>
          </h1>

          <p
            data-hero-text
            className="mx-auto mt-6 max-w-lg font-body text-lg leading-relaxed text-ink-secondary lg:mx-0"
          >
            7.3 millones de familias en Colombia arriendan, pero el sistema las trata como
            riesgo. ¿Pagas cumplido hace años? Da igual: sin codeudor con finca raíz, no
            existes. Renty cambia eso — aquí vale cómo pagas, no cuánto tienes.
          </p>

          <div
            data-hero-ctas
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link
              href="/renty-score/formulario"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal px-7 py-3.5 font-heading text-[15px] font-600 text-white no-underline shadow-lg shadow-teal/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-xl hover:shadow-teal/25"
            >
              Calcula tu Renty Score
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-7 py-3.5 font-heading text-[15px] font-600 text-ink no-underline transition-all duration-200 hover:border-teal hover:text-teal"
            >
              Mira cómo funciona
            </a>
          </div>

          <div
            data-hero-proof
            className="mt-8 flex items-center justify-center gap-4 border-t border-border pt-6 lg:justify-start"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-lighter px-3 py-1 font-heading text-[12px] font-600 text-teal-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
              Disponible en Bogotá
            </span>
            <span className="font-body text-[13px] text-ink-muted">
              Gratis durante el lanzamiento
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-end">
          <svg
            viewBox="0 0 480 480"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[260px] lg:max-w-[400px]"
            aria-hidden="true"
          >
            <path
              d="M240 50 L410 140 L410 310 Q410 420 240 450 Q70 420 70 310 L70 140 Z"
              fill="#E8F5F0"
              opacity="0.5"
            />
            <path
              d="M240 80 L380 155 L380 300 Q380 390 240 415 Q100 390 100 300 L100 155 Z"
              stroke="#0D6B58"
              strokeWidth="0.8"
              fill="none"
              opacity="0.2"
            />

            <circle className="hero-dot" cx="240" cy="130" r="5" fill="#0D6B58" />
            <circle className="hero-dot" cx="210" cy="155" r="3.5" fill="#10B981" />
            <circle className="hero-dot" cx="180" cy="180" r="4" fill="#0D6B58" />
            <circle className="hero-dot" cx="155" cy="200" r="3" fill="#10B981" />
            <circle className="hero-dot" cx="270" cy="155" r="3.5" fill="#10B981" />
            <circle className="hero-dot" cx="300" cy="180" r="4" fill="#0D6B58" />
            <circle className="hero-dot" cx="325" cy="200" r="3" fill="#10B981" />

            <line className="hero-line" x1="240" y1="130" x2="210" y2="155" stroke="#0D6B58" strokeWidth="0.6" opacity="0.3" />
            <line className="hero-line" x1="210" y1="155" x2="180" y2="180" stroke="#0D6B58" strokeWidth="0.6" opacity="0.3" />
            <line className="hero-line" x1="180" y1="180" x2="155" y2="200" stroke="#0D6B58" strokeWidth="0.6" opacity="0.3" />
            <line className="hero-line" x1="240" y1="130" x2="270" y2="155" stroke="#0D6B58" strokeWidth="0.6" opacity="0.3" />
            <line className="hero-line" x1="270" y1="155" x2="300" y2="180" stroke="#0D6B58" strokeWidth="0.6" opacity="0.3" />
            <line className="hero-line" x1="300" y1="180" x2="325" y2="200" stroke="#0D6B58" strokeWidth="0.6" opacity="0.3" />

            <circle className="hero-dot" cx="155" cy="230" r="3.5" fill="#57534E" />
            <circle className="hero-dot" cx="155" cy="265" r="3" fill="#A8A29E" />
            <circle className="hero-dot" cx="155" cy="300" r="4" fill="#57534E" />
            <circle className="hero-dot" cx="155" cy="335" r="3" fill="#A8A29E" />
            <circle className="hero-dot" cx="325" cy="230" r="3.5" fill="#57534E" />
            <circle className="hero-dot" cx="325" cy="265" r="3" fill="#A8A29E" />
            <circle className="hero-dot" cx="325" cy="300" r="4" fill="#57534E" />
            <circle className="hero-dot" cx="325" cy="335" r="3" fill="#A8A29E" />

            <line className="hero-line" x1="155" y1="200" x2="155" y2="335" stroke="#A8A29E" strokeWidth="0.5" opacity="0.3" />
            <line className="hero-line" x1="325" y1="200" x2="325" y2="335" stroke="#A8A29E" strokeWidth="0.5" opacity="0.3" />
            <line className="hero-line" x1="155" y1="335" x2="325" y2="335" stroke="#A8A29E" strokeWidth="0.5" opacity="0.3" />

            <circle className="hero-dot" cx="195" cy="240" r="3" fill="#0D6B58" />
            <circle className="hero-dot" cx="220" cy="240" r="3" fill="#0D6B58" />
            <circle className="hero-dot" cx="195" cy="265" r="3" fill="#0D6B58" />
            <circle className="hero-dot" cx="220" cy="265" r="3" fill="#0D6B58" />
            <line className="hero-line" x1="195" y1="240" x2="220" y2="240" stroke="#0D6B58" strokeWidth="0.5" opacity="0.3" />
            <line className="hero-line" x1="195" y1="265" x2="220" y2="265" stroke="#0D6B58" strokeWidth="0.5" opacity="0.3" />
            <line className="hero-line" x1="195" y1="240" x2="195" y2="265" stroke="#0D6B58" strokeWidth="0.5" opacity="0.3" />
            <line className="hero-line" x1="220" y1="240" x2="220" y2="265" stroke="#0D6B58" strokeWidth="0.5" opacity="0.3" />

            <circle className="hero-dot" cx="280" cy="335" r="3.5" fill="#E8634A" />
            <circle className="hero-dot" cx="305" cy="335" r="3.5" fill="#E8634A" />
            <circle className="hero-dot" cx="280" cy="305" r="3" fill="#E8634A" />
            <circle className="hero-dot" cx="305" cy="305" r="3" fill="#E8634A" />
            <circle className="hero-dot" cx="292" cy="290" r="3.5" fill="#E8634A" />
            <line className="hero-line" x1="280" y1="335" x2="280" y2="305" stroke="#E8634A" strokeWidth="0.5" opacity="0.4" />
            <line className="hero-line" x1="305" y1="335" x2="305" y2="305" stroke="#E8634A" strokeWidth="0.5" opacity="0.4" />
            <line className="hero-line" x1="280" y1="305" x2="292" y2="290" stroke="#E8634A" strokeWidth="0.5" opacity="0.4" />
            <line className="hero-line" x1="305" y1="305" x2="292" y2="290" stroke="#E8634A" strokeWidth="0.5" opacity="0.4" />

            <circle className="hero-dot" cx="110" cy="120" r="2" fill="#A8A29E" opacity="0.3" />
            <circle className="hero-dot" cx="370" cy="110" r="2.5" fill="#0D6B58" opacity="0.2" />
            <circle className="hero-dot" cx="90" cy="280" r="2" fill="#E8634A" opacity="0.2" />
            <circle className="hero-dot" cx="390" cy="260" r="2" fill="#10B981" opacity="0.2" />
            <circle className="hero-dot" cx="240" cy="390" r="2.5" fill="#A8A29E" opacity="0.2" />

            <path
              className="hero-dot"
              d="M220 365 L235 380 L265 350"
              stroke="#0D6B58"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
