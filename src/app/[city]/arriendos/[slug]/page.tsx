import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bed, Bath, Maximize2, Car, Layers, Building2 } from 'lucide-react';
import { getCity } from '@/lib/cities';
import {
  getListingBySlug,
  listSimilarListings,
  getActiveSlugsForCity,
} from '@/lib/db/listings.repository';
import { getCurrentUser } from '@/lib/auth';
import { getFavoriteListingIds } from '@/lib/db/favorites.repository';
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { GalleryGrid } from '@/components/marketplace/GalleryGrid';
import { MobileHeroCarousel } from '@/components/marketplace/MobileHeroCarousel';
import { AmenitiesGrid } from '@/components/marketplace/AmenitiesGrid';
import { LocationMap } from '@/components/marketplace/LocationMap';
import { LandlordCard } from '@/components/marketplace/LandlordCard';
import { SimilarListings } from '@/components/marketplace/SimilarListings';
import { ContactModal } from '@/components/marketplace/ContactModal';
import { StickyMobileCTA } from '@/components/marketplace/StickyMobileCTA';
import { ListingSidebar } from '@/components/marketplace/ListingSidebar';
import { RentyScoreBanner } from '@/components/marketplace/RentyScoreBanner';
import { FavoriteButton } from '@/components/marketplace/FavoriteButton';
import { ShareButton } from '@/components/marketplace/ShareButton';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCOP, formatDate } from '@/lib/format';
import JsonLd from '@/components/layout/JsonLd';
import { SITE_URL, absoluteUrl } from '@/lib/site';

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getActiveSlugsForCity('bogota', 200);
  return slugs.map((slug) => ({ city: 'bogota', slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ city: string; slug: string }> }): Promise<Metadata> {
  const { city, slug } = await params;
  const listing = await getListingBySlug(city, slug);
  if (!listing) return {};
  const description = `${listing.bedrooms} hab · ${listing.bathrooms} baños · ${listing.areaM2} m² en ${listing.neighborhood ?? city}. ${formatCOP(listing.priceCop)}/mes.`;
  return buildMetadata({
    title: listing.title,
    description,
    path: `/${city}/arriendos/${slug}`,
    ogImage: absoluteUrl(`/og/listing/${city}--${slug}.png`),
    listing: { priceCop: listing.priceCop },
  });
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartamento: 'Apartamento', casa: 'Casa', apartaestudio: 'Apartaestudio',
  habitacion: 'Habitación', estudio: 'Estudio',
};

