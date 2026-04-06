import Link from 'next/link';
import Image from 'next/image';
import { listListingsAdmin } from '@/lib/db/listings.repository';
import { formatCOP, formatDate } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import type { ListingStatus } from '@/types/domain';

export const dynamic = 'force-dynamic';

const STATUS_FILTERS: { value: ListingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending_review', label: 'En revisión' },
  { value: 'active', label: 'Activos' },
  { value: 'draft', label: 'Borradores' },
  { value: 'paused', label: 'Pausados' },
  { value: 'archived', label: 'Archivados' },
];

const STATUS_LABEL: Record<ListingStatus, { label: string; variant: 'success' | 'warning' | 'neutral' | 'error' }> = {
  active:         { label: 'Activo', variant: 'success' },
  pending_review: { label: 'En revisión', variant: 'warning' },
  draft:          { label: 'Borrador', variant: 'neutral' },
  paused:         { label: 'Pausado', variant: 'neutral' },
  archived:       { label: 'Archivado', variant: 'error' },
};

export default async function AdminListingsPage({
  searchParams,
}: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const sp = await searchParams;
  const status = (STATUS_FILTERS.find((f) => f.value === sp.status)?.value ?? 'all') as ListingStatus | 'all';
  const search = sp.q?.trim() || undefined;

  const { items, total } = await listListingsAdmin({ status, search, limit: 50 });

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] text-ink">Arriendos</h1>
          <p className="mt-1 font-mono text-[12px] uppercase tracking-wider text-ink-muted">
            {total} resultados
          </p>
        </div>
        <Link
          href="/admin/listings/nuevo"
          className="rounded-full bg-teal px-4 py-2 font-mono text-[12px] uppercase tracking-wide text-white no-underline hover:bg-teal-dark"
        >
          + Nuevo arriendo
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value === 'all' ? '/admin/listings' : `/admin/listings?status=${f.value}`}
              scroll={false}
              className={
                'rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide no-underline transition-colors ' +
                (status === f.value
                  ? 'border-ink bg-ink text-white'
                  : 'border-border bg-white text-ink-muted hover:border-ink hover:text-ink')
              }
            >
              {f.label}
            </Link>
          ))}
        </div>
        <form className="ml-auto" action="/admin/listings" method="get">
          {status !== 'all' && <input type="hidden" name="status" value={status} />}
          <input
            type="search"
            name="q"
            defaultValue={search ?? ''}
            placeholder="Buscar por título…"
            className="w-[260px] rounded-full border border-border bg-white px-4 py-1.5 font-mono text-[12px] text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
          />
        </form>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white/60 px-6 py-16 text-center">
          <p className="font-heading text-[15px] text-ink">Sin resultados</p>
          <p className="mt-1 font-mono text-[12px] text-ink-muted">Ajusta los filtros o crea un nuevo arriendo.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full border-collapse text-left">
            <thead className="border-b border-border bg-sand-dark/40">
              <tr className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                <th className="px-4 py-3 font-500">Arriendo</th>
                <th className="px-4 py-3 font-500">Estado</th>
                <th className="px-4 py-3 font-500">Precio</th>
                <th className="px-4 py-3 font-500">Arrendador</th>
                <th className="px-4 py-3 font-500">Creado</th>
                <th className="px-4 py-3 font-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((l) => {
                const badge = STATUS_LABEL[l.status];
                return (
                  <tr key={l.id} className="border-b border-border last:border-b-0 hover:bg-sand/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-sand-dark ring-1 ring-border">
                          {l.thumbnailUrl ? (
                            <Image
                              src={l.thumbnailUrl}
                              alt=""
                              width={64}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-heading text-[14px] text-ink">{l.title}</div>
                          <div className="mt-0.5 truncate font-mono text-[11px] text-ink-muted">
                            {l.neighborhood ?? l.cityName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[13px] text-ink">
                      {formatCOP(l.priceCop)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-heading text-[13px] text-ink-secondary">
                      {l.ownerName ?? '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-ink-muted">
                      {formatDate(l.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-3">
                        {l.status === 'active' && (
                          <Link
                            href={`/${l.citySlug}/arriendos/${l.slug}`}
                            target="_blank"
                            className="font-mono text-[11px] uppercase tracking-wide text-ink-muted underline hover:text-ink"
                          >
                            Ver
                          </Link>
                        )}
                        <Link
                          href={`/admin/listings/${l.id}/editar`}
                          className="font-mono text-[11px] uppercase tracking-wide text-teal underline hover:text-teal-dark"
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
