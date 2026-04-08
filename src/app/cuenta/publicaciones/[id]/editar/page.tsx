import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireOwner } from '@/lib/auth';
import { getEditableListing } from '@/lib/db/listings.repository';
import { getCityBySlug, listNeighborhoodsByCity } from '@/lib/db/cities.repository';
import { ListingForm } from '@/components/admin/ListingForm';
import { ImageUploader } from '@/components/admin/ImageUploader';

export const dynamic = 'force-dynamic';

export default async function EditMyListingPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireOwner(id);

  const listing = await getEditableListing(id);
  if (!listing) notFound();

  const city = await getCityBySlug(listing.citySlug);
  const neighborhoods = city ? await listNeighborhoodsByCity(city.id) : [];

  return (
    <div>
      <nav className="mb-4 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        <Link href="/cuenta/publicaciones" className="no-underline hover:text-ink">Mis arriendos</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Editar</span>
      </nav>
      <h1 className="mb-6 font-display text-[28px] text-ink">{listing.title || 'Editar arriendo'}</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <ListingForm
          mode="edit"
          initial={listing}
          neighborhoods={neighborhoods}
          isAdmin={false}
          currentOwnerId={listing.ownerId}
          currentOwnerName={listing.ownerName ?? undefined}
        />
        <aside>
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="mb-4 font-display text-[18px] text-ink">Fotos</h2>
            <ImageUploader
              listingId={listing.id}
              initialImages={listing.images.map((i) => ({ id: i.id, url: i.url, altText: i.altText }))}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
