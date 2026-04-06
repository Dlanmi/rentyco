import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEditableListing } from '@/lib/db/listings.repository';
import { getCityBySlug, listNeighborhoodsByCity } from '@/lib/db/cities.repository';
import { ListingForm } from '@/components/admin/ListingForm';
import { ImageUploader } from '@/components/admin/ImageUploader';

export const dynamic = 'force-dynamic';

export default async function EditListingPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getEditableListing(id);
  if (!listing) notFound();

  const city = await getCityBySlug(listing.citySlug);
  const neighborhoods = city ? await listNeighborhoodsByCity(city.id) : [];

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <nav className="mb-4 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        <Link href="/admin/listings" className="no-underline hover:text-ink">Arriendos</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Editar</span>
      </nav>
      <h1 className="mb-6 font-display text-[28px] text-ink">{listing.title || 'Editar arriendo'}</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <ListingForm
          mode="edit"
          initial={listing}
          neighborhoods={neighborhoods}
          isAdmin
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
