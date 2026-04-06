/**
 * Branded OG image for listing detail pages.
 * Renders listing photo + gradient overlay + price/title/stats + Renty branding.
 * Slug format: {citySlug}--{listingSlug}.png
 */
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getBuildSupabase } from '@/lib/supabase/build';
import { formatCOP } from '@/lib/format';
import { publicUrlFor } from '@/lib/r2/client';

export const dynamic = 'force-static';
export const revalidate = 300;

const TEAL = '#0D6B58';
const TEAL_LIGHT = '#10B981';
const CORAL = '#E8634A';

async function loadFont(name: string): Promise<ArrayBuffer> {
  const buf = await readFile(join(process.cwd(), 'src', 'fonts', name));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

interface ListingOgData {
  title: string;
  priceCop: number;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  neighborhood: string | null;
  cityName: string;
  imageUrl: string | null;
  propertyType: string;
}

async function getListingData(citySlug: string, listingSlug: string): Promise<ListingOgData | null> {
  const supabase = getBuildSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from('listings')
    .select(
      `title, price_cop, bedrooms, bathrooms, area_m2, property_type,
       neighborhoods(name), cities!inner(slug, name),
       listing_images(r2_key, display_order)`
    )
    .eq('status', 'active')
    .eq('slug', listingSlug)
    .maybeSingle();

  if (!data) return null;

  type Row = typeof data & {
    cities: { slug: string; name: string } | { slug: string; name: string }[];
    neighborhoods: { name: string } | { name: string }[] | null;
    listing_images: { r2_key: string; display_order: number }[];
  };
  const row = data as unknown as Row;
  const city = Array.isArray(row.cities) ? row.cities[0] : row.cities;

  if (city?.slug !== citySlug) return null;

  const images = (row.listing_images ?? []).sort((a, b) => a.display_order - b.display_order);
  const hood = Array.isArray(row.neighborhoods) ? row.neighborhoods[0] : row.neighborhoods;

  const imageUrl = images[0] ? publicUrlFor(images[0].r2_key) : null;

  return {
    title: row.title,
    priceCop: row.price_cop,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaM2: row.area_m2,
    neighborhood: hood?.name ?? null,
    cityName: city?.name ?? 'Bogotá',
    imageUrl,
    propertyType: row.property_type,
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const supabase = getBuildSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('listings')
    .select('slug, cities!inner(slug)')
    .eq('status', 'active')
    .limit(200);
  if (!data) return [];
  return data.map((r) => {
    const cities = r.cities as unknown as { slug: string } | { slug: string }[];
    const citySlug = Array.isArray(cities) ? cities[0]?.slug : cities?.slug;
    return { slug: `${citySlug}--${r.slug}.png` };
  });
}

const TYPE_LABELS: Record<string, string> = {
  apartamento: 'Apartamento', casa: 'Casa', apartaestudio: 'Apartaestudio',
  habitacion: 'Habitación', estudio: 'Estudio',
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug: raw } = await params;
  const slug = raw.replace(/\.png$/, '');
  const sep = slug.indexOf('--');
  if (sep < 0) return new Response('Not found', { status: 404 });

  const citySlug = slug.slice(0, sep);
  const listingSlug = slug.slice(sep + 2);

  const listing = await getListingData(citySlug, listingSlug);
  if (!listing) return new Response('Not found', { status: 404 });

  const [bold, display] = await Promise.all([
    loadFont('DMSans-Bold.ttf'),
    loadFont('DMSerifDisplay-Regular.ttf'),
  ]);

  const locationText = listing.neighborhood
    ? `${listing.neighborhood}, ${listing.cityName}`
    : listing.cityName;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          fontFamily: 'DM Sans',
          backgroundColor: '#1C1917',
        }}
      >
        {/* Background listing image */}
        {listing.imageUrl && (
          <img
            src={listing.imageUrl}
            alt=""
            width={1200}
            height={630}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1200px',
              height: '630px',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.85) 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '48px 56px',
          }}
        >
          {/* Top: Renty logo + property type badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: TEAL,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '22px',
                  fontWeight: 700,
                  fontFamily: 'DM Serif Display',
                }}
              >
                R
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>
                renty.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {TYPE_LABELS[listing.propertyType] ?? listing.propertyType}
              </span>
            </div>
          </div>

          {/* Bottom: Price + title + stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '48px', fontWeight: 700, fontFamily: 'DM Serif Display', color: 'white', lineHeight: 1 }}>
                {formatCOP(listing.priceCop)}
              </span>
              <span style={{ fontSize: '20px', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>
                /mes
              </span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.2,
                maxWidth: '900px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {listing.title}
            </div>

            {/* Stats row + location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                  {listing.bedrooms} hab
                </span>
                <span style={{ width: '4px', height: '4px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                  {listing.bathrooms} {listing.bathrooms === 1 ? 'baño' : 'baños'}
                </span>
                <span style={{ width: '4px', height: '4px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                  {listing.areaM2} m²
                </span>
              </div>
              <span style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.25)' }} />
              <span style={{ fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>
                {locationText}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_LIGHT} 50%, ${CORAL} 100%)`,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'DM Sans', data: bold, weight: 700, style: 'normal' as const },
        { name: 'DM Serif Display', data: display, weight: 400, style: 'normal' as const },
      ],
    }
  );
}
