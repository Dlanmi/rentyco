import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { listListingsByOwner } from '@/lib/db/listings.repository';
import { formatCOP, formatDate } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ListingStatus } from '@/types/domain';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<ListingStatus, { label: string; variant: 'success' | 'warning' | 'neutral' | 'error' }> = {
  active:         { label: 'Activo', variant: 'success' },
  pending_review: { label: 'En revisión', variant: 'warning' },
  draft:          { label: 'Borrador', variant: 'neutral' },
  paused:         { label: 'Pausado', variant: 'neutral' },
  archived:       { label: 'Archivado', variant: 'error' },
};

export default async function MyListingsPage() {
  const current = await requireUser();
  if (current.profile.role !== 'landlord' && current.profile.role !== 'admin') notFound();
  const items = await listListingsByOwner(current.user.id);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] text-ink sm:text-[32px]">Mis arriendos</h1>
          <p className="mt-1 font-body text-[15px] text-ink-secondary">
            {items.length} publicación{items.length === 1 ? '' : 'es'}
          </p>
        </div>
        <Link
          href="/admin/listings/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 font-heading text-[13px] font-600 text-white no-underline transition-all hover:-translate-y-px hover:bg-teal-dark hover:shadow-md hover:shadow-teal/15"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
          Publicar
        </Link>
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState
            title="Aún no has publicado"
            description="Crea tu primer arriendo y empieza a recibir consultas de inquilinos interesados."
            action={
              <Link
                href="/admin/listings/nuevo"
                className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-2.5 font-heading text-[13px] font-600 text-white no-underline transition-all hover:-translate-y-px hover:bg-teal-dark hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                Publicar arriendo
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((l) => {
              const badge = STATUS_LABEL[l.status];
              return (
                <article
                  key={l.id}
                  className="group rounded-2xl border border-border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-sand-dark ring-1 ring-border">
                      {l.thumbnailUrl && (
                        <Image src={l.thumbnailUrl} alt={l.title} width={80} height={64} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="line-clamp-1 font-heading text-[15px] font-600 text-ink">{l.title}</div>
                          <div className="mt-0.5 font-mono text-[11px] text-ink-muted">
                            {l.neighborhood ? `${l.neighborhood} · ` : ''}
                            {formatCOP(l.priceCop)}/mes · {formatDate(l.createdAt)}
                          </div>
                        </div>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4">
                        <Link
                          href={`/admin/listings/${l.id}/editar`}
                          className="inline-flex items-center gap-1.5 font-heading text-[12px] font-500 text-teal no-underline hover:text-teal-dark"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Editar
                        </Link>
                        {l.status === 'active' && (
                          <Link
                            href={`/${l.citySlug}/arriendos/${l.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 font-heading text-[12px] font-500 text-ink-muted no-underline hover:text-ink"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            Ver público
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
