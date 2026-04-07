'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { Button } from '@/components/ui/Button';
import { ScoreGauge } from './ScoreGauge';
import type { ScoreResult as ScoreResultType, ScoreColor } from '@/lib/renty-score/types';

interface Props {
  result: ScoreResultType;
  saving: boolean;
  saved: boolean;
  isAuthed?: boolean;
  saveError?: string | null;
}

const MODULE_LABELS = [
  { key: 'scoreA' as const, label: 'Historial de arriendo' },
  { key: 'scoreB' as const, label: 'Capacidad de pago' },
  { key: 'scoreC' as const, label: 'Estabilidad y comportamiento' },
  { key: 'scoreD' as const, label: 'Señales financieras' },
];

const MODULE_MAX: Record<string, number> = { scoreA: 350, scoreB: 300, scoreC: 200, scoreD: 150 };

/* CTAs for non-authenticated users */
const CTA_GUEST: Record<ScoreColor, { text: string; href: string }> = {
  verde: { text: 'Crea tu cuenta y guarda tu score', href: '/entrar?next=/cuenta/mi-score' },
  amarillo: { text: 'Regístrate para guardar tu score', href: '/entrar?next=/cuenta/mi-score' },
  naranja: { text: 'Crea tu cuenta para mejorar tu score', href: '/entrar?next=/cuenta/mi-score' },
  rojo: { text: 'Regístrate y mejora tu score', href: '/entrar?next=/cuenta/mi-score' },
};

/* CTAs for authenticated users */
const CTA_AUTHED: Record<ScoreColor, { text: string; href: string }> = {
  verde: { text: 'Ver detalle de mi score', href: '/cuenta/mi-score' },
  amarillo: { text: 'Ver detalle de mi score', href: '/cuenta/mi-score' },
  naranja: { text: 'Ver cómo mejorar mi score', href: '/cuenta/mi-score' },
  rojo: { text: 'Ver cómo mejorar mi score', href: '/cuenta/mi-score' },
};

const BAR_COLORS: Record<ScoreColor, string> = {
  verde: 'bg-teal',
  amarillo: 'bg-warning',
  naranja: 'bg-coral',
  rojo: 'bg-error',
};

export function ScoreResult({ result, saving, saved, isAuthed = false, saveError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cta = isAuthed ? CTA_AUTHED[result.color] : CTA_GUEST[result.color];

  useEffect(() => {
    if (!containerRef.current) return;

    if (prefersReducedMotion()) {
      // Show everything immediately, bars at full width
      containerRef.current.querySelectorAll<HTMLElement>('[data-score-bar]').forEach((bar) => {
        bar.style.width = (bar.dataset.scoreBarPct ?? '0') + '%';
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from('[data-score-heading]', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' })
        .from('[data-score-gauge]', { scale: 0.9, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
        .from('[data-score-message]', { opacity: 0, duration: 0.6, ease: 'power2.out' }, '+=0.8')
        .from('[data-score-breakdown]', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, '+=0.3');

      // Animate bars after breakdown appears
      const bars = gsap.utils.toArray<HTMLElement>('[data-score-bar]');
      tl.to(bars, {
        width: (_i: number, el: HTMLElement) => (el.dataset.scoreBarPct ?? '0') + '%',
        duration: 1.0,
        stagger: 0.15,
        ease: 'power2.out',
      }, '-=0.3');

      tl.from('[data-score-cta]', { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8 text-center">
      <div data-score-heading>
        <h2 className="font-display text-2xl text-ink">Tu Renty Score</h2>
        <p className="mt-1 text-sm text-ink-muted">Resultado basado en tus respuestas</p>
      </div>

      <div data-score-gauge>
        <ScoreGauge score={result.total} color={result.color} label={result.label} />
      </div>

      {/* Message */}
      <p data-score-message className="mx-auto max-w-md text-[15px] leading-relaxed text-ink-secondary">
        {result.message}
      </p>

      {/* Module breakdown */}
      <div
        data-score-breakdown
        className="space-y-4 rounded-2xl border border-border bg-white p-5 text-left"
      >
        <h3 className="text-sm font-semibold text-ink">Desglose por módulo</h3>

        {MODULE_LABELS.map(({ key, label }) => {
          const value = result[key];
          const max = MODULE_MAX[key] ?? 1;
          const pct = Math.round((value / max) * 100);
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-ink-secondary">{label}</span>
                <span className="font-mono text-ink-muted">
                  {pct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-sand-dark">
                <div
                  data-score-bar
                  data-score-bar-pct={pct}
                  className={cn('h-full rounded-full', BAR_COLORS[result.color])}
                  style={{ width: '0%' }}
                />
              </div>
            </div>
          );
        })}

        {result.penalties < 0 && (
          <div className="flex items-center justify-between rounded-lg bg-error/5 px-3 py-2 text-xs">
            <span className="text-error">Penalizaciones</span>
            <span className="font-mono font-semibold text-error">{result.penalties} pts</span>
          </div>
        )}
      </div>

      {/* Status */}
      {saving && (
        <p className="text-sm text-ink-muted">Guardando tu resultado...</p>
      )}
      {saved && (
        <p className="flex items-center justify-center gap-1.5 text-sm text-success">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {isAuthed ? 'Score guardado en tu perfil' : 'Resultado guardado'}
        </p>
      )}
      {saveError && (
        <p className="flex items-center justify-center gap-1.5 text-sm text-error">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {saveError}
        </p>
      )}

      {/* Primary CTA */}
      <div data-score-cta>
        <Link href={cta.href}>
          <Button variant="primary" size="lg" className="w-full">
            {cta.text}
            <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </Link>

        {/* Secondary CTA */}
        {isAuthed ? (
          <Link
            href="/cuenta"
            className="mt-4 inline-block text-sm text-ink-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Ir a mi cuenta
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-ink-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Volver a calcular
          </button>
        )}
      </div>
    </div>
  );
}
