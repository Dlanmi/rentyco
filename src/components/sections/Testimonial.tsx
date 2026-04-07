'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useReveals } from '@/lib/useReveal';

export default function Testimonial() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-testimonial-line]',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          duration: 0.8,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: { trigger: ref.current!, start: 'top 90%', once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  useReveals(ref, [
    {
      selector: '[data-testimonial-quote]',
      vars: { x: -20, opacity: 0, duration: 0.7 },
      triggerSelector: '[data-testimonial]',
    },
    {
      selector: '[data-testimonial-narrative]',
      vars: { opacity: 0, duration: 0.6, delay: 0.2 },
      triggerSelector: '[data-testimonial]',
    },
    {
      selector: '[data-testimonial-resolution]',
      vars: { y: 20, opacity: 0, duration: 0.6, delay: 0.4 },
      triggerSelector: '[data-testimonial]',
    },
    {
      selector: '[data-testimonial-attr]',
      vars: { y: 16, opacity: 0, duration: 0.5, delay: 0.6 },
      triggerSelector: '[data-testimonial]',
    },
  ]);

  return (
    <section ref={ref} data-testimonial className="bg-sand-dark py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-12">
        <span className="mb-8 block text-center font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-coral">
          Historia representativa
        </span>

        <div className="relative mb-8 pl-7">
          <div
            data-testimonial-line
            className="absolute top-1 bottom-1 left-0 w-[3px] rounded-full bg-teal"
          />
          <blockquote
            data-testimonial-quote
            className="font-display text-[clamp(1.2rem,3vw,1.6rem)] leading-[1.5] text-ink"
          >
            &ldquo;Llevamos 10 años pagando arriendo sin fallar un solo mes. Nunca un día tarde.
            Pero cuando quisimos cambiarnos de apto, nos rechazaron en 4 inmobiliarias porque no
            teníamos codeudor con finca raíz. O sea, 10 años pagando cumplido y eso no vale
            nada.&rdquo;
          </blockquote>
        </div>

        <p
          data-testimonial-narrative
          className="max-w-2xl font-body text-[15px] leading-relaxed text-ink-muted"
        >
          Esta familia paga $1.800.000 mensuales de arriendo desde 2014. Empleo estable,
          servicios al día, jamás un atraso. Pero para el sistema formal, no existen. Como el 57%
          de arrendatarios colombianos con contrato verbal, su historial es invisible.
        </p>

        <div
          data-testimonial-resolution
          className="mt-8 rounded-xl border border-teal/20 bg-teal-lighter/30 p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal/10">
              <svg
                className="h-4 w-4 text-teal"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-heading text-[13px] font-600 text-teal-dark">
              Cómo Renty cambiaría este caso
            </span>
          </div>
          <p className="font-body text-[14px] leading-relaxed text-ink-secondary">
            Cuando lancemos en Bogotá 2026, familias como esta podrán usar su experiencia como
            inquilinos — historial de arriendo, estabilidad, responsabilidad financiera — para
            construir un perfil que hable por ellos.
            Con un <strong className="text-teal-dark">Renty Score alto</strong>, podrían presentar
            su perfil a arrendadores con más confianza.
          </p>
        </div>

        <div
          data-testimonial-attr
          className="mt-8 flex items-center gap-4 border-t border-border pt-7"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-lighter font-heading text-sm font-700 text-teal">
            CM
          </div>
          <div>
            <span className="block font-heading text-[15px] font-600 text-ink">Camila M.</span>
            <span className="font-body text-[13px] text-ink-muted">
              Trabajadora independiente · Bogotá — 10 años arrendando sin atrasos
            </span>
          </div>
        </div>

        <p className="mt-6 font-mono text-[11px] leading-relaxed text-ink-muted/70">
          * Historia basada en casos recurrentes recopilados en nuestra investigación. Nombre
          modificado por privacidad. Renty está en pre-lanzamiento.
        </p>
      </div>
    </section>
  );
}
