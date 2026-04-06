import Link from 'next/link';
import Image from 'next/image';
import { requireUser } from '@/lib/auth';
import {
  listInquiriesWithListingsForUser,
  listInquiriesWithListingsForOwner,
  type InquiryWithListing,
} from '@/lib/db/inquiries.repository';
import { formatRelative, formatCOP } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const current = await requireUser();
  const isLandlord = current.profile.role === 'landlord' || current.profile.role === 'admin';

  const [sent, received] = await Promise.all([
    listInquiriesWithListingsForUser(current.user.id),
    isLandlord ? listInquiriesWithListingsForOwner(current.user.id) : Promise.resolve([]),
  ]);

  const totalCount = sent.length + received.length;

  return (
    <div>
      <h1 className="font-display text-[28px] text-ink sm:text-[32px]">Mensajes</h1>
      <p className="mt-1 font-body text-[15px] text-ink-secondary">
        {totalCount > 0
          ? 'Conversaciones con arrendadores e inquilinos.'
          : 'Tus conversaciones aparecerán aquí.'}
      </p>

      {isLandlord && received.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 font-heading text-[14px] font-600 uppercase tracking-wider text-ink-muted">
            Recibidos ({received.length})
          </h2>
          <InquiryList items={received} mode="received" />
        </section>
      )}

      <section className={isLandlord && received.length > 0 ? 'mt-10' : 'mt-8'}>
        <h2 className="mb-4 font-heading text-[14px] font-600 uppercase tracking-wider text-ink-muted">
          Enviados ({sent.length})
        </h2>
        {sent.length === 0 ? (
          <EmptyState
            title="Aún no has enviado mensajes"
            description="Cuando contactes a un arrendador, verás la conversación aquí."
            action={
              <Link
                href="/bogota/arriendos"
                className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-2.5 font-heading text-[13px] font-600 text-white no-underline transition-all hover:-translate-y-px hover:bg-teal-dark hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
                Explorar arriendos
              </Link>
            }
          />
        ) : (
          <InquiryList items={sent} mode="sent" />
        )}
      </section>
    </div>
  );
}

const STATUS_MAP: Record<string, { label: string; variant: 'neutral' | 'success' | 'warning' }> = {
  new: { label: 'Nuevo', variant: 'warning' },
  contacted: { label: 'Respondido', variant: 'success' },
  closed: { label: 'Cerrado', variant: 'neutral' },
};

function InquiryList({ items, mode }: { items: InquiryWithListing[]; mode: 'sent' | 'received' }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((i) => {
        const status = STATUS_MAP[i.status];
        return (
          <article
            key={i.id}
            className="group rounded-2xl border border-border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <Link
                href={`/${i.listing.citySlug}/arriendos/${i.listing.slug}`}
                className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-sand-dark ring-1 ring-border"
              >
                {i.listing.thumbnailUrl && (
                  <Image
                    src={i.listing.thumbnailUrl}
                    alt={i.listing.title}
                    width={80}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/${i.listing.citySlug}/arriendos/${i.listing.slug}`}
                      className="line-clamp-1 font-heading text-[15px] font-600 text-ink no-underline hover:underline"
                    >
                      {i.listing.title}
                    </Link>
                    <div className="mt-0.5 font-mono text-[11px] text-ink-muted">
                      {i.listing.neighborhood ? `${i.listing.neighborhood} · ` : ''}
                      {formatCOP(i.listing.priceCop)}/mes
                    </div>
                  </div>
                  <Badge variant={status?.variant ?? 'neutral'}>{status?.label ?? i.status}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 font-body text-[13px] leading-relaxed text-ink-secondary">
                  {i.message}
                </p>
                <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink-muted">
                  <span>
                    {mode === 'received' && i.senderName ? `De ${i.senderName} · ` : ''}
                    {formatRelative(i.createdAt)}
                  </span>
                  {i.contactPhone && <span>{i.contactPhone}</span>}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
