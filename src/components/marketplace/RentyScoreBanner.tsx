import Link from 'next/link';

interface RentyScoreBannerProps {
  className?: string;
  isAuthed?: boolean;
  hasScore?: boolean;
  userScore?: number | null;
}

/**
 * Editorial Renty Score banner — three states:
 *   - Authed + has score → mini gauge + "APTO PARA ESTE INMUEBLE" pill + score line
 *   - Authed without score → CTA to calculate
 *   - Guest → CTA to sign in and calculate
 */
export function RentyScoreBanner({
  className,
  isAuthed = false,
  hasScore = false,
  userScore = null,
}: RentyScoreBannerProps) {
  if (hasScore && userScore != null) {
    const arc = (userScore / 850) * 163.36;
    return (
      <div
        className={`rounded-2xl border border-teal/15 bg-teal-lighter/70 p-4 sm:p-5 ${className ?? ''}`}
        data-reveal
        data-reveal-y="14"
        data-reveal-fade="false"
      >
        <div className="flex items-center gap-4">
          {/* Mini gauge */}
          <div className="relative shrink-0">
            <svg width="60" height="60" viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgb(13 107 88 / 0.12)" strokeWidth="6" />
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="var(--color-teal)"
                strokeWidth="6"
                strokeDasharray={`${arc} 163.36`}
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
              />
              <text
                x="32"
                y="37"
                textAnchor="middle"
                style={{ font: '600 16px ui-monospace, SFMono-Regular, Menlo, monospace', fill: 'var(--color-ink)' }}
              >
                {userScore}
              </text>
            </svg>
          </div>

          {/* Message */}
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/15 px-2 py-0.5 font-mono text-[10px] font-600 uppercase tracking-[0.12em] text-teal-dark">
              <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
              </svg>
              Apto para este inmueble
            </span>
            <p className="mt-1.5 font-heading text-[14px] font-600 leading-snug text-ink sm:text-md">
              Tu Renty Score <span className="text-teal-dark">{userScore}</span> te posiciona como inquilino confiable.
            </p>
            <Link
              href="/cuenta/mi-score"
              className="mt-1 inline-flex items-center gap-1 font-heading text-[12.5px] font-600 text-teal no-underline transition-colors hover:text-teal-dark"
            >
              Ver detalle
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No-score / guest CTA
  const ctaHref = isAuthed ? '/renty-score/formulario' : '/entrar';
  const ctaText = isAuthed ? 'Calcular mi score' : 'Crear cuenta y calcular';

  return (
    <div
      className={`rounded-2xl border border-teal/15 bg-teal-lighter/60 p-4 sm:p-5 ${className ?? ''}`}
      data-reveal
      data-reveal-y="14"
      data-reveal-fade="false"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-mono text-[10px] font-600 uppercase tracking-[0.14em] text-coral">RENTY SCORE</span>
          <h3 className="mt-0.5 font-heading text-md font-700 leading-snug text-ink">
            Aplica sin codeudor con tu Renty Score
          </h3>
          <p className="mt-1 font-body text-[13px] leading-relaxed text-ink-secondary">
            Tu historial de pago es tu mejor garantía. Calcúlalo en menos de 3 minutos.
          </p>
          <Link
            href={ctaHref}
            className="mt-2 inline-flex items-center gap-1 font-heading text-[13px] font-600 text-teal no-underline transition-colors hover:text-teal-dark"
          >
            {ctaText}
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
