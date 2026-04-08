import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCity } from '@/lib/cities';
import { CityHero } from '@/components/marketplace/CityHero';
import { StatsStrip } from '@/components/marketplace/StatsStrip';
import { FeaturedListings } from '@/components/marketplace/FeaturedListings';
import { ZoneTiles } from '@/components/marketplace/ZoneTiles';
import { listFeaturedListings, countActiveByCity } from '@/lib/db/listings.repository';
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import JsonLd from '@/components/layout/JsonLd';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const config = getCity(city);
  if (!config) return {};
  const base = buildMetadata({
    title: `Arriendos en ${config.name}`,
    description: `Arriendos en ${config.name} sin codeudor. Apartamentos y casas en arriendo en las mejores zonas. Filtra y arrienda con Renty.`,
    path: `/${city}`,
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

export default async function CityHomePage({
  params,
}: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const config = getCity(city);
  if (!config) notFound();

  const [featured, activeCount] = await Promise.all([
    listFeaturedListings(city, 4),
    countActiveByCity(city),
  ]);

  const stats = config.stats.map((s) =>
    s.label === 'Inmuebles activos'
      ? { ...s, value: activeCount.toString(), count: activeCount }
      : s
  );

  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: config.name, url: `/${city}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(`/${city}`, breadcrumbItems)} id="ld-breadcrumb" />
      <CityHero city={config} />
      <StatsStrip stats={stats} />
      <FeaturedListings listings={featured} citySlug={city} />
      <ZoneTiles city={config} />
      <section className="bg-sand-dark">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 py-16 text-center lg:py-24">
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.4rem)] leading-tight text-ink">
            Arriendo sin codeudor,<br />con tu historial real.
          </h2>
          <p className="max-w-2xl font-body text-[15px] leading-relaxed text-ink-muted">
            Navega todos los arriendos activos en {config.name}. Filtros por zona, precio, habitaciones y tipo.
          </p>
          <Link
            href={`/${city}/arriendos`}
            className="inline-flex items-center gap-2 rounded-xl bg-teal px-7 py-3.5 font-heading text-[15px] font-600 text-white no-underline shadow-lg shadow-teal/20 transition-all hover:-translate-y-0.5 hover:bg-teal-dark"
          >
            Ver todos los arriendos
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>
    </>
  );
}