export default async function ListingDetailPage({
  params,
}: { params: Promise<{ city: string; slug: string }> }) {
  const { city, slug } = await params;
  const config = getCity(city);
  if (!config) notFound();
  const listing = await getListingBySlug(city, slug);
  if (!listing || listing.status !== 'active') notFound();

  const [current, similar] = await Promise.all([
    getCurrentUser(),
    listSimilarListings(listing, 4),
  ]);
  const favSet = current ? await getFavoriteListingIds(current.user.id) : new Set<string>();
  const isFavorited = favSet.has(listing.id);
  const similarWithFavs = similar.map((l) => ({ ...l, isFavorited: favSet.has(l.id) }));

  const pathname = `/${city}/arriendos/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.description,
    url: `${SITE_URL}${pathname}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${pathname}` },
    image: listing.images.map((i) => i.url),
    datePosted: listing.publishedAt ?? undefined,
    disambiguatingDescription: `${PROPERTY_TYPE_LABELS[listing.propertyType]} en arriendo en ${listing.neighborhood ?? config.name}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.neighborhood ?? config.name,
      addressRegion: config.name,
      addressCountry: 'CO',
    },
    ...(listing.lat != null && listing.lng != null && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: listing.lat,
        longitude: listing.lng,
      },
    }),
    numberOfRooms: listing.bedrooms,
    numberOfBathroomsTotal: listing.bathrooms,
    floorSize: { '@type': 'QuantitativeValue', value: listing.areaM2, unitCode: 'MTK' },
    ...(listing.floor != null && { floorLevel: String(listing.floor) }),
    ...(listing.isFurnished && {
      additionalProperty: { '@type': 'PropertyValue', name: 'Amoblado', value: 'Sí' },
    }),
    offers: {
      '@type': 'Offer',
      price: listing.priceCop,
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: listing.priceCop,
        priceCurrency: 'COP',
        unitText: 'MONTH',
      },
    },
  };

  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: `Arriendos ${config.name}`, url: `/${city}/arriendos` },
    ...(listing.neighborhood
      ? [{ name: listing.neighborhood, url: `/${city}/arriendos?zona=${listing.neighborhoodSlug}` }]
      : []),
    { name: listing.title, url: pathname },
  ];

  return (
    <>
      <JsonLd data={jsonLd} id="ld-listing" />
      <JsonLd data={buildBreadcrumbSchema(pathname, breadcrumbItems)} id="ld-breadcrumb" />
      <article className="bg-sand pb-28 lg:pb-16">
        {/* ── Mobile hero ── full-bleed carousel with overlay buttons */}
        <div className="lg:hidden">
          <MobileHeroCarousel
            images={listing.images}
            alt={listing.title}
            listingId={listing.id}
            initialFavorited={isFavorited}
            shareTitle={listing.title}
            shareUrl={pathname}
          />
        </div>

        {/* ── Desktop header ── breadcrumbs, title, gallery */}
        <div className="mx-auto hidden max-w-7xl px-6 lg:block lg:px-12 lg:pt-10">
          <nav aria-label="Breadcrumbs" className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            <Link href="/" className="text-ink-muted no-underline hover:text-ink">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href={`/${city}/arriendos`} className="text-ink-muted no-underline hover:text-ink">Arriendos {config.name}</Link>
            {listing.neighborhood && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/${city}/arriendos?zona=${listing.neighborhoodSlug}`} className="text-ink-muted no-underline hover:text-ink">
                  {listing.neighborhood}
                </Link>
              </>
            )}
          </nav>

          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-display text-[clamp(1.6rem,3.5vw,2.2rem)] leading-tight text-ink">
                {listing.title}
              </h1>
              <p className="mt-2 flex items-center gap-2 font-mono text-[13px] text-ink-muted">
                <Badge variant="neutral">{PROPERTY_TYPE_LABELS[listing.propertyType]}</Badge>
                {listing.neighborhood && <span>· {listing.neighborhood}</span>}
                {listing.isFurnished && <Badge variant="teal">Amoblado</Badge>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton title={listing.title} url={pathname} />
              <FavoriteButton listingId={listing.id} initialFavorited={isFavorited} size={40} />
            </div>
          </div>

          <GalleryGrid images={listing.images} alt={listing.title} />
        </div>

        {/* ── Content sheet ── rounded top overlaps hero on mobile */}
        <div className="relative z-10 -mt-6 rounded-t-3xl bg-sand pt-8 lg:mt-0 lg:rounded-none lg:pt-0">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            {/* Mobile title — centered, slide-up animation */}
            <div className="text-center lg:hidden" data-reveal data-reveal-y="16" data-reveal-fade="false" data-reveal-duration="0.5">
              <h2 className="font-display text-[26px] leading-tight text-ink">
                {listing.title}
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                {PROPERTY_TYPE_LABELS[listing.propertyType]}
                {listing.neighborhood && ` en ${listing.neighborhood}`}
              </p>
            </div>

            {/* Mobile specs strip — horizontal with dot dividers */}
            <div className="flex items-center justify-center gap-3 py-4 text-sm text-ink-muted lg:hidden" data-reveal data-reveal-y="12" data-reveal-fade="false" data-reveal-duration="0.4" data-reveal-delay="0.1">
              <span>{listing.bedrooms} hab</span>
              <span className="h-1 w-1 rounded-full bg-ink-muted/40" />
              <span>{listing.bathrooms} baños</span>
              <span className="h-1 w-1 rounded-full bg-ink-muted/40" />
              <span>{listing.areaM2}&nbsp;m²</span>
              {listing.isFurnished && (
                <>
                  <span className="h-1 w-1 rounded-full bg-ink-muted/40" />
                  <span>Amoblado</span>
                </>
              )}
            </div>

            {/* Mobile landlord row — Airbnb host-style */}
            <div className="flex items-center gap-4 border-y border-border py-5 lg:hidden" data-reveal data-reveal-y="16" data-reveal-fade="false" data-reveal-duration="0.5" data-reveal-delay="0.15">
              <Avatar src={listing.owner.avatarUrl} name={listing.owner.fullName} size={48} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-[15px] font-semibold text-ink">
                    {listing.owner.fullName ?? 'Arrendador Renty'}
                  </span>
                  {listing.owner.verified && <Badge variant="teal">Verificado</Badge>}
                </div>
                <p className="mt-0.5 text-[13px] text-ink-muted">
                  Miembro desde {formatDate(listing.owner.memberSince, { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Two-column grid */}
            <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[1fr_380px] lg:gap-14">
              <div>
                {/* Desktop stats row — no data-reveal when hidden on mobile */}
                <div className="hidden grid-cols-2 gap-5 rounded-2xl bg-sand-dark/50 p-6 sm:grid-cols-4 lg:grid">
                  <Stat label="Habitaciones" value={`${listing.bedrooms}`} icon={<Bed className="h-4 w-4" />} />
                  <Stat label="Baños" value={`${listing.bathrooms}`} icon={<Bath className="h-4 w-4" />} />
                  <Stat label="Área" value={`${listing.areaM2} m²`} icon={<Maximize2 className="h-4 w-4" />} />
                  <Stat label="Parqueadero" value={`${listing.parking}`} icon={<Car className="h-4 w-4" />} />
                  {listing.estrato && <Stat label="Estrato" value={`${listing.estrato}`} icon={<Layers className="h-4 w-4" />} />}
                  {listing.floor != null && <Stat label="Piso" value={`${listing.floor}`} icon={<Building2 className="h-4 w-4" />} />}
                </div>

                {/* Renty Score Banner */}
                <RentyScoreBanner className="mt-6" />

                {/* Descripción */}
                <div className="border-b border-border py-8" data-reveal data-reveal-y="12">
                  <SectionHeading>Descripción</SectionHeading>
                  <p className="whitespace-pre-line font-body text-[15px] leading-relaxed text-ink-secondary">
                    {listing.description}
                  </p>
                </div>

                {/* Amenidades */}
                {listing.amenities.length > 0 && (
                  <div className="border-b border-border py-8" data-reveal data-reveal-y="12">
                    <SectionHeading>Lo que incluye</SectionHeading>
                    <AmenitiesGrid amenities={listing.amenities} />
                  </div>
                )}

                {/* Ubicación */}
                {listing.lat != null && listing.lng != null && (
                  <div className="border-b border-border py-8" data-reveal data-reveal-y="12">
                    <SectionHeading>Ubicación</SectionHeading>
                    <LocationMap lat={Number(listing.lat)} lng={Number(listing.lng)} />
                  </div>
                )}

                {/* Reglas */}
                {listing.rules && (
                  <div className="border-b border-border py-8" data-reveal data-reveal-y="12">
                    <SectionHeading>Reglas de la casa</SectionHeading>
                    <p className="whitespace-pre-line font-body text-[15px] leading-relaxed text-ink-secondary">
                      {listing.rules}
                    </p>
                  </div>
                )}

                {/* Arrendador — desktop card */}
                <div className="hidden py-8 lg:block">
                  <SectionHeading>Conoce al arrendador</SectionHeading>
                  <LandlordCard owner={listing.owner} variant="light" />
                </div>
              </div>

              {/* Sticky sidebar — desktop only */}
              <aside className="hidden lg:block">
                <ListingSidebar
                  priceCop={listing.priceCop}
                  adminFeeCop={listing.adminFeeCop}
                  depositCop={listing.depositCop}
                  listingId={listing.id}
                  isAuthed={!!current}
                  ownerVerified={listing.owner.verified}
                />
              </aside>
            </div>

            {/* Similar listings in sand-dark band */}
            <div className="-mx-6 mt-12 bg-sand-dark px-6 py-12 lg:-mx-12 lg:px-12 lg:rounded-t-3xl">
              <SimilarListings listings={similarWithFavs} />
            </div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <StickyMobileCTA priceCop={listing.priceCop} adminFeeCop={listing.adminFeeCop}>
          <ContactModal
            listingId={listing.id}
            isAuthed={!!current}
            trigger={
              <Button variant="primary" size="lg" className="gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Agendar visita
              </Button>
            }
          />
        </StickyMobileCTA>
      </article>
    </>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      {icon && (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10 text-teal">
          {icon}
        </span>
      )}
      <div>
        <div className="font-display text-[22px] leading-none text-ink">{value}</div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink-muted">{label}</div>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-5 w-0.5 rounded-full bg-teal" />
      <h2 className="font-display text-[22px] text-ink">{children}</h2>
    </div>
  );
}
