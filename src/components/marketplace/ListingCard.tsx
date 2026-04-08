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

        {/* Property type + verified badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
            {PROPERTY_LABELS[listing.propertyType]}
          </span>
          {listing.ownerVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal/90 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verificado
            </span>
          )}
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
        <div className="mt-1.5 flex items-center gap-1 text-teal">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="font-heading text-[12px] font-600">Acepta Renty Score</span>
        </div>
      </Link>
    </article>
  );
}
