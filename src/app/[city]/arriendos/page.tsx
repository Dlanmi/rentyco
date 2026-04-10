import type { Metadata } from 'next';
import Link from 'next/link';
import type { SearchParams } from 'nuqs/server';
import { notFound } from 'next/navigation';
import { getCity } from '@/lib/cities';
import { loadFilterParams, countActiveFilters, type PropertyTypeValue } from '@/lib/search-params';
import { listActiveListings } from '@/lib/db/listings.repository';
import { getCityBySlug, listNeighborhoodsByCity } from '@/lib/db/cities.repository';
import { getCurrentUser } from '@/lib/auth';
import { getFavoriteListingIds } from '@/lib/db/favorites.repository';
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';
import JsonLd from '@/components/layout/JsonLd';
import { ListingGrid } from '@/components/marketplace/ListingGrid';
import { FilterBar } from '@/components/marketplace/FilterBar';
import { FilterDrawer } from '@/components/marketplace/FilterDrawer';
import { ActiveFilterChips } from '@/components/marketplace/ActiveFilterChips';
import { SortDropdown } from '@/components/marketplace/SortDropdown';
import { EmptyState } from '@/components/ui/EmptyState';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const config = getCity(city);
  if (!config) return {};
  const base = buildMetadata({
    title: `Arriendos en ${config.name} sin Codeudor | Apartamentos en Arriendo`,
    description: `Encuentra apartamentos y casas en arriendo en ${config.name}. Sin codeudor, sin fiador. Filtra por zona, precio y habitaciones. Renty.`,
    path: `/${city}/arriendos`,
  });
  return {
    ...base,
    other: {
      ...(base.other as Record<string, string> | undefined),
      'geo.region': config.geoRegion,
      'geo.placename': config.name,
      'geo.position': `${config.mapCenter[0]};${config.mapCenter[1]}`,
      'ICBM': `${config.mapCenter[0]}, ${config.mapCenter[1]}`,
    },
  };
}

interface Props {
  params: Promise<{ city: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function ArriendosPage({ params, searchParams }: Props) {
  const { city } = await params;
  const config = getCity(city);
  if (!config) notFound();

  const filters = await loadFilterParams(searchParams);
  const dbCity = await getCityBySlug(city);
  const neighborhoods = dbCity ? await listNeighborhoodsByCity(dbCity.id) : [];

  const { items, total } = await listActiveListings({
    citySlug: city,
    zonaSlugs: filters.zona.length ? filters.zona : undefined,
    minPrice: filters.min || undefined,
    maxPrice: filters.max || undefined,
    bedrooms: filters.habitaciones || undefined,
    propertyTypes: filters.tipo.length ? (filters.tipo as PropertyTypeValue[]) : undefined,
    furnished: filters.amoblado || undefined,
    acceptsRentyScore: filters.score || undefined,
    sort: filters.sort,
    limit: 24,
    offset: 0,
  });

  const current = await getCurrentUser();
  const favSet = current ? await getFavoriteListingIds(current.user.id) : new Set<string>();
  const listings = items.map((l) => ({ ...l, isFavorited: favSet.has(l.id) }));

  const activeCount = countActiveFilters(filters);

  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: config.name, url: `/${city}` },
    { name: 'Arriendos', url: `/${city}/arriendos` },
  ];

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Arriendos en ${config.name}`,
    numberOfItems: total,
    itemListElement: items.slice(0, 24).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/${city}/arriendos/${l.slug}`),
      name: l.title,
    })),
  };

  return (
    <>
    <JsonLd data={buildBreadcrumbSchema(`/${city}/arriendos`, breadcrumbItems)} id="ld-breadcrumb" />
    <JsonLd data={itemListSchema} id="ld-itemlist" />
    <div className="bg-sand">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12 lg:py-10">
        <nav aria-label="Breadcrumbs" className="mb-4 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          <Link href="/" className="text-ink-muted no-underline hover:text-ink">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href={`/${city}`} className="text-ink-muted no-underline hover:text-ink">{config.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Arriendos</span>
        </nav>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-balance font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-ink">
              Arriendos en {config.name}
            </h1>
            <p className="mt-2 font-mono text-label text-ink-muted">
              {total} {total === 1 ? 'inmueble disponible' : 'inmuebles disponibles'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <FilterDrawer
                neighborhoods={neighborhoods}
                activeCount={activeCount}
                resultCount={total}
              />
            </div>
            <SortDropdown />
          </div>
        </div>

        <div className="hidden lg:block">
          <FilterBar neighborhoods={neighborhoods} />
        </div>

        <ActiveFilterChips neighborhoods={neighborhoods} />

        {listings.length === 0 ? (
          <div className="py-16">
            <EmptyState
              title="Sin resultados"
              description={
                activeCount
                  ? 'Ajusta los filtros para ver más inmuebles.'
                  : 'Aún no hay arriendos publicados en esta ciudad. Vuelve pronto o calcula tu Renty Score.'
              }
              action={
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <Link
                    href={`/${city}/arriendos`}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-2.5 font-heading text-label font-600 text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-teal-dark"
                  >
                    Limpiar filtros
                  </Link>
                  <Link
                    href="/renty-score/formulario"
                    className="font-heading text-label font-600 text-teal no-underline hover:text-teal-dark transition-colors"
                  >
                    Calcula tu Renty Score
                  </Link>
                </div>
              }
            />
          </div>
        ) : (
          <ListingGrid listings={listings} />
        )}
      </div>
    </div>
    </>
  );
}
