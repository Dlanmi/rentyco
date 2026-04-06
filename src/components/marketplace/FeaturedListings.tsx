import Link from 'next/link';
import { ListingCard } from './ListingCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ListingCard as ListingCardType } from '@/types/domain';

export function FeaturedListings({
  listings,
  citySlug,
}: {
  listings: ListingCardType[];
  citySlug: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="mb-3 inline-block font-mono text-[12px] font-500 tracking-[0.12em] uppercase text-teal">
            Destacados
          </span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
            Nuevos en {citySlug === 'bogota' ? 'Bogotá' : citySlug}
          </h2>
        </div>
        <Link
          href={`/${citySlug}/arriendos`}
          className="hidden font-heading text-[13px] font-600 text-teal-dark no-underline hover:underline md:inline-block"
        >
          Ver todos →
        </Link>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          title="Pronto publicaremos arriendos"
          description="Estamos activando las primeras propiedades en Bogotá. Entra a tu cuenta para recibir novedades."
        />
      ) : (
        <div
          data-reveal-stagger
          data-reveal-stagger-each="0.08"
          data-reveal-y="16"
          className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {listings.slice(0, 4).map((l, i) => (
            <ListingCard key={l.id} listing={l} priority={i === 0} />
          ))}
        </div>
      )}
    </section>
  );
}
