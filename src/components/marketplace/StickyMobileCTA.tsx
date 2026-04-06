'use client';

import { formatCOP } from '@/lib/format';

export function StickyMobileCTA({
  priceCop,
  adminFeeCop,
  children,
}: {
  priceCop: number;
  adminFeeCop?: number | null;
  children: React.ReactNode;
}) {
  const totalMonthly = adminFeeCop ? priceCop + adminFeeCop : null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.75rem)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg leading-none text-ink">{formatCOP(priceCop)}</span>
            <span className="text-sm text-ink-muted">/mes</span>
          </div>
          {totalMonthly ? (
            <p className="mt-0.5 text-[12px] text-ink-muted">
              Total mensual aprox. {formatCOP(totalMonthly)}
            </p>
          ) : (
            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-teal">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Acepta Renty Score
            </p>
          )}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}
