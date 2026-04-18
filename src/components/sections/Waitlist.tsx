'use client';

import { useRef, useState, useTransition } from 'react';
import { submitWaitlist } from '@/app/actions/waitlist';
import { Eyebrow } from '@/components/ui/Eyebrow';

/**
 * Homepage waitlist — teal canvas with soft coral/white radial glows and a
 * glass-style form card. Wired to the existing `submitWaitlist` server action.
 * The former `/lista-de-espera` route now 301-redirects to `/renty-score/formulario`.
 *
 * Only Bogotá is currently available; other cities show a "pronto" state so
 * we signal the roadmap without over-promising.
 */
interface CityChip {
  name: string;
  available: boolean;
}
const CITIES: CityChip[] = [
  { name: 'Bogotá', available: true },
  { name: 'Medellín', available: false },
  { name: 'Cali', available: false },
  { name: 'Barranquilla', available: false },
];

export default function Waitlist() {
  const formRef = useRef<HTMLFormElement>(null);
  const [city, setCity] = useState<string>('Bogotá');
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    const fd = new FormData(form);
    const payload = {
      tipo: 'inquilino' as const,
      nombre: String(fd.get('nombre') || ''),
      email: String(fd.get('email') || ''),
      ciudad: city,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    };

    setError(null);
    startTransition(async () => {
      try {
        const result = await submitWaitlist(payload);
        if (result.success) {
          setSuccess(true);
          form.reset();
          if (typeof window !== 'undefined') window.rentyConfetti?.();
        } else {
          setError(result.error || 'Hubo un error. Intenta de nuevo.');
        }
      } catch {
        setSuccess(true);
        form.reset();
      }
    });
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden bg-teal py-16 text-white lg:py-24"
      data-waitlist-section
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[200px] -top-[200px] h-[600px] w-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(232,99,74,0.25), transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[100px] -left-[100px] h-[400px] w-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ── Left copy ── */}
          <div className="min-w-0">
            <Eyebrow tone="inverse" className="mb-4 text-coral-light">Lista de espera</Eyebrow>
            <h2
              className="mb-5 mt-4 font-display font-400 text-white [letter-spacing:-0.02em]"
              style={{ fontSize: 'clamp(32px, 5vw, 68px)', lineHeight: 1.05, margin: '18px 0 20px' }}
            >
              Sé de los primeros <em className="italic text-coral-light">en tu ciudad.</em>
            </h2>
            <p
              className="max-w-[48ch] font-body text-white/80"
              style={{ fontSize: 19, lineHeight: 1.55, margin: '0 0 32px' }}
            >
              Lanzamos en Bogotá primero, luego Medellín y Cali. Déjanos tu correo y te avisamos
              apenas abramos tu ciudad — sin spam.
            </p>
            {/* hand-drawn arrow, decorative */}
            <svg
              aria-hidden="true"
              width="160"
              height="60"
              viewBox="0 0 160 60"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hidden text-coral-light/70 lg:block"
            >
              <path d="M10 50 C 40 20, 90 10, 140 30 M 130 22 L 144 30 L 134 42" />
            </svg>
          </div>

          {/* ── Right card ── */}
          <div
            className="min-w-0 rounded-3xl border border-white/15 bg-white/[0.08] p-8 backdrop-blur-xl lg:p-10"
          >
            <h4 className="mb-2 font-heading text-[17px] font-600 text-white">
              Apúntate a la lista
            </h4>
            <p className="mb-5 font-body text-[14px] text-white/65">
              Selecciona tu ciudad y déjanos tu correo.
            </p>

            <div role="radiogroup" aria-label="Ciudad" className="mb-5 flex flex-wrap gap-2.5">
              {CITIES.map((c) => {
                const active = city === c.name;
                const disabled = !c.available;
                return (
                  <button
                    key={c.name}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-disabled={disabled || undefined}
                    onClick={() => { if (!disabled) setCity(c.name); }}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 py-2.5 font-mono text-[11px] font-500 tracking-[0.14em] uppercase transition-all duration-200 ${
                      active
                        ? 'border-coral bg-coral text-white'
                        : disabled
                        ? 'cursor-not-allowed border-dashed border-white/25 bg-transparent text-white/50'
                        : 'cursor-pointer border-white/15 bg-white/[0.08] text-white/80 hover:border-coral hover:bg-coral hover:text-white'
                    }`}
                  >
                    {c.name}
                    {disabled && (
                      <span className="text-[9px] tracking-[0.12em] text-white/45">(pronto)</span>
                    )}
                  </button>
                );
              })}
            </div>

            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="flex flex-col gap-3"
              noValidate
            >
              <label className="sr-only" htmlFor="wl-nombre">Nombre</label>
              <input
                id="wl-nombre"
                name="nombre"
                type="text"
                required
                autoComplete="name"
                placeholder="Tu nombre"
                className="h-[52px] rounded-xl border border-white/20 bg-white/[0.08] px-5 font-body text-[15px] text-white outline-none transition-all placeholder:text-white/50 focus:border-coral focus:bg-white/[0.12]"
              />
              <label className="sr-only" htmlFor="wl-email">Correo</label>
              <input
                id="wl-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@correo.com"
                className="h-[52px] rounded-xl border border-white/20 bg-white/[0.08] px-5 font-body text-[15px] text-white outline-none transition-all placeholder:text-white/50 focus:border-coral focus:bg-white/[0.12]"
              />
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-[54px] items-center justify-center gap-2.5 rounded-[14px] bg-coral px-7 font-heading text-[15px] font-600 text-white transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-lg hover:shadow-coral/20 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {pending ? 'Enviando…' : success ? '¡Te avisamos! ✓' : 'Apuntarme'}
                {!pending && !success && (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </button>

              {error && (
                <p role="alert" className="font-body text-[13px] text-coral-light">
                  {error}
                </p>
              )}
            </form>

            <div className="mt-5 font-mono text-[11px] font-500 tracking-[0.12em] uppercase text-white/45">
              Ley 1581 · Sin spam · Solo un correo
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
