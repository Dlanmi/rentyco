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
  { key: 'scoreD' as const, label: 'Transparencia y verificabilidad' },
];

const MODULE_MAX: Record<string, number> = { scoreA: 335, scoreB: 285, scoreC: 190, scoreD: 140 };

const TRUST_FACTOR_GOOD = 0.8;
const TRUST_FACTOR_WARNING = 0.6;

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
  naranja: { text: 'Verificar mi información', href: '/cuenta/mi-score' },
  rojo: { text: 'Verificar mi información', href: '/cuenta/mi-score' },
};

const BAR_COLORS: Record<ScoreColor, string> = {
  verde: 'bg-teal',
  amarillo: 'bg-warning',
  naranja: 'bg-coral',
  rojo: 'bg-error',
};

function getColorForScore(score: number): ScoreColor {
  if (score >= 750) return 'verde';
  if (score >= 600) return 'amarillo';
  if (score >= 400) return 'naranja';
  return 'rojo';
}

const COLOR_EMOJI: Record<ScoreColor, string> = {
  verde: '🟢', amarillo: '🟡', naranja: '🟠', rojo: '🔴',
};

export function ScoreResult({ result, saving, saved, isAuthed = false, saveError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cta = isAuthed ? CTA_AUTHED[result.color] : CTA_GUEST[result.color];

  const projectedFullScore = result.scoreDeclared;
  const projectedFullColor = getColorForScore(projectedFullScore);
  const verifiableGains = result.trustFactorBreakdown?.components.filter((c) => c.pointsIfVerified > 0) ?? [];

  useEffect(() => {
    if (!containerRef.current) return;

    if (prefersReducedMotion()) {
      containerRef.current.querySelectorAll<HTMLElement>('[data-score-bar]').forEach((bar) => {
        bar.style.width = (bar.dataset.scoreBarPct ?? '0') + '%';
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from('[data-score-heading]', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' })
        .from('[data-score-gauge]', { scale: 0.9, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
        .from('[data-score-trust]', { y: 10, opacity: 0, duration: 0.5, ease: 'power2.out' }, '+=0.4')
        .from('[data-score-message]', { opacity: 0, duration: 0.6, ease: 'power2.out' }, '+=0.2')
        .from('[data-score-breakdown]', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, '+=0.3');

      const bars = gsap.utils.toArray<HTMLElement>('[data-score-bar]');
      tl.to(bars, {
        width: (_i: number, el: HTMLElement) => (el.dataset.scoreBarPct ?? '0') + '%',
        duration: 1.0,
        stagger: 0.15,
        ease: 'power2.out',
      }, '-=0.3');

      tl.from('[data-score-verification]', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2');
      tl.from('[data-score-cta]', { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-6 text-center">
      <div data-score-heading>
        <h2 className="font-display text-2xl text-ink">Tu Renty Score</h2>
        <p className="mt-1 text-sm text-ink-muted">Resultado basado en tus respuestas</p>
      </div>

      {/* Main gauge — shows FINAL score */}
      <div data-score-gauge>
        <ScoreGauge score={result.total} color={result.color} label={result.label} />
      </div>

      {/* Trust factor summary — the two-layer explanation */}
      <div data-score-trust className="mx-auto max-w-sm rounded-2xl border border-border bg-sand-dark/30 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-muted">Score declarado</span>
          <span className="font-mono font-semibold text-ink">{result.scoreDeclared}</span>
        </div>
        <div className="my-2 flex items-center justify-between text-sm">
          <span className="text-ink-muted">Factor de verificación</span>
          <span className={cn(
            'font-mono font-semibold',
            result.trustFactor >= TRUST_FACTOR_GOOD ? 'text-teal' : result.trustFactor >= TRUST_FACTOR_WARNING ? 'text-warning' : 'text-coral'
          )}>
            {Math.round(result.trustFactor * 100)}%
          </span>
        </div>
        <div className="border-t border-border pt-2 flex items-center justify-between text-sm">
          <span className="font-medium text-ink">Score actual</span>
          <span className="font-mono text-lg font-bold text-ink">{result.total}</span>
        </div>
      </div>

      {/* Message */}
      <p data-score-message className="mx-auto max-w-md text-[15px] leading-relaxed text-ink-secondary">
        {result.message}
      </p>

      {/* Verification roadmap — projected gains */}
      {verifiableGains.length > 0 && (
        <div data-score-verification className="rounded-2xl border border-teal/20 bg-teal-lighter/30 p-5 text-left">
          <h3 className="mb-1 text-sm font-semibold text-teal-dark">
            Sube tu score verificando tu información
          </h3>
          <p className="mb-4 text-xs text-ink-muted">
            Tu score comienza en 50% y sube a medida que verificas tu información. Cada paso te acerca a tu verdadero potencial.
          </p>

          <div className="space-y-2.5">
            {verifiableGains
              .sort((a, b) => b.pointsIfVerified - a.pointsIfVerified)
              .map((component) => (
              <div key={component.key} className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-ink-secondary">{component.label}</span>
                <span className="shrink-0 rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold text-teal">
                  +{component.pointsIfVerified} pts
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-muted">Score con verificación completa</span>
              <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-ink">
                {projectedFullScore}
                <span className="text-xs">{COLOR_EMOJI[projectedFullColor]}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Module breakdown */}
      <div
        data-score-breakdown
        className="space-y-4 rounded-2xl border border-border bg-white p-5 text-left"
      >
        <h3 className="text-sm font-semibold text-ink">Desglose del score declarado</h3>

        {MODULE_LABELS.map(({ key, label }) => {
          const value = result[key];
          const max = MODULE_MAX[key] ?? 1;
          const pct = Math.round((value / max) * 100);
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-ink-secondary">{label}</span>
                <span className="font-mono text-ink-muted">{pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-sand-dark">
                <div
                  data-score-bar
                  data-score-bar-pct={pct}
                  className={cn('h-full rounded-full', BAR_COLORS[getColorForScore(result.scoreDeclared)])}
                  style={{ width: '0%' }}
                />
              </div>
            </div>
          );
        })}

        {/* Consistency */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-ink-secondary">Consistencia de respuestas</span>
            <span className="font-mono text-ink-muted">{result.consistencyScore}/50</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sand-dark">
            <div
              data-score-bar
              data-score-bar-pct={Math.round((result.consistencyScore / 50) * 100)}
              className={cn('h-full rounded-full', result.consistencyScore >= 40 ? 'bg-teal' : result.consistencyScore >= 20 ? 'bg-warning' : 'bg-error')}
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {result.penalties < 0 && (
          <div className="flex items-center justify-between rounded-lg bg-error/5 px-3 py-2 text-xs">
            <span className="text-error">Penalizaciones</span>
            <span className="font-mono font-semibold text-error">{result.penalties} pts</span>
          </div>
        )}
      </div>

      {/* Inconsistency warning */}
      {result.inconsistencies.length > 0 && (
        <div className="rounded-2xl border border-warning/30 bg-warning/5 p-5 text-left">
          <div className="mb-2 flex items-center gap-2">
            <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-sm font-semibold text-ink">Detectamos algunas inconsistencias</h3>
          </div>
          <p className="mb-3 text-xs text-ink-muted">
            Algunas de tus respuestas no coinciden entre sí. Esto reduce tu puntaje de consistencia.
          </p>
          <ul className="space-y-1.5">
            {result.inconsistencies.map((inc) => (
              <li key={inc.rule} className="flex items-start gap-2 text-xs text-ink-secondary">
                <span className={cn(
                  'mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full',
                  inc.severity === 'alta' ? 'bg-error' : inc.severity === 'media' ? 'bg-warning' : 'bg-ink-muted'
                )} />
                {inc.explanation}
              </li>
            ))}
          </ul>
        </div>
      )}

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
