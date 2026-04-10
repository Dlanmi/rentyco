import Link from 'next/link';

export function RentyScoreBanner({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-teal/10 bg-teal-lighter/60 p-5 ${className ?? ''}`}
      data-reveal
      data-reveal-y="16"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10">
          <svg className="h-5 w-5 text-teal" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <h3 className="font-heading text-md font-600 text-teal-dark">
            Este inmueble acepta Renty Score
          </h3>
          <p className="mt-1 font-body text-label leading-relaxed text-ink-secondary">
            Aplica sin codeudor ni aseguradora. Tu historial de pago es tu mejor respaldo.
          </p>
          <Link
            href="/renty-score"
            className="mt-2 inline-flex items-center gap-1 font-heading text-label font-600 text-teal no-underline transition-colors hover:text-teal-dark"
          >
            Conoce tu Renty Score
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
