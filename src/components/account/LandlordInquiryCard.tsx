'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { formatRelative, formatCOP, formatDate } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { updateInquiryStatus } from '@/app/actions/inquiries';
import type { InquiryWithListing } from '@/lib/db/inquiries.repository';
import { Phone, CheckCircle2, XCircle, ShieldCheck, UserCircle } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; variant: 'neutral' | 'success' | 'warning' }> = {
  new: { label: 'Nuevo', variant: 'warning' },
  contacted: { label: 'Contactado', variant: 'success' },
  closed: { label: 'Cerrado', variant: 'neutral' },
};

const SCORE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  verde: { bg: 'bg-green-50', text: 'text-green-800', label: 'Excelente' },
  amarillo: { bg: 'bg-amber-50', text: 'text-amber-900', label: 'Bueno' },
  naranja: { bg: 'bg-orange-50', text: 'text-orange-800', label: 'Moderado' },
  rojo: { bg: 'bg-red-50', text: 'text-red-800', label: 'Por mejorar' },
};

function Avatar({ name, url }: { name: string | null; url: string | null }) {
  const initials = (name ?? '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (url) {
    return (
      <Image
        src={url}
        alt={name ?? 'Avatar'}
        width={44}
        height={44}
        className="h-11 w-11 rounded-full object-cover ring-2 ring-border"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-lighter text-sm font-semibold text-teal-dark ring-2 ring-border">
      {initials}
    </div>
  );
}

function ScoreBadge({ score, color }: { score: number | null; color: string | null }) {
  if (score == null || !color) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sand-dark px-2.5 py-1 text-[11px] font-medium text-ink-muted">
        <UserCircle className="h-3 w-3" />
        Sin Renty Score
      </span>
    );
  }

  const c = SCORE_COLORS[color] ?? SCORE_COLORS.verde!;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
        c!.bg,
        c!.text
      )}
    >
      <ShieldCheck className="h-3 w-3" />
      {score} · {c!.label}
    </span>
  );
}

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
    <article className="group rounded-2xl border border-border bg-white transition-all duration-200 hover:shadow-md">
      {/* Listing header */}
      <div className="flex items-start gap-3 border-b border-border/60 p-4">
        <Link
          href={`/${inquiry.listing.citySlug}/arriendos/${inquiry.listing.slug}`}
          className="h-14 w-[72px] shrink-0 overflow-hidden rounded-xl bg-sand-dark ring-1 ring-border"
        >
          {inquiry.listing.thumbnailUrl && (
            <Image
              src={inquiry.listing.thumbnailUrl}
              alt={inquiry.listing.title}
              width={72}
              height={56}
              className="h-full w-full object-cover"
            />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/${inquiry.listing.citySlug}/arriendos/${inquiry.listing.slug}`}
            className="line-clamp-1 font-heading text-[14px] font-600 text-ink no-underline hover:underline"
          >
            {inquiry.listing.title}
          </Link>
          <div className="mt-0.5 font-mono text-[11px] text-ink-muted">
            {inquiry.listing.neighborhood ? `${inquiry.listing.neighborhood} · ` : ''}
            {formatCOP(inquiry.listing.priceCop)}/mes
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge variant={status?.variant ?? 'neutral'}>{status?.label ?? inquiry.status}</Badge>
          <span className="font-mono text-[10px] text-ink-muted">{formatRelative(inquiry.createdAt)}</span>
        </div>
      </div>

      {/* Tenant profile + message */}
      <div className="p-4">
        {/* Tenant row */}
        <div className="flex items-center gap-3">
          <Avatar name={profile?.fullName ?? inquiry.senderName ?? null} url={profile?.avatarUrl ?? null} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-heading text-[14px] font-600 text-ink">
                {profile?.fullName ?? inquiry.senderName ?? 'Inquilino'}
              </span>
              {profile?.verified && (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal" />
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <ScoreBadge score={profile?.rentyScore ?? null} color={profile?.rentyScoreColor ?? null} />
              {profile?.memberSince && (
                <span className="text-[11px] text-ink-muted">
                  Miembro desde {formatDate(profile.memberSince, { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="mt-3 rounded-xl bg-sand/60 px-4 py-3 font-body text-[13px] leading-relaxed text-ink-secondary">
          {inquiry.message}
        </p>

        {/* Footer: phone + actions */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            {inquiry.contactPhone && (
              <a
                href={`tel:${inquiry.contactPhone}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-lighter/60 px-3 py-1.5 font-mono text-[12px] font-500 text-teal-dark transition-colors hover:bg-teal-lighter"
              >
                <Phone className="h-3 w-3" />
                {inquiry.contactPhone}
              </a>
            )}
          </div>

          {inquiry.status !== 'closed' && (
            <div className="flex items-center gap-2">
              {inquiry.status === 'new' && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleStatus('contacted')}
                  className="inline-flex items-center gap-1 rounded-lg border border-teal/20 bg-teal-lighter/30 px-3 py-1.5 font-heading text-[11px] font-600 text-teal-dark transition-colors hover:bg-teal-lighter disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Marcar contactado
                </button>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={() => handleStatus('closed')}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 font-heading text-[11px] font-600 text-ink-muted transition-colors hover:bg-sand-dark disabled:opacity-50"
              >
                <XCircle className="h-3 w-3" />
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
