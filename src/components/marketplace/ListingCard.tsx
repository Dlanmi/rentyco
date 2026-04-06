import Link from 'next/link';
import { CardCarousel } from './CardCarousel';
import { FavoriteButton } from './FavoriteButton';
import { formatCOP } from '@/lib/format';
import { getCity } from '@/lib/cities';
import type { ListingCard as ListingCardType, PropertyType } from '@/types/domain';

const PROPERTY_LABELS: Record<PropertyType, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  apartaestudio: 'Apartaestudio',
  habitacion: 'Habitación',
  estudio: 'Estudio',
};

export function ListingCard({
  listing,
  priority = false,
}: {
  listing: ListingCardType;
  priority?: boolean;
}) {
  const href = `/${listing.citySlug}/arriendos/${listing.slug}`;
  const cityName =
    getCity(listing.citySlug)?.name ??
    listing.citySlug.charAt(0).toUpperCase() + listing.citySlug.slice(1);
  const location = listing.neighborhood
    ? `${listing.neighborhood}, ${cityName}`
    : cityName;

  return (
    <article className="group relative flex flex-col">
      {/* Image carousel */}
      <Link href={href} className="relative block no-underline" aria-label={listing.title}>
        <CardCarousel
          images={listing.images}
          alt={listing.title}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {/* Favorite */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton listingId={listing.id} initialFavorited={listing.isFavorited} size={36} />
        </div>

        {/* Property type badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
            {PROPERTY_LABELS[listing.propertyType]}
          </span>
        </div>
      </Link>

      {/* Details */}
      <Link href={href} className="mt-3 flex flex-col no-underline">
        <h3 className="text-[15px] font-semibold leading-snug text-ink line-clamp-1">
          {location}
        </h3>
        <p className="mt-0.5 text-sm leading-snug text-ink-muted line-clamp-1">
          {listing.title}
        </p>
        <p className="mt-0.5 text-sm text-ink-muted">
          {listing.bedrooms} hab · {listing.bathrooms} baños · {listing.areaM2}&nbsp;m²
          {listing.isFurnished && ' · Amoblado'}
        </p>
        <p className="mt-1.5">
          <span className="text-[15px] font-semibold text-ink">{formatCOP(listing.priceCop)}</span>
          <span className="text-sm text-ink-muted"> /mes</span>
        </p>
      </Link>
    </article>
  );
}
