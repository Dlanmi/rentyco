import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCity } from '@/lib/cities';
import { listActiveListings } from '@/lib/db/listings.repository';
import { getCityBySlug, listNeighborhoodsByCity } from '@/lib/db/cities.repository';
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import JsonLd from '@/components/layout/JsonLd';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ListingGrid } from '@/components/marketplace/ListingGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { formatCOP } from '@/lib/format';

interface RouteParams {
  city: string;
  neighborhood: string;
}

// Pre-render all city+neighborhood combos at build time. New ones appear
// after a deploy, which is fine — neighborhoods change very rarely.
export async function generateStaticParams(): Promise<RouteParams[]> {
  const { listActiveCities } = await import('@/lib/db/cities.repository');
  const cities = await listActiveCities();
  const out: RouteParams[] = [];
  for (const c of cities) {
    const hoods = await listNeighborhoodsByCity(c.id);
    for (const n of hoods) {
      out.push({ city: c.slug, neighborhood: n.slug });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { city, neighborhood } = await params;
  const cityConfig = getCity(city);
  const dbCity = await getCityBySlug(city);
  if (!cityConfig || !dbCity) return {};
  const hoods = await listNeighborhoodsByCity(dbCity.id);
  const hood = hoods.find((h) => h.slug === neighborhood);
  if (!hood) return {};

  return buildMetadata({
    title: `Arriendos en ${hood.name}, ${cityConfig.name} sin Codeudor | Renty`,
    description: `Apartamentos y casas en arriendo en ${hood.name}, ${cityConfig.name}. Sin codeudor ni fiador — solo tu Renty Score. Filtra por precio, habitaciones y amenidades.`,
    path: `/${city}/arriendos/zona/${neighborhood}`,
  });
}

export const revalidate = 3600;

export default async function ZonaPage({
  params,
}: { params: Promise<RouteParams> }) {
  const { city, neighborhood } = await params;
  const cityConfig = getCity(city);
  if (!cityConfig) notFound();
  const dbCity = await getCityBySlug(city);
  if (!dbCity) notFound();
  const hoods = await listNeighborhoodsByCity(dbCity.id);
  const hood = hoods.find((h) => h.slug === neighborhood);
  if (!hood) notFound();

  const { items, total } = await listActiveListings({
    citySlug: city,
    zonaSlugs: [neighborhood],
    limit: 24,
  });

  // Quick price insight for zone — min/max pulled from current inventory.
  const prices = items.map((l) => l.priceCop).filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;

  // Sibling zones for internal linking — same city, excluding current.
  const siblingZones = hoods.filter((h) => h.slug !== neighborhood).slice(0, 6);

  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: cityConfig.name, url: `/${city}` },
    { name: 'Arriendos', url: `/${city}/arriendos` },
    { name: hood.name, url: `/${city}/arriendos/zona/${neighborhood}` },
  ];

  // ItemList schema — Google uses this for richer category-like rendering.
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Arriendos en ${hood.name}, ${cityConfig.name}`,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 10).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${city}/arriendos/${l.slug}`,
      name: l.title,
    })),
  };

  // Place schema gives Google a local-business-ish understanding of the zone.
  const placeJsonLd = hood.lat && hood.lng ? {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${hood.name}, ${cityConfig.name}`,
    containedInPlace: { '@type': 'City', name: cityConfig.name },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: hood.lat,
      longitude: hood.lng,
    },
  } : null;

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(`/${city}/arriendos/zona/${neighborhood}`, breadcrumbs)} id="ld-breadcrumb" />
      <JsonLd data={itemListJsonLd} id="ld-itemlist" />
      {placeJsonLd && <JsonLd data={placeJsonLd} id="ld-place" />}
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-6 pb-16 lg:pt-10">
        {/* Hero — compact, SEO-first */}
        <header className="border-b border-border bg-sand">
          <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:py-14">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-500 tracking-[0.12em] uppercase text-ink-muted">
                <li>
                  <Link href="/" className="hover:text-ink">Inicio</Link>
                </li>
                <li aria-hidden="true">·</li>
                <li>
                  <Link href={`/${city}`} className="hover:text-ink">{cityConfig.name}</Link>
                </li>
                <li aria-hidden="true">·</li>
                <li>
                  <Link href={`/${city}/arriendos`} className="hover:text-ink">Arriendos</Link>
                </li>
                <li aria-hidden="true">·</li>
                <li aria-current="page" className="text-ink">{hood.name}</li>
              </ol>
            </nav>

            <Eyebrow tone="teal" className="mb-4">Zona · {cityConfig.name}</Eyebrow>
            <h1
              className="font-display font-400 text-ink [letter-spacing:-0.02em]"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.08, margin: 0 }}
            >
              Arriendos en {hood.name}
            </h1>
            <p
              className="mt-4 max-w-[64ch] font-body text-ink-secondary"
              style={{ fontSize: 18, lineHeight: 1.55 }}
            >
              {total > 0 ? (
                <>
                  <strong>{total}</strong> {total === 1 ? 'inmueble disponible' : 'inmuebles disponibles'} en {hood.name}, {cityConfig.name}.{' '}
                  {minPrice && maxPrice && (
                    <>
                      Rango: <strong>{formatCOP(minPrice)}</strong> — <strong>{formatCOP(maxPrice)}</strong> al mes.{' '}
                    </>
                  )}
                  Sin codeudor con finca raíz: tu Renty Score es la garantía.
                </>
              ) : (
                <>
                  Aún no tenemos inmuebles activos en {hood.name}. Déjanos tu correo y te avisamos cuando aparezcan — sin spam.
                </>
              )}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/renty-score/formulario"
                className="inline-flex h-12 items-center gap-2 rounded-[14px] bg-teal px-6 font-heading text-[14px] font-600 text-white no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
              >
                Calcular mi score gratis
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href={`/${city}/arriendos?zona=${neighborhood}`}
                className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-border-strong bg-white px-6 font-heading text-[14px] font-600 text-ink no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-teal hover:text-teal"
              >
                Filtrar con mapa
              </Link>
            </div>
          </div>
        </header>

        {/* Listings */}
        <section aria-labelledby="inmuebles-heading" className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:py-14">
          <h2
            id="inmuebles-heading"
            className="mb-6 font-display font-400 text-ink [letter-spacing:-0.01em]"
            style={{ fontSize: 'clamp(22px, 3vw, 30px)', lineHeight: 1.2 }}
          >
            Inmuebles disponibles
          </h2>
          {items.length ? (
            <ListingGrid listings={items} />
          ) : (
            <EmptyState
              title="No hay inmuebles activos por ahora"
              description={`Estamos trabajando para sumar arriendos en ${hood.name}. Mientras tanto puedes calcular tu Renty Score y estar listo.`}
              action={
                <Link
                  href="/renty-score/formulario"
                  className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-teal px-5 font-heading text-[13px] font-600 text-white no-underline hover:bg-teal-dark"
                >
                  Calcular mi score
                </Link>
              }
            />
          )}
        </section>

        {/* Sibling zones */}
        {siblingZones.length > 0 && (
          <section aria-labelledby="otras-zonas-heading" className="border-t border-border bg-sand">
            <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:py-14">
              <h2
                id="otras-zonas-heading"
                className="mb-6 font-display font-400 text-ink [letter-spacing:-0.01em]"
                style={{ fontSize: 'clamp(22px, 3vw, 30px)', lineHeight: 1.2 }}
              >
                Otras zonas en {cityConfig.name}
              </h2>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {siblingZones.map((z) => (
                  <li key={z.slug}>
                    <Link
                      href={`/${city}/arriendos/zona/${z.slug}`}
                      className="flex h-full items-center justify-between gap-2 rounded-[14px] border border-border bg-white px-4 py-3 font-heading text-[14px] font-600 text-ink no-underline transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-teal hover:text-teal hover:shadow-card-sm"
                    >
                      {z.name}
                      <svg aria-hidden="true" className="h-3.5 w-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-5 font-mono text-[11px] font-500 tracking-[0.14em] uppercase text-ink-muted">
                <Link href={`/${city}/arriendos`} className="hover:text-ink">
                  Ver todas las zonas →
                </Link>
              </p>
            </div>
          </section>
        )}

        {/* SEO long-form block — local context for Google + users */}
        <section aria-labelledby="sobre-zona-heading" className="mx-auto max-w-[820px] px-5 py-10 sm:px-8 lg:py-14">
          <h2
            id="sobre-zona-heading"
            className="mb-4 font-display font-400 text-ink [letter-spacing:-0.01em]"
            style={{ fontSize: 'clamp(22px, 3vw, 30px)', lineHeight: 1.2 }}
          >
            Arrendar en {hood.name} con Renty
          </h2>
          <div className="space-y-4 font-body text-[16px] leading-[1.65] text-ink-secondary">
            <p>
              {hood.name} es una de las zonas más buscadas para arrendar en {cityConfig.name}. En Renty vas a encontrar apartamentos, casas y apartaestudios
              publicados por arrendadores que aceptan tu historial como garantía —
              sin pedirte codeudor con finca raíz ni fiador solidario.
            </p>
            <p>
              El proceso es simple: calculas tu Renty Score en 3 minutos, lo
              compartes con el arrendador, y si tu perfil coincide con lo que
              busca, puedes firmar contrato sin un mes perdido en papeleos. La
              Ley 820 de 2003 te cobija como inquilino igual que con un
              contrato tradicional.
            </p>
            <p>
              Si no encuentras lo que buscas hoy en {hood.name}, déjanos tu
              correo y te avisamos apenas se publiquen nuevos inmuebles —
              sin spam y con tu Ley 1581 de datos personales respetada.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
