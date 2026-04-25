import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Bed,
  Bath,
  Ruler,
  Car,
  Layers,
  Building2,
  MapPin,
  BadgeCheck,
} from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
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
import dynamic from 'next/dynamic';

const SimilarListings = dynamic(() =>
  import('@/components/marketplace/SimilarListings').then((m) => ({
    default: m.SimilarListings,
  }))
);
import { ContactModal } from '@/components/marketplace/ContactModal';
import { StickyMobileCTA } from '@/components/marketplace/StickyMobileCTA';
import { ListingSidebar } from '@/components/marketplace/ListingSidebar';
import { RentyScoreBanner } from '@/components/marketplace/RentyScoreBanner';
import { FavoriteButton } from '@/components/marketplace/FavoriteButton';
import { ShareButton } from '@/components/marketplace/ShareButton';
import { ReportButton } from '@/components/marketplace/ReportButton';
import { Button } from '@/components/ui/Button';
import { formatCOP, formatRelative } from '@/lib/format';
import JsonLd from '@/components/layout/JsonLd';
import { SITE_URL, absoluteUrl } from '@/lib/site';

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getActiveSlugsForCity('bogota', 200);
  return slugs.map((slug) => ({ city: 'bogota', slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}): Promise<Metadata> {
  const { city, slug } = await params;
  const listing = await getListingBySlug(city, slug);
  if (!listing) return {};

  const specs = `${listing.bedrooms} hab · ${listing.bathrooms} baños · ${listing.areaM2} m² · ${formatCOP(listing.priceCop)}/mes.`;
  const descSnippet = listing.description?.slice(0, 120) ?? '';
  const description = descSnippet
    ? `${specs} ${descSnippet}${listing.description && listing.description.length > 120 ? '...' : ''}`
    : specs;

  const firstImage = listing.images[0];
  const ogImage = firstImage?.url ?? absoluteUrl(`/og/listing/${city}--${slug}.png`);

  return buildMetadata({
    title: listing.title,
    description,
    path: `/${city}/arriendos/${slug}`,
    ogImage,
    listing: { priceCop: listing.priceCop },
  });
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  apartaestudio: 'Apartaestudio',
  habitacion: 'Habitación',
  estudio: 'Estudio',
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city, slug } = await params;
  const config = getCity(city);
  if (!config) notFound();
  const listing = await getListingBySlug(city, slug);
  if (!listing || listing.status !== 'active') notFound();

  const [current, similar] = await Promise.all([
    getCurrentUser(),
    listSimilarListings(listing, 4),
  ]);
  const favSet = current
    ? await getFavoriteListingIds(current.user.id)
    : new Set<string>();
  const isFavorited = favSet.has(listing.id);
  const hasScore = !!current && current.profile.renty_score !== null;
  const userScore = current?.profile.renty_score ?? null;
  const isOwner = !!current && current.user.id === listing.owner.id;
  const similarWithFavs = similar.map((l) => ({
    ...l,
    isFavorited: favSet.has(l.id),
  }));

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
      ? [
          {
            name: listing.neighborhood,
            url: `/${city}/arriendos?zona=${listing.neighborhoodSlug}`,
          },
        ]
      : []),
    { name: listing.title, url: pathname },
  ];

  // Build facts list — only include what's available in data
  const facts: Array<{ icon: typeof Bed; label: string; value: string }> = [
    { icon: Bed, label: 'Alcobas', value: String(listing.bedrooms) },
    { icon: Bath, label: 'Baños', value: String(listing.bathrooms) },
    { icon: Ruler, label: 'Área', value: `${listing.areaM2} m²` },
    { icon: Car, label: 'Parqueadero', value: String(listing.parking) },
    ...(listing.estrato != null
      ? [{ icon: Layers, label: 'Estrato', value: String(listing.estrato) }]
      : []),
    ...(listing.floor != null
      ? [{ icon: Building2, label: 'Piso', value: String(listing.floor) }]
      : []),
  ];

  const publishedAgo = listing.publishedAt
    ? formatRelative(listing.publishedAt)
    : null;

  return (
    <>
      <JsonLd data={jsonLd} id="ld-listing" />
      <JsonLd data={buildBreadcrumbSchema(pathname, breadcrumbItems)} id="ld-breadcrumb" />
      <article className="bg-sand pb-32 lg:pb-16">
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
          <nav
            aria-label="Breadcrumbs"
            className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted"
          >
            <Link href="/" className="text-ink-muted no-underline hover:text-ink">
              Inicio
            </Link>
            <span className="mx-2 text-ink-muted/50">/</span>
            <Link
              href={`/${city}/arriendos`}
              className="text-ink-muted no-underline hover:text-ink"
            >
              {config.name}
            </Link>
            {listing.neighborhood && (
              <>
                <span className="mx-2 text-ink-muted/50">/</span>
                <Link
                  href={`/${city}/arriendos?zona=${listing.neighborhoodSlug}`}
                  className="text-ink-muted no-underline hover:text-ink"
                >
                  {listing.neighborhood}
                </Link>
              </>
            )}
          </nav>

          <div className="mb-6 flex items-start justify-between gap-6">
            <div className="min-w-0 max-w-3xl">
              {publishedAgo && (
                <span className="font-mono text-[11px] font-600 uppercase tracking-[0.14em] text-coral">
                  Publicado {publishedAgo}
                </span>
              )}
              <h1 className="mt-2 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.08] tracking-tight text-ink">
                {listing.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[14px] text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Icon icon={MapPin} className="h-3.5 w-3.5" />
                  {listing.neighborhood
                    ? `${listing.neighborhood}, ${config.name}`
                    : config.name}
                </span>
                <span className="text-ink-muted/40">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon icon={Building2} className="h-3.5 w-3.5" />
                  {PROPERTY_TYPE_LABELS[listing.propertyType]}
                </span>
                {listing.owner.verified && (
                  <>
                    <span className="text-ink-muted/40">·</span>
                    <span className="inline-flex items-center gap-1.5 text-teal">
                      <Icon icon={BadgeCheck} className="h-3.5 w-3.5" />
                      Arrendador verificado
                    </span>
                  </>
                )}
                {listing.isFurnished && (
                  <>
                    <span className="text-ink-muted/40">·</span>
                    <span>Amoblado</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ShareButton title={listing.title} url={pathname} />
              <FavoriteButton
                listingId={listing.id}
                initialFavorited={isFavorited}
                size={40}
              />
              {!isOwner && <ReportButton listingId={listing.id} variant="ghost" />}
            </div>
          </div>

          <GalleryGrid images={listing.images} alt={listing.title} />
        </div>

        {/* ── Content sheet ── rounded top overlaps hero on mobile */}
        <div className="relative z-10 -mt-6 rounded-t-3xl bg-sand pt-8 lg:mt-0 lg:rounded-none lg:pt-0">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">
            {/* ── Mobile title block ── editorial */}
            <div className="lg:hidden">
              {/* Mobile breadcrumb */}
              <nav
                aria-label="Breadcrumbs"
                className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted"
              >
                <Link
                  href={`/${city}/arriendos`}
                  className="text-ink-muted no-underline hover:text-ink"
                >
                  {config.name}
                </Link>
                {listing.neighborhood && (
                  <>
                    <span className="mx-1.5 text-ink-muted/40">/</span>
                    <Link
                      href={`/${city}/arriendos?zona=${listing.neighborhoodSlug}`}
                      className="text-ink-muted no-underline hover:text-ink"
                    >
                      {listing.neighborhood}
                    </Link>
                  </>
                )}
              </nav>

              <div data-reveal data-reveal-y="14" data-reveal-fade="false">
                {publishedAgo && (
                  <span className="font-mono text-[10px] font-600 uppercase tracking-[0.14em] text-coral">
                    Publicado {publishedAgo}
                  </span>
                )}
                <h1 className="mt-2 font-display text-[clamp(1.55rem,6.6vw,1.95rem)] leading-[1.1] tracking-tight text-ink">
                  {listing.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-ink-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon icon={MapPin} className="h-3.5 w-3.5" />
                    {listing.neighborhood
                      ? `${listing.neighborhood}, ${config.name}`
                      : config.name}
                  </span>
                  <span className="text-ink-muted/40">·</span>
                  <span>{PROPERTY_TYPE_LABELS[listing.propertyType]}</span>
                  {listing.owner.verified && (
                    <>
                      <span className="text-ink-muted/40">·</span>
                      <span className="inline-flex items-center gap-1 text-teal">
                        <Icon icon={BadgeCheck} className="h-3.5 w-3.5" />
                        Verificado
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Facts strip ── 6 cells desktop, 3 cells mobile, dividers between */}
            <FactsStrip facts={facts} />

            {/* ── Renty Score banner ── */}
            <RentyScoreBanner
              className="mt-6"
              isAuthed={!!current}
              hasScore={hasScore}
              userScore={userScore}
            />

            {/* ── Two-column grid: main content + sticky sidebar ── */}
            <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[1fr_360px] lg:gap-12 xl:grid-cols-[1fr_380px]">
              <div className="min-w-0">
                {/* ── Description ── editorial 2-col */}
                <Section eyebrow="El inmueble" title="Descripción">
                  <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
                    <div>
                      <p className="whitespace-pre-line break-words font-body text-[15.5px] leading-[1.7] text-ink-secondary">
                        {listing.description}
                      </p>
                      {(listing.isFurnished || listing.acceptsRentyScore) && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {listing.isFurnished && <Tag>Amoblado</Tag>}
                          {!listing.isFurnished && <Tag>Sin amoblar</Tag>}
                          {listing.acceptsRentyScore && <Tag>Acepta Renty Score</Tag>}
                          {listing.estrato && <Tag>Estrato {listing.estrato}</Tag>}
                          <Tag>{PROPERTY_TYPE_LABELS[listing.propertyType]}</Tag>
                        </div>
                      )}
                    </div>
                    <TermsAside
                      priceCop={listing.priceCop}
                      adminFeeCop={listing.adminFeeCop}
                      depositCop={listing.depositCop}
                    />
                  </div>
                </Section>

                {/* ── Amenities ── */}
                {listing.amenities.length > 0 && (
                  <Section eyebrow="Lo que incluye" title="Áreas comunes y amenities.">
                    <AmenitiesGrid amenities={listing.amenities} />
                  </Section>
                )}

                {/* ── Location ── */}
                {listing.lat != null && listing.lng != null && (
                  <Section
                    eyebrow="Ubicación"
                    title={
                      listing.neighborhood
                        ? `${listing.neighborhood}, ${config.name}.`
                        : `${config.name}.`
                    }
                    intro="Por seguridad, mostramos el área aproximada. La dirección exacta se comparte cuando el arrendador acepta tu solicitud."
                  >
                    <LocationMap lat={Number(listing.lat)} lng={Number(listing.lng)} />
                  </Section>
                )}

                {/* ── Rules ── */}
                {listing.rules && (
                  <Section
                    eyebrow="Reglas de la casa"
                    title="Lo que el arrendador pide al firmar."
                  >
                    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
                      <p className="whitespace-pre-line break-words font-body text-[15px] leading-[1.7] text-ink-secondary">
                        {listing.rules}
                      </p>
                      <aside className="rounded-2xl bg-sand-dark p-6">
                        <span className="font-mono text-[11px] font-600 uppercase tracking-[0.14em] text-teal-dark">
                          Tip de Renty
                        </span>
                        <p className="mt-2 font-body text-[14px] leading-relaxed text-ink">
                          El contrato escrito te cubre legalmente. Renty lo genera por
                          defecto y queda firmado digitalmente, con validez ante la Ley
                          820 de 2003.
                        </p>
                      </aside>
                    </div>
                  </Section>
                )}
              </div>

              {/* ── Sticky sidebar — desktop only ── */}
              <aside className="hidden lg:block">
                <ListingSidebar
                  priceCop={listing.priceCop}
                  adminFeeCop={listing.adminFeeCop}
                  depositCop={listing.depositCop}
                  listingId={listing.id}
                  isAuthed={!!current}
                  hasScore={hasScore}
                  isOwner={isOwner}
                  ownerVerified={listing.owner.verified}
                  acceptsRentyScore={listing.acceptsRentyScore}
                />
              </aside>
            </div>

            {/* ── Landlord card — full-width editorial.
                Internal section already has border-t + pt-10/12, so no extra wrapper margin. */}
            <LandlordCard
              owner={listing.owner}
              acceptsRentyScore={listing.acceptsRentyScore}
              variant="editorial"
            />

            {/* ── Similar listings — full-width sand-dark band ── */}
            {similarWithFavs.length > 0 && (
              <div className="-mx-5 mt-10 bg-sand-dark px-5 py-10 sm:-mx-6 sm:mt-14 sm:px-6 sm:py-12 lg:-mx-12 lg:rounded-t-3xl lg:px-12 lg:py-16">
                <SimilarListings
                  listings={similarWithFavs}
                  citySlug={city}
                  neighborhood={listing.neighborhood}
                  neighborhoodSlug={listing.neighborhoodSlug}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <StickyMobileCTA
          priceCop={listing.priceCop}
          adminFeeCop={listing.adminFeeCop}
          acceptsRentyScore={listing.acceptsRentyScore}
          hasScore={hasScore}
        >
          {!isOwner ? (
            <ContactModal
              listingId={listing.id}
              isAuthed={!!current}
              hasScore={hasScore}
              trigger={
                <Button variant="primary" size="md" className="h-11 gap-1.5 px-5">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Contactar
                </Button>
              }
            />
          ) : (
            <Link
              href={`/cuenta/publicaciones/${listing.id}/editar`}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-teal px-5 font-heading text-[14px] font-600 text-white"
            >
              Editar
            </Link>
          )}
        </StickyMobileCTA>
      </article>
    </>
  );
}

/** Editorial section with mono eyebrow + DM Serif title + optional intro. */
function Section({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="border-b border-border py-10 last:border-0 sm:py-12"
      data-reveal
      data-reveal-y="14"
      data-reveal-fade="false"
    >
      <div className="mb-6 max-w-2xl sm:mb-7">
        <span className="font-mono text-[11px] font-600 uppercase tracking-[0.14em] text-coral">
          {eyebrow}
        </span>
        <h2 className="mt-2 font-display text-[clamp(1.4rem,3vw,1.9rem)] leading-tight tracking-tight text-ink">
          {title}
        </h2>
        {intro && (
          <p className="mt-2.5 font-body text-[14.5px] leading-relaxed text-ink-muted">
            {intro}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sand-dark px-3 py-1 font-body text-[12.5px] font-500 text-ink-secondary">
      {children}
    </span>
  );
}

/** Side card with key contract terms. */
function TermsAside({
  priceCop,
  adminFeeCop,
  depositCop,
}: {
  priceCop: number;
  adminFeeCop: number | null;
  depositCop: number | null;
}) {
  const rows: Array<{ k: string; v: string }> = [
    { k: 'Arriendo mensual', v: formatCOP(priceCop) },
    ...(adminFeeCop != null && adminFeeCop > 0
      ? [{ k: 'Administración', v: formatCOP(adminFeeCop) }]
      : []),
    ...(depositCop != null && depositCop > 0
      ? [{ k: 'Depósito', v: formatCOP(depositCop) }]
      : [{ k: 'Depósito', v: '1 mes (estándar)' }]),
    { k: 'Disponibilidad', v: 'Inmediata' },
    { k: 'Contrato mínimo', v: '12 meses' },
  ];
  return (
    <aside className="rounded-2xl border border-border bg-white p-6 sm:p-7">
      <span className="font-mono text-[11px] font-600 uppercase tracking-[0.14em] text-teal-dark">
        Términos
      </span>
      <dl className="mt-4 flex flex-col gap-3.5">
        {rows.map((r, i) => (
          <div
            key={r.k}
            className={`flex items-baseline justify-between gap-3 ${
              i < rows.length - 1
                ? 'border-b border-dashed border-border pb-3.5'
                : ''
            }`}
          >
            <dt className="font-body text-[13px] text-ink-muted">{r.k}</dt>
            <dd className="font-body text-[13.5px] font-500 text-ink">{r.v}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

/** Compact horizontal facts row — adapts column count to fact count.
 *  Dividers rendered via gap-px on a border-colored grid. */
function FactsStrip({
  facts,
}: {
  facts: Array<{ icon: typeof Bed; label: string; value: string }>;
}) {
  // Pick column counts that fill cleanly on each breakpoint.
  // Mobile: 2 cols when 4 facts (2×2), else 3 cols.
  // Desktop: one row of N (capped at 6).
  const mobileCols = facts.length === 4 ? 'grid-cols-2' : 'grid-cols-3';
  const desktopCols =
    facts.length === 3
      ? 'lg:grid-cols-3'
      : facts.length === 4
        ? 'lg:grid-cols-4'
        : facts.length === 5
          ? 'lg:grid-cols-5'
          : 'lg:grid-cols-6';

  // For 5 facts on mobile (3-col), pad with one filler cell to keep dividers
  // tidy. The filler hides on desktop where the grid drops to grid-cols-5.
  const mobilePad = facts.length === 5 ? 1 : 0;

  return (
    <div
      className="mt-6 overflow-hidden rounded-2xl bg-border shadow-card-sm sm:mt-8"
      data-reveal
      data-reveal-y="12"
      data-reveal-fade="false"
    >
      <div className={`grid gap-px bg-border ${mobileCols} ${desktopCols}`}>
        {facts.map((f) => (
          <div
            key={f.label}
            className="flex flex-col gap-2 bg-white px-3.5 py-4 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-5 lg:px-5 lg:py-4"
          >
            <Icon
              icon={f.icon}
              className="h-[18px] w-[18px] shrink-0 text-teal"
              strokeWidth={1.8}
            />
            <div className="min-w-0">
              <p className="truncate font-mono text-[10px] font-500 uppercase tracking-[0.12em] text-ink-muted">
                {f.label}
              </p>
              <p className="mt-0.5 truncate font-heading text-[15px] font-600 leading-tight text-ink">
                {f.value}
              </p>
            </div>
          </div>
        ))}
        {Array.from({ length: mobilePad }).map((_, i) => (
          <div key={`pad-${i}`} className="bg-white lg:hidden" aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}
