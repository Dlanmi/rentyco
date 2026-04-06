'use client';

import Link from 'next/link';
import { formatCOP } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ContactModal } from './ContactModal';

interface ListingSidebarProps {
  priceCop: number;
  adminFeeCop: number | null;
  depositCop: number | null;
  listingId: string;
  isAuthed: boolean;
  ownerVerified: boolean;
}

export function ListingSidebar({
  priceCop,
  adminFeeCop,
  depositCop,
  listingId,
  isAuthed,
  ownerVerified,
}: ListingSidebarProps) {
  const totalMonthly = priceCop + (adminFeeCop ?? 0);

  return (
    <div
      className="sticky top-[88px] overflow-hidden rounded-2xl border border-border bg-white shadow-md"
      data-reveal
      data-reveal-delay="0.2"
    >
      {/* Gradient accent strip */}
      <div className="h-1.5 bg-gradient-to-r from-teal to-teal-light" />

      <div className="p-6">
        {/* Price + verified */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[32px] leading-none text-ink">
              {formatCOP(priceCop)}
            </span>
            <span className="font-mono text-[13px] text-ink-muted">/mes</span>
          </div>
          {ownerVerified && (
            <Badge variant="success" className="mt-1 shrink-0">Verificado</Badge>
          )}
        </div>

        {/* Fee breakdown */}
        <div className="mt-5 rounded-xl bg-sand p-4">
          <FeeRow label="Arriendo mensual" value={formatCOP(priceCop)} />
          {adminFeeCop != null && adminFeeCop > 0 && (
            <>
              <FeeRow label="Administración" value={formatCOP(adminFeeCop)} />
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-heading text-[13px] font-700 text-ink">Total mensual</span>
                <span className="font-heading text-[13px] font-700 text-ink">{formatCOP(totalMonthly)}</span>
              </div>
            </>
          )}
          {depositCop != null && depositCop > 0 && (
            <div className="mt-2 flex items-center justify-between">
              <span className="font-body text-[12px] text-ink-muted">Depósito (único)</span>
              <span className="font-mono text-[12px] text-ink-muted">{formatCOP(depositCop)}</span>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-5 flex flex-col gap-2.5">
          <Link
            href="/renty-score"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal font-heading text-[15px] font-600 text-white transition-colors hover:bg-teal-dark"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Aplica con tu Renty Score
          </Link>
          <ContactModal
            listingId={listingId}
            isAuthed={isAuthed}
            trigger={
              <Button variant="outline" size="lg" className="w-full">
                Contactar arrendador
              </Button>
            }
          />
        </div>

        {/* Trust indicators */}
        <div className="mt-5 border-t border-border pt-4 space-y-2.5">
          <TrustRow
            icon={
              <svg className="h-4 w-4 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            text={ownerVerified ? 'Arrendador verificado' : 'Arrendador en Renty'}
          />
          <TrustRow
            icon={
              <svg className="h-4 w-4 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
            }
            text="Responde en ~2 horas"
          />
          <TrustRow
            icon={
              <svg className="h-4 w-4 text-teal" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
            text="Acepta Renty Score"
          />
        </div>
      </div>
    </div>
  );
}

function FeeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="font-body text-[13px] text-ink-muted">{label}</span>
      <span className="font-mono text-[13px] text-ink">{value}</span>
    </div>
  );
}

function TrustRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <span className="font-body text-[13px] text-ink-secondary">{text}</span>
    </div>
  );
}
