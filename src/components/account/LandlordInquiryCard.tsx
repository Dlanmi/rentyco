'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { formatRelative, formatCOP, formatDate } from '@/lib/format';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { updateInquiryStatus } from '@/app/actions/inquiries';
import type { InquiryWithListing } from '@/lib/db/inquiries.repository';
import { Phone, CheckCircle2, XCircle, ShieldCheck, UserCircle } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

/* ── Constants ──────────────────────────────────────────────────────────── */

const STATUS_MAP: Record<string, { label: string; variant: 'neutral' | 'success' | 'warning' }> = {
  new: { label: 'Nuevo', variant: 'warning' },
  contacted: { label: 'Contactado', variant: 'success' },
  closed: { label: 'Cerrado', variant: 'neutral' },
};

const SCORE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  verde: { bg: 'bg-green-50', text: 'text-green-800', label: 'Excelente' },
  amarillo: { bg: 'bg-amber-50', text: 'text-amber-900', label: 'Buen camino' },
  naranja: { bg: 'bg-orange-50', text: 'text-orange-800', label: 'En construcción' },
  rojo: { bg: 'bg-red-50', text: 'text-red-800', label: 'Por mejorar' },
};

/* ── Trust Signal ───────────────────────────────────────────────────────── */

function TrustSignal({
  score,
  color,
  trustFactor,
}: {
  score: number | null;
  color: string | null;
  trustFactor: number | null;
}) {
  if (score == null || !color) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-sand-dark/50 px-3 py-2">
        <Icon icon={UserCircle} className="h-4 w-4 text-ink-muted" />
        <span className="text-label text-ink-muted">Sin Renty Score</span>
      </div>
    );
  }

  const s = SCORE_STYLES[color] ?? SCORE_STYLES.verde!;

  // trustFactor: NULL = v1 (no verification info), 0.5 = v2 unverified, >0.5 = partial, 1.0 = full
  const verificationLabel =
    trustFactor == null
      ? null
      : trustFactor >= 1.0
        ? 'Completamente verificado'
        : trustFactor > 0.5
          ? 'Parcialmente verificado'
          : null;

  return (
    <div className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5', s.bg)}>
      <Icon icon={ShieldCheck} className={cn('h-5 w-5 shrink-0', s.text)} />
      <div>
        <div className={cn('text-[14px] font-600', s.text)}>
          Inquilino {s.label.toLowerCase()}
        </div>
        {verificationLabel && (
          <div className="mt-0.5 text-[11px] text-ink-muted">{verificationLabel}</div>
        )}
      </div>
    </div>
  );
}

/* ── Card ────────────────────────────────────────────────────────────────── */

export function LandlordInquiryCard({ inquiry }: { inquiry: InquiryWithListing }) {
  const [pending, start] = useTransition();
  const status = STATUS_MAP[inquiry.status];
  const profile = inquiry.senderProfile;

  function handleStatus(newStatus: 'contacted' | 'closed') {
    start(async () => {
      await updateInquiryStatus({ id: inquiry.id, status: newStatus });
    });
  }

  return (
    <article className="group rounded-2xl border border-border bg-white transition-shadow duration-200 hover:shadow-md">
      {/* Zone 1: Context line */}
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
        <Badge variant={status?.variant ?? 'neutral'}>{status?.label ?? inquiry.status}</Badge>
        <Link
          href={`/${inquiry.listing.citySlug}/arriendos/${inquiry.listing.slug}`}
          className="min-w-0 flex-1 truncate text-[12px] text-ink-muted no-underline hover:text-ink hover:underline"
        >
          {inquiry.listing.title}
          {inquiry.listing.neighborhood ? ` · ${inquiry.listing.neighborhood}` : ''}
          {' · '}
          {formatCOP(inquiry.listing.priceCop, { short: true })}/mes
        </Link>
        <span className="shrink-0 font-mono text-2xs text-ink-muted">
          {formatRelative(inquiry.createdAt)}
        </span>
      </div>

      <div className="p-4">
        {/* Zone 2: WHO + TRUST */}
        <div className="flex items-center gap-3">
          <Avatar
            src={profile?.avatarUrl}
            name={profile?.fullName ?? inquiry.senderName}
            size={48}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-heading text-[16px] font-600 text-ink">
                {profile?.fullName ?? inquiry.senderName ?? 'Inquilino'}
              </span>
              {profile?.verified && (
                <Icon icon={CheckCircle2} className="h-4 w-4 shrink-0 text-teal" />
              )}
            </div>
            {profile?.memberSince && (
              <span className="text-[12px] text-ink-muted">
                Miembro desde {formatDate(profile.memberSince, { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3">
          <TrustSignal
            score={profile?.rentyScore ?? null}
            color={profile?.rentyScoreColor ?? null}
            trustFactor={profile?.rentyTrustFactor ?? null}
          />
        </div>

        {/* Zone 3: Message */}
        <p className="mt-3 rounded-xl bg-sand/60 px-4 py-3 font-body text-label leading-relaxed text-ink-secondary">
          {inquiry.message}
        </p>

        {/* Zone 4: Actions */}
        <div className="mt-3 space-y-2">
          {inquiry.contactPhone && (
            <a
              href={`tel:${inquiry.contactPhone}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-4 py-2.5 font-heading text-[14px] font-600 text-white transition-colors hover:bg-teal-dark"
            >
              <Icon icon={Phone} className="h-4 w-4" />
              Llamar {inquiry.contactPhone}
            </a>
          )}

          {inquiry.status !== 'closed' && (
            <div className="flex items-center gap-2">
              {inquiry.status === 'new' && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleStatus('contacted')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-teal/20 bg-teal-lighter/30 px-3 py-2.5 font-heading text-label font-600 text-teal-dark transition-colors hover:bg-teal-lighter disabled:opacity-50"
                >
                  <Icon icon={CheckCircle2} className="h-3.5 w-3.5" />
                  Marcar contactado
                </button>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={() => handleStatus('closed')}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2.5 font-heading text-label font-600 text-ink-muted transition-colors hover:bg-sand-dark disabled:opacity-50"
              >
                <Icon icon={XCircle} className="h-3.5 w-3.5" />
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
