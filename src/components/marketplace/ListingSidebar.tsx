'use client';

import Link from 'next/link';
import { formatCOP } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ContactModal } from './ContactModal';
import { ReportButton } from './ReportButton';

interface ListingSidebarProps {
  priceCop: number;
  adminFeeCop: number | null;
  depositCop: number | null;
  listingId: string;
  isAuthed: boolean;
  hasScore: boolean;
  isOwner: boolean;
  ownerVerified: boolean;
  acceptsRentyScore: boolean;
}

export function ListingSidebar({
  priceCop,
  adminFeeCop,
  depositCop,
  listingId,
  isAuthed,
  hasScore,
  isOwner,
  ownerVerified,
  acceptsRentyScore,
}: ListingSidebarProps) {
  const totalMonthly = priceCop + (adminFeeCop ?? 0);

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Sticky price card — sticks within the full aside height (which stretches to the grid row) */}
      <div
        className="sticky top-[88px] overflow-hidden rounded-2xl border border-border bg-white shadow-card"
        data-reveal
        data-reveal-delay="0.2"
      >
        {/* Gradient accent strip */}
        <div className="h-1.5 bg-gradient-to-r from-teal to-teal-light" />

        <div className="p-6">
          {/* Eyebrow + price */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="font-mono text-[10px] font-600 uppercase tracking-[0.14em] text-coral">
                Arriendo mensual
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-display text-[clamp(1.6rem,3vw,2rem)] leading-none tracking-tight text-ink">
                  {formatCOP(priceCop)}
                </span>
                <span className="font-body text-[13px] text-ink-muted">/mes</span>
              </div>
              {adminFeeCop != null && adminFeeCop > 0 && (
                <p className="mt-1.5 font-body text-[12.5px] text-ink-muted">
                  + Administración{' '}
                  <strong className="font-600 text-ink">{formatCOP(adminFeeCop)}</strong>
                </p>
              )}
            </div>
            {ownerVerified && (
              <Badge variant="success" className="mt-1 shrink-0">
                Verificado
              </Badge>
            )}
          </div>

          {/* Fee breakdown */}
          {(adminFeeCop != null && adminFeeCop > 0) || (depositCop != null && depositCop > 0) ? (
            <div className="mt-5 rounded-xl bg-sand p-4">
              <FeeRow label="Arriendo mensual" value={formatCOP(priceCop)} />
              {adminFeeCop != null && adminFeeCop > 0 && (
                <>
                  <FeeRow label="Administración" value={formatCOP(adminFeeCop)} />
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-heading text-label font-700 text-ink">
                      Total mensual
                    </span>
                    <span className="font-heading text-label font-700 text-ink">
                      {formatCOP(totalMonthly)}
                    </span>
                  </div>
                </>
              )}
              {depositCop != null && depositCop > 0 && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-body text-[12px] text-ink-muted">Depósito (único)</span>
                  <span className="font-mono text-[12px] text-ink-muted">
                    {formatCOP(depositCop)}
                  </span>
                </div>
              )}
            </div>
          ) : null}

          {/* CTAs */}
          <div className="mt-5 flex flex-col gap-2.5">
            {isOwner ? (
              <Link
                href={`/cuenta/publicaciones/${listingId}/editar`}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal font-heading text-md font-600 text-white transition-colors hover:bg-teal-dark"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar arriendo
              </Link>
            ) : (
              <>
                {isAuthed && hasScore ? (
                  <ContactModal
                    listingId={listingId}
                    isAuthed={isAuthed}
                    hasScore={hasScore}
                    trigger={
                      <button
                        type="button"
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal font-heading text-md font-600 text-white transition-colors hover:bg-teal-dark"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Aplica con tu Renty Score
                      </button>
                    }
                  />
                ) : (
                  <Link
                    href="/renty-score/formulario"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal font-heading text-md font-600 text-white transition-colors hover:bg-teal-dark"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Aplica con tu Renty Score
                  </Link>
                )}
                <ContactModal
                  listingId={listingId}
                  isAuthed={isAuthed}
                  hasScore={hasScore}
                  trigger={
                    <Button variant="outline" size="lg" className="w-full">
                      Contactar arrendador
                    </Button>
                  }
                />
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="mt-5 space-y-3 border-t border-border pt-4">
            <span className="font-mono text-[11px] font-500 uppercase tracking-wider text-ink-muted">
              Garantías
            </span>
            {ownerVerified ? (
              <TrustRow
                icon={
                  <svg
                    className="h-4 w-4 text-teal"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                text="Arrendador verificado"
              />
            ) : (
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning/10">
                  <svg
                    className="h-4 w-4 text-warning"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-body text-[14px] text-ink">Arrendador sin verificar</span>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink-muted">
                    Aún no ha completado el proceso de verificación de Renty.
                  </p>
                </div>
              </div>
            )}
            <TrustRow
              icon={
                <svg
                  className="h-4 w-4 text-teal"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M12 6v6l4 2" />
                </svg>
              }
              text="Responde en ~1 hora"
            />
            {acceptsRentyScore && (
              <TrustRow
                icon={
                  <svg
                    className="h-4 w-4 text-teal"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    />
                  </svg>
                }
                text="Acepta Renty Score"
              />
            )}
          </div>

          {/* Report */}
          {!isOwner && (
            <div className="mt-3 border-t border-border pt-3">
              <ReportButton listingId={listingId} variant="inline" />
            </div>
          )}
        </div>
      </div>

      {/* Why Renty trust card — fills the rail height when content is short */}
      {!isOwner && (
        <div className="rounded-2xl bg-sand-dark p-6">
          <span className="font-mono text-[11px] font-600 uppercase tracking-[0.14em] text-coral">
            Por qué Renty
          </span>
          <h3 className="mt-2 font-display text-[clamp(1.15rem,2.2vw,1.4rem)] leading-tight tracking-tight text-ink">
            Sin codeudor.
            <br />
            Sin sorpresas.
          </h3>
          <ul className="mt-5 flex flex-col gap-3.5">
            {[
              {
                k: 'Pago seguro mensual',
                d: 'El arrendador recibe a tiempo cada mes.',
                path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
              },
              {
                k: 'Depósito protegido',
                d: 'Tu dinero queda en custodia hasta que entregues.',
                path: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4',
              },
              {
                k: 'Tu Renty Score reemplaza al codeudor',
                d: 'Tu historial de pago es la nueva garantía.',
                path: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
              },
            ].map((x) => (
              <li key={x.k} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={x.path} />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-[13.5px] font-600 leading-snug text-ink">
                    {x.k}
                  </p>
                  <p className="mt-0.5 font-body text-[12.5px] leading-snug text-ink-muted">
                    {x.d}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/como-funciona"
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] font-600 uppercase tracking-[0.14em] text-teal no-underline transition-colors hover:text-teal-dark"
          >
            Cómo funciona Renty
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

function FeeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="font-body text-label text-ink-muted">{label}</span>
      <span className="font-mono text-label text-ink">{value}</span>
    </div>
  );
}

function TrustRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal/10">
        {icon}
      </div>
      <span className="font-body text-[14px] text-ink">{text}</span>
    </div>
  );
}
