'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { signInWithEmail, signInWithGoogle } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { Input, FieldLabel, FieldError } from '@/components/ui/Input';

export default function LoginForm() {
  const params = useSearchParams();
  const next = params.get('next') ?? undefined;
  const errorParam = params.get('error');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(
    errorParam === 'auth' ? 'Hubo un error con la autenticación. Intenta de nuevo.' : null
  );
  const [sent, setSent] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await signInWithEmail({ email, next });
      if (res.ok) setSent(true);
      else setError(res.message);
    });
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-teal/20 bg-teal-lighter/30 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal/10">
          <svg className="h-7 w-7 text-teal" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="font-display text-[24px] text-ink">Revisa tu correo</h2>
        <p className="mt-2 font-body text-[14px] leading-relaxed text-ink-secondary">
          Enviamos un enlace mágico a
        </p>
        <p className="mt-1 font-heading text-[15px] font-600 text-ink">{email}</p>
        <p className="mt-3 font-body text-[13px] text-ink-muted">
          No lo ves? Revisa tu carpeta de spam.
        </p>
        <button
          type="button"
          onClick={() => { setSent(false); setEmail(''); }}
          className="mt-5 font-mono text-[12px] uppercase tracking-wide text-teal-dark underline hover:text-teal"
        >
          Usar otro email
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Google — acción principal */}
      <form action={signInWithGoogle.bind(null, next)}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-5 py-3.5 font-heading text-[15px] font-600 text-ink shadow-sm transition-all hover:-translate-y-px hover:border-ink/20 hover:shadow-md active:translate-y-0"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuar con Google
        </button>
      </form>

      {/* Separador */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/70">o con email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Email — expandible */}
      {!showEmail ? (
        <button
          type="button"
          onClick={() => setShowEmail(true)}
          className="w-full rounded-xl border border-border bg-white px-5 py-3.5 font-heading text-[14px] font-500 text-ink-secondary transition-colors hover:border-ink/20 hover:text-ink"
        >
          Usar correo electrónico
        </button>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <FieldLabel htmlFor="email" required>Correo electrónico</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              autoFocus
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={pending}
            />
          </div>
          <Button type="submit" loading={pending} variant="primary" size="lg" className="w-full">
            Enviar enlace mágico
          </Button>
          <p className="font-body text-[12px] text-ink-muted">
            Te enviaremos un enlace para entrar — sin contraseñas.
          </p>
        </form>
      )}

      <FieldError>{error}</FieldError>
    </div>
  );
}
