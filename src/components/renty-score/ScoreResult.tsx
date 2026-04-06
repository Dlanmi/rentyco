'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { ScoreGauge } from './ScoreGauge';
import type { ScoreResult as ScoreResultType, ScoreColor } from '@/lib/renty-score/types';

interface Props {
  result: ScoreResultType;
  saving: boolean;
  saved: boolean;
  isAuthed?: boolean;
}

const MODULE_LABELS = [
  { key: 'scoreA' as const, label: 'Historial de arriendo', max: 350 },
  { key: 'scoreB' as const, label: 'Capacidad de pago', max: 300 },
  { key: 'scoreC' as const, label: 'Estabilidad y comportamiento', max: 200 },
  { key: 'scoreD' as const, label: 'Señales digitales', max: 150 },
];

/* CTAs for non-authenticated users */
const CTA_GUEST: Record<ScoreColor, { text: string; href: string }> = {
  verde: { text: 'Crea tu cuenta y guarda tu score', href: '/entrar' },
  amarillo: { text: 'Regístrate para guardar tu score', href: '/entrar' },
  naranja: { text: 'Crea tu cuenta para mejorar tu score', href: '/entrar' },
  rojo: { text: 'Regístrate y mejora tu score', href: '/entrar' },
};

/* CTAs for authenticated users */
const CTA_AUTHED: Record<ScoreColor, { text: string; href: string }> = {
  verde: { text: 'Explorar arriendos disponibles', href: '/bogota/arriendos' },
  amarillo: { text: 'Explorar arriendos disponibles', href: '/bogota/arriendos' },
  naranja: { text: 'Ver consejos para mejorar', href: '/renty-score#tips' },
  rojo: { text: 'Ver consejos para mejorar', href: '/renty-score#tips' },
};

const BAR_COLORS: Record<ScoreColor, string> = {
  verde: 'bg-teal',
  amarillo: 'bg-warning',
  naranja: 'bg-coral',
  rojo: 'bg-error',
};

export function ScoreResult({ result, saving, saved, isAuthed = false }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const cta = isAuthed ? CTA_AUTHED[result.color] : CTA_GUEST[result.color];

  useEffect(() => {
    const timer = setTimeout(() => setShowBreakdown(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 text-center">
      <div>
        <h2 className="font-display text-2xl text-ink">Tu Renty Score</h2>
        <p className="mt-1 text-sm text-ink-muted">Resultado basado en tus respuestas</p>
      </div>

      <ScoreGauge score={result.total} color={result.color} label={result.label} />

      {/* Message */}
      <p className="mx-auto max-w-md text-[15px] leading-relaxed text-ink-secondary">
        {result.message}
      </p>

      {/* Module breakdown */}
      <div
        className={cn(
          'space-y-4 rounded-2xl border border-border bg-white p-5 text-left transition-all duration-700',
          showBreakdown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <h3 className="text-sm font-semibold text-ink">Desglose por módulo</h3>

        {MODULE_LABELS.map(({ key, label, max }) => {
          const value = result[key];
          const pct = Math.round((value / max) * 100);
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-ink-secondary">{label}</span>
                <span className="font-mono text-ink-muted">
                  {value} / {max}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-sand-dark">
                <div
                  className={cn('h-full rounded-full transition-all duration-1000 ease-out', BAR_COLORS[result.color])}
                  style={{
                    width: showBreakdown ? `${pct}%` : '0%',
                    transitionDelay: '200ms',
                  }}
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

      {/* Primary CTA */}
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
          className="inline-block text-sm text-ink-muted underline-offset-2 hover:text-ink hover:underline"
        >
          Ir a mi cuenta
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-sm text-ink-muted underline-offset-2 hover:text-ink hover:underline"
        >
          Volver a calcular
        </button>
      )}
    </div>
  );
}
