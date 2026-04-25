'use client';

import { formatCOP } from '@/lib/format';

export function StickyMobileCTA({
  priceCop,
  adminFeeCop,
  acceptsRentyScore,
  hasScore = false,
  children,
}: {
  priceCop: number;
  adminFeeCop?: number | null;
  acceptsRentyScore: boolean;
  hasScore?: boolean;
  children: React.ReactNode;
}) {
  const totalMonthly = adminFeeCop ? priceCop + adminFeeCop : null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 shadow-[0_-8px_28px_rgb(13_107_88_/_0.10)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}
    >
      {/* Teal accent strip */}
      <div className="h-[3px] bg-gradient-to-r from-teal via-teal-light to-teal" />

      {/* Apto pill — only when user has score */}
      {hasScore && (
        <div className="flex items-center justify-center gap-1.5 bg-teal-lighter/80 py-1 font-mono text-[10px] font-600 uppercase tracking-[0.14em] text-teal-dark">
          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
          </svg>
          Apto para ti
        </div>
      )}

      <div className="flex items-center gap-2.5 px-4 pt-2.5 pb-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[22px] font-700 leading-none text-ink">
              {formatCOP(priceCop)}
            </span>
            <span className="font-body text-[12.5px] text-ink-muted">/mes</span>
          </div>
          {totalMonthly ? (
            <p className="mt-0.5 truncate font-body text-[11.5px] text-ink-muted">
              con admin <span className="font-600 text-ink">{formatCOP(totalMonthly)}</span>
            </p>
          ) : acceptsRentyScore ? (
            <p className="mt-0.5 flex items-center gap-1 truncate font-body text-[11.5px] font-600 text-teal">
              <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Acepta Renty Score
            </p>
          ) : (
            <p className="mt-0.5 truncate font-body text-[11.5px] text-ink-muted">
              Sin codeudor ni aseguradora
            </p>
          )}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}
