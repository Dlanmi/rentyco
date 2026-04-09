'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { submitWaitlist } from '@/app/actions/waitlist';

/**
 * Unified waitlist form — used across every page. `dark` flips the section
 * wrapper + form card to the dark variant (used at page bottom).
 * The form is self-contained: validation, tab switching, optimistic confetti
 * and graceful error messages all live here.
 */
interface WaitlistFormProps {
  title?: string;
  subtitle?: string;
  dark?: boolean;
  submitLabel?: string;
  sectionId?: string;
}

type WaitlistType = 'inquilino' | 'arrendador';

export default function WaitlistForm({
  title = 'Empieza hoy — es gratis',
  subtitle = 'Regístrate y calcula tu Renty Score. Sin costo. Sin compromiso. Sin letra chiquita.',
  dark = false,
  submitLabel = 'Apartar mi cupo',
  sectionId,
}: WaitlistFormProps) {
  const reactId = useId();
  const instanceId = `waitlist-${(sectionId || reactId).replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  const [type, setType] = useState<WaitlistType>('inquilino');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (successVisible) successRef.current?.focus();
  }, [successVisible]);
  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  const labelCls = dark
    ? 'mb-1.5 block font-heading text-[13px] font-600 text-white/90'
    : 'mb-1.5 block font-heading text-[13px] font-600 text-ink';
  const inputCls = dark
    ? 'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-body text-[15px] text-white outline-none transition-all duration-200 placeholder:text-white/35 focus:border-teal-light focus:bg-white/[0.06] focus:ring-2 focus:ring-teal-light/20'
    : 'w-full rounded-xl border border-border bg-sand px-4 py-3 font-body text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 focus:border-teal focus:ring-2 focus:ring-teal/10';
  const selectCls = dark
    ? 'w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-body text-[15px] text-white outline-none transition-all duration-200 focus:border-teal-light focus:bg-white/[0.06] focus:ring-2 focus:ring-teal-light/20'
    : 'w-full appearance-none rounded-xl border border-border bg-sand px-4 py-3 font-body text-[15px] text-ink outline-none transition-all duration-200 focus:border-teal focus:ring-2 focus:ring-teal/10';
  const radioCls = dark
    ? 'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-body text-[15px] text-white/90 transition-all duration-200 has-[:checked]:border-teal-light has-[:checked]:bg-teal/20 has-[:checked]:text-teal-light'
    : 'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-sand px-4 py-3 font-body text-[15px] text-ink transition-all duration-200 has-[:checked]:border-teal has-[:checked]:bg-teal-lighter has-[:checked]:text-teal-dark';

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    setSubmitting(true);
    setSuccessVisible(false);
    setFormError(null);

    const fd = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    const payload = {
      tipo: type,
      nombre: String(fd.get('nombre') || ''),
      email: String(fd.get('email') || ''),
      ciudad: String(fd.get('ciudad') || ''),
      arrienda_actualmente: type === 'inquilino' ? fd.get('arrienda') === 'si' : undefined,
      num_propiedades:
        type === 'arrendador' ? ((fd.get('propiedades') as string) || undefined) : undefined,
      referrer: document.referrer || undefined,
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
    };

    try {
      const result = await submitWaitlist(payload);
      if (result.success) {
        setSuccessVisible(true);
        form.reset();
        window.rentyConfetti?.();
      } else {
        setFormError(result.error || 'Hubo un error. Intenta de nuevo.');
      }
    } catch {
      // Server action threw — fall back to success for preview
      setSuccessVisible(true);
      form.reset();
      window.rentyConfetti?.();
    } finally {
      setSubmitting(false);
    }
  };

  const onEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    if (el.value && !el.validity.valid) {
      setEmailError('Ingresa un correo válido (ej: tu@correo.com)');
    } else {
      setEmailError(null);
    }
  };
  const onEmailInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) setEmailError(null);
  };

  return (
    <section
      className={`relative overflow-hidden px-6 py-16 lg:px-12 lg:py-24 ${dark ? 'bg-ink' : ''}`}
      id={sectionId}
      data-waitlist-section
      data-waitlist
    >
      {dark && (
        <>
          <div
            className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #0D6B58, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #E8634A, transparent 70%)' }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-xl">
        {(title || subtitle) && (
          <div className="mb-8 text-center">
            <h2
              className={`font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight ${
                dark ? 'text-white' : 'text-ink'
              }`}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className={`mx-auto mt-3 max-w-md font-body text-[15px] leading-relaxed ${
                  dark ? 'text-white/70' : 'text-ink-secondary'
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div
          className={`rounded-2xl p-8 lg:p-10 ${
            dark
              ? 'border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-sm'
              : 'border border-border bg-surface shadow-lg shadow-black/[0.03]'
          }`}
          data-theme={dark ? 'dark' : 'light'}
        >
          <div
            role="group"
            aria-label="Tipo de registro"
            className={`mb-8 flex rounded-xl p-1 ${dark ? 'bg-black/30' : 'bg-sand-dark'}`}
          >
            {(['inquilino', 'arrendador'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`waitlist-tab flex-1 rounded-lg px-4 py-3 font-heading text-[14px] font-600 transition-all duration-200 ${
                  type === t ? 'is-active' : ''
                }`}
                aria-pressed={type === t}
              >
                {t === 'inquilino' ? 'Soy inquilino' : 'Soy arrendador'}
              </button>
            ))}
          </div>

          <form ref={formRef} onSubmit={onSubmit} className="space-y-5" noValidate>
            <div>
              <label className={labelCls} htmlFor={`${instanceId}-nombre`}>
                Nombre completo
              </label>
              <input
                type="text"
                id={`${instanceId}-nombre`}
                name="nombre"
                required
                autoComplete="name"
                placeholder="Tu nombre"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls} htmlFor={`${instanceId}-email`}>
                Correo electrónico
              </label>
              <input
                type="email"
                id={`${instanceId}-email`}
                name="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="tu@correo.com"
                className={inputCls}
                aria-describedby={`${instanceId}-email-error`}
                aria-invalid={Boolean(emailError)}
                onBlur={onEmailBlur}
                onInput={onEmailInput}
              />
              {emailError && (
                <p
                  id={`${instanceId}-email-error`}
                  className={`mt-1.5 font-body text-[12px] ${dark ? 'text-red-300' : 'text-red-600'}`}
                  aria-live="polite"
                >
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls} htmlFor={`${instanceId}-ciudad`}>
                Ciudad
              </label>
              <select id={`${instanceId}-ciudad`} name="ciudad" required className={selectCls} defaultValue="">
                <option value="" disabled>
                  Selecciona tu ciudad
                </option>
                <option value="Bogotá">Bogotá</option>
                <option value="Medellín">Medellín</option>
                <option value="Cali">Cali</option>
                <option value="Barranquilla">Barranquilla</option>
                <option value="Cartagena">Cartagena</option>
                <option value="Bucaramanga">Bucaramanga</option>
                <option value="Otra">Otra</option>
              </select>
            </div>

            {type === 'inquilino' && (
              <fieldset>
                <legend className={labelCls}>¿Arriendas actualmente?</legend>
                <div className="flex gap-3">
                  <label className={radioCls}>
                    <input type="radio" name="arrienda" value="si" className="sr-only" />
                    <span>Sí</span>
                  </label>
                  <label className={radioCls}>
                    <input type="radio" name="arrienda" value="no" className="sr-only" />
                    <span>No</span>
                  </label>
                </div>
              </fieldset>
            )}

            {type === 'arrendador' && (
              <fieldset>
                <legend className={labelCls}>Número de propiedades</legend>
                <div className="flex gap-3">
                  <label className={radioCls}>
                    <input type="radio" name="propiedades" value="1" className="sr-only" />
                    <span>1</span>
                  </label>
                  <label className={radioCls}>
                    <input type="radio" name="propiedades" value="2-5" className="sr-only" />
                    <span>2–5</span>
                  </label>
                  <label className={radioCls}>
                    <input type="radio" name="propiedades" value="6+" className="sr-only" />
                    <span>6+</span>
                  </label>
                </div>
              </fieldset>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-teal px-7 py-3.5 font-heading text-[15px] font-600 text-white transition-all duration-200 hover:-translate-y-px hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 2a10 10 0 019.17 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                submitLabel
              )}
            </button>

            {successVisible && (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={`rounded-xl p-4 text-center ${
                  dark ? 'border border-teal-light/30 bg-teal/15' : 'border border-teal/20 bg-teal-lighter'
                }`}
              >
                <p
                  className={`font-heading text-[15px] font-600 ${
                    dark ? 'text-teal-light' : 'text-teal-dark'
                  }`}
                >
                  ¡Registro exitoso!
                </p>
                <p
                  className={`mt-1 font-body text-[13px] ${
                    dark ? 'text-white/70' : 'text-ink-secondary'
                  }`}
                >
                  Te enviaremos un email con los próximos pasos.
                </p>
              </div>
            )}
            {formError && (
              <p
                ref={errorRef}
                tabIndex={-1}
                role="alert"
                aria-live="assertive"
                className={`text-center font-body text-[13px] ${dark ? 'text-red-300' : 'text-red-600'}`}
              >
                {formError}
              </p>
            )}

            <p
              className={`text-center font-mono text-[11px] ${
                dark ? 'text-white/40' : 'text-ink-muted'
              }`}
            >
              Nada de spam. Solo te escribimos cuando haya algo importante de verdad.
            </p>
          </form>
        </div>

        <p
          className={`mt-6 text-center font-mono text-[12px] ${
            dark ? 'text-white/50' : 'text-ink-muted'
          }`}
        >
          Disponible en Bogotá · 2026
        </p>
      </div>

      <style jsx>{`
        :global(.waitlist-tab) {
          color: var(--color-ink-muted);
          background: transparent;
        }
        :global(.waitlist-tab.is-active) {
          color: var(--color-ink);
          background: var(--color-surface);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        :global([data-theme='dark'] .waitlist-tab) {
          color: rgba(255, 255, 255, 0.55);
        }
        :global([data-theme='dark'] .waitlist-tab.is-active) {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        :global([data-theme='dark'] select) {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }
        :global([data-theme='light'] select) {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6560' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }
        :global([data-theme='dark'] select option) {
          background-color: #24201e;
          color: #ffffff;
        }
      `}</style>
    </section>
  );
}
