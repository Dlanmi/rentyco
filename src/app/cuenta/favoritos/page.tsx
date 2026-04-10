import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { listFavoriteListings } from '@/lib/db/favorites.repository';
import { ListingGrid } from '@/components/marketplace/ListingGrid';
import { EmptyState } from '@/components/ui/EmptyState';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  const current = await requireUser();
  const listings = await listFavoriteListings(current.user.id);

  return (
    <div>
      <h1 className="font-display text-[28px] text-ink sm:text-[32px]">Favoritos</h1>
      <p className="mt-1 font-body text-md text-ink-secondary">
        {listings.length > 0
          ? `${listings.length} arriendo${listings.length === 1 ? '' : 's'} guardado${listings.length === 1 ? '' : 's'}`
          : 'Los arriendos que guardes aparecerán aquí.'}
      </p>
      <div className="mt-8">
        {listings.length === 0 ? (
          <EmptyState
            title="Aún no tienes favoritos"
            description="Explora arriendos y toca el corazón para guardar los que te gusten."
            action={
              <Link
                href="/bogota/arriendos"
                className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-2.5 font-heading text-label font-600 text-white no-underline transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-px hover:bg-teal-dark hover:shadow-md motion-reduce:transform-none"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
                Explorar arriendos
              </Link>
            }
          />
        ) : (
          <ListingGrid listings={listings} />
        )}
      </div>
    </div>
  );
}
