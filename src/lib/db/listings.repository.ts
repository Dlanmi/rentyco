import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { getServerSupabase } from '@/lib/supabase/server';
import { getBuildSupabase } from '@/lib/supabase/build';
import { publicUrlFor } from '@/lib/r2/client';
import type { ListingCard, ListingDetail, PropertyType, ListingStatus } from '@/types/domain';
import type { SortValue } from '@/lib/search-params';

const CARD_SELECT = `
  id, slug, title, price_cop, bedrooms, bathrooms, area_m2,
  property_type, is_furnished,
  cities!inner(slug),
  neighborhoods(slug, name),
  listing_images(id, r2_key, width, height, blurhash, alt_text, display_order)
`;

const DETAIL_SELECT = `
  id, slug, title, description, price_cop, admin_fee_cop, deposit_cop,
  bedrooms, bathrooms, area_m2, floor, parking, is_furnished,
  amenities, rules, lat, lng, estrato, antiguedad, property_type, status, published_at, created_at,
  owner_id,
  cities!inner(slug, name),
  neighborhoods(slug, name),
  listing_images(id, r2_key, width, height, blurhash, alt_text, display_order),
  profiles!listings_owner_id_fkey(id, full_name, avatar_url, verified, created_at)
`;

type DbCard = {
  id: string;
  slug: string;
  title: string;
  price_cop: number;
  bedrooms: number;
  bathrooms: number;
  area_m2: number;
  property_type: PropertyType;
  is_furnished: boolean;
  cities: { slug: string } | { slug: string }[];
  neighborhoods: { slug: string; name: string } | { slug: string; name: string }[] | null;
  listing_images: Array<{
    id: string;
    r2_key: string;
    width: number;
    height: number;
    blurhash: string | null;
    alt_text: string | null;
    display_order: number;
  }>;
};

function one<T>(v: T | T[] | null | undefined): T | null {
  if (v == null) return null;
  return Array.isArray(v) ? v[0] ?? null : v;
}

function mapCard(row: DbCard): ListingCard {
  const city = one(row.cities);
  const hood = one(row.neighborhoods);
  const imgs = (row.listing_images ?? [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((i) => ({
      id: i.id,
      url: publicUrlFor(i.r2_key),
      blurhash: i.blurhash,
      width: i.width,
      height: i.height,
      altText: i.alt_text,
      order: i.display_order,
    }));
  return {
    id: row.id,
    slug: row.slug,
    citySlug: city?.slug ?? 'bogota',
    title: row.title,
    neighborhood: hood?.name ?? null,
    neighborhoodSlug: hood?.slug ?? null,
    priceCop: row.price_cop,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaM2: row.area_m2,
    propertyType: row.property_type,
    isFurnished: row.is_furnished,
    images: imgs,
  };
}

export interface ListingFilters {
  citySlug: string;
  zonaSlugs?: string[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number; // 0=any, 4=4+
  propertyTypes?: string[];
  furnished?: boolean;
  sort?: SortValue;
  limit?: number;
  offset?: number;
}

export async function listActiveListings(
  filters: ListingFilters
): Promise<{ items: ListingCard[]; total: number }> {
  const supabase = await getServerSupabase();
  if (!supabase) return { items: [], total: 0 };

  const limit = filters.limit ?? 24;
  const offset = filters.offset ?? 0;

  let q = supabase
    .from('listings')
    .select(CARD_SELECT, { count: 'exact' })
    .eq('status', 'active' satisfies ListingStatus)
    .eq('cities.slug', filters.citySlug);

  if (filters.zonaSlugs?.length) {
    q = q.in('neighborhoods.slug', filters.zonaSlugs);
  }
  if (filters.minPrice) q = q.gte('price_cop', filters.minPrice);
  if (filters.maxPrice) q = q.lte('price_cop', filters.maxPrice);
  if (filters.bedrooms && filters.bedrooms > 0) {
    if (filters.bedrooms >= 4) q = q.gte('bedrooms', 4);
    else q = q.eq('bedrooms', filters.bedrooms);
  }
  if (filters.propertyTypes?.length) q = q.in('property_type', filters.propertyTypes);
  if (filters.furnished) q = q.eq('is_furnished', true);

  switch (filters.sort) {
    case 'price_asc':  q = q.order('price_cop', { ascending: true });  break;
    case 'price_desc': q = q.order('price_cop', { ascending: false }); break;
    case 'area_desc':  q = q.order('area_m2', { ascending: false });   break;
    default:           q = q.order('published_at', { ascending: false, nullsFirst: false });
  }

  q = q.range(offset, offset + limit - 1);

  const { data, count } = await q;
  const items = (data ?? []).map((r) => mapCard(r as unknown as DbCard));
  return { items, total: count ?? 0 };
}

/** Wrapped with React cache() — deduped within a single server request
 *  (e.g. generateMetadata + page render share one DB call). */
export const getListingBySlug = cache(async (
  citySlug: string,
  slug: string
): Promise<ListingDetail | null> => {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from('listings')
    .select(DETAIL_SELECT)
    .eq('cities.slug', citySlug)
    .eq('slug', slug)
    .maybeSingle();
  if (!data) return null;

  const row = data as unknown as DbCard & {
    description: string;
    admin_fee_cop: number | null;
    deposit_cop: number | null;
    floor: number | null;
    parking: number;
    amenities: string[];
    rules: string | null;
    lat: number | null;
    lng: number | null;
    estrato: number | null;
    antiguedad: number | null;
    status: ListingStatus;
    published_at: string | null;
    owner_id: string;
    profiles:
      | { id: string; full_name: string | null; avatar_url: string | null; verified: boolean; created_at: string }
      | { id: string; full_name: string | null; avatar_url: string | null; verified: boolean; created_at: string }[]
      | null;
  };

  const base = mapCard(row);
  const owner = one(row.profiles);

  return {
    ...base,
    description: row.description,
    adminFeeCop: row.admin_fee_cop,
    depositCop: row.deposit_cop,
    floor: row.floor,
    parking: row.parking ?? 0,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    rules: row.rules,
    lat: row.lat,
    lng: row.lng,
    estrato: row.estrato ?? null,
    antiguedad: row.antiguedad ?? null,
    status: row.status,
    publishedAt: row.published_at,
    owner: {
      id: owner?.id ?? row.owner_id,
      fullName: owner?.full_name ?? null,
      avatarUrl: owner?.avatar_url ?? null,
      verified: owner?.verified ?? false,
      memberSince: owner?.created_at ?? new Date().toISOString(),
    },
  };
});

export async function listSimilarListings(
  detail: ListingDetail,
  max = 6
): Promise<ListingCard[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const band = Math.round(detail.priceCop * 0.25);
  const { data } = await supabase
    .from('listings')
    .select(CARD_SELECT)
    .eq('status', 'active' satisfies ListingStatus)
    .eq('cities.slug', detail.citySlug)
    .neq('id', detail.id)
    .gte('price_cop', detail.priceCop - band)
    .lte('price_cop', detail.priceCop + band)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(max);
  return (data ?? []).map((r) => mapCard(r as unknown as DbCard));
}

async function _listFeaturedListings(citySlug: string, max: number): Promise<ListingCard[]> {
  // Uses build client (no cookies) — safe inside unstable_cache. Listings are public data.
  const supabase = getBuildSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('listings')
    .select(CARD_SELECT)
    .eq('status', 'active' satisfies ListingStatus)
    .eq('cities.slug', citySlug)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(max);
  return (data ?? []).map((r) => mapCard(r as unknown as DbCard));
}

export function listFeaturedListings(citySlug: string, max = 4): Promise<ListingCard[]> {
  return unstable_cache(
    () => _listFeaturedListings(citySlug, max),
    ['featured-listings', citySlug, String(max)],
    { tags: ['listings', `city:${citySlug}`], revalidate: 300 },
  )();
}

export async function getActiveSlugsForCity(citySlug: string, max = 200): Promise<string[]> {
  // Uses build-safe client so this is callable from generateStaticParams.
  const supabase = getBuildSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('listings')
    .select('slug, cities!inner(slug)')
    .eq('status', 'active' satisfies ListingStatus)
    .eq('cities.slug', citySlug)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(max);
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export async function getActiveSlugsWithDatesForCity(
  citySlug: string,
  max = 500
): Promise<Array<{ slug: string; updatedAt: string }>> {
  const supabase = getBuildSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('listings')
    .select('slug, updated_at, cities!inner(slug)')
    .eq('status', 'active' satisfies ListingStatus)
    .eq('cities.slug', citySlug)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(max);
  return (data ?? []).map((r: { slug: string; updated_at: string }) => ({
    slug: r.slug,
    updatedAt: r.updated_at,
  }));
}

export interface EditableListing {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  citySlug: string;
  neighborhoodSlug: string | null;
  priceCop: number;
  adminFeeCop: number | null;
  depositCop: number | null;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  floor: number | null;
  parking: number;
  isFurnished: boolean;
  amenities: string[];
  rules: string | null;
  lat: number | null;
  lng: number | null;
  estrato: number | null;
  antiguedad: number | null;
  status: ListingStatus;
  ownerId: string;
  ownerName: string | null;
  images: { id: string; url: string; altText: string | null; order: number }[];
}

export async function getEditableListing(id: string): Promise<EditableListing | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from('listings')
    .select(
      `id, owner_id, title, description, property_type, price_cop, admin_fee_cop, deposit_cop,
       bedrooms, bathrooms, area_m2, floor, parking, is_furnished, amenities, rules,
       lat, lng, estrato, antiguedad, status,
       cities!inner(slug),
       neighborhoods(slug),
       profiles!listings_owner_id_fkey(full_name),
       listing_images(id, r2_key, alt_text, display_order)`
    )
    .eq('id', id)
    .maybeSingle();
  if (!data) return null;
  type Row = {
    id: string; owner_id: string; title: string; description: string; property_type: PropertyType;
    price_cop: number; admin_fee_cop: number | null; deposit_cop: number | null;
    bedrooms: number; bathrooms: number; area_m2: number; floor: number | null;
    parking: number; is_furnished: boolean; amenities: string[] | null; rules: string | null;
    lat: number | null; lng: number | null; estrato: number | null; antiguedad: number | null; status: ListingStatus;
    cities: { slug: string } | { slug: string }[];
    neighborhoods: { slug: string } | { slug: string }[] | null;
    profiles: { full_name: string | null } | { full_name: string | null }[] | null;
    listing_images: Array<{ id: string; r2_key: string; alt_text: string | null; display_order: number }>;
  };
  const row = data as unknown as Row;
  const city = one(row.cities);
  const hood = one(row.neighborhoods);
  const ownerProfile = one(row.profiles);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    propertyType: row.property_type,
    citySlug: city?.slug ?? 'bogota',
    neighborhoodSlug: hood?.slug ?? null,
    priceCop: row.price_cop,
    adminFeeCop: row.admin_fee_cop,
    depositCop: row.deposit_cop,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaM2: row.area_m2,
    floor: row.floor,
    parking: row.parking ?? 0,
    isFurnished: row.is_furnished,
    amenities: row.amenities ?? [],
    rules: row.rules,
    estrato: row.estrato,
    antiguedad: row.antiguedad,
    lat: row.lat,
    lng: row.lng,
    status: row.status,
    ownerId: row.owner_id,
    ownerName: ownerProfile?.full_name ?? null,
    images: (row.listing_images ?? [])
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((i) => ({
        id: i.id,
        url: publicUrlFor(i.r2_key),
        altText: i.alt_text,
        order: i.display_order,
      })),
  };
}

export interface AdminListingRow {
  id: string;
  slug: string;
  title: string;
  priceCop: number;
  status: ListingStatus;
  citySlug: string;
  cityName: string;
  neighborhood: string | null;
  ownerId: string;
  ownerName: string | null;
  createdAt: string;
  publishedAt: string | null;
  thumbnailUrl: string | null;
}

export async function listListingsAdmin(opts: {
  status?: ListingStatus | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: AdminListingRow[]; total: number }> {
  const supabase = await getServerSupabase();
  if (!supabase) return { items: [], total: 0 };
  const limit = opts.limit ?? 30;
  const offset = opts.offset ?? 0;

  let q = supabase
    .from('listings')
    .select(
      `id, slug, title, price_cop, status, owner_id, created_at, published_at,
       cities!inner(slug, name),
       neighborhoods(name),
       listing_images(r2_key, display_order),
       profiles!listings_owner_id_fkey(full_name)`,
      { count: 'exact' }
    );

  if (opts.status && opts.status !== 'all') {
    q = q.eq('status', opts.status);
  }
  if (opts.search) {
    q = q.ilike('title', `%${opts.search}%`);
  }

  q = q
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count } = await q;
  type Row = {
    id: string; slug: string; title: string; price_cop: number; status: ListingStatus;
    owner_id: string; created_at: string; published_at: string | null;
    cities: { slug: string; name: string } | { slug: string; name: string }[];
    neighborhoods: { name: string } | { name: string }[] | null;
    listing_images: Array<{ r2_key: string; display_order: number }>;
    profiles: { full_name: string | null } | { full_name: string | null }[] | null;
  };
  const items: AdminListingRow[] = ((data ?? []) as unknown as Row[]).map((r) => {
    const city = one(r.cities);
    const hood = one(r.neighborhoods);
    const owner = one(r.profiles);
    const firstImg = (r.listing_images ?? [])
      .slice()
      .sort((a, b) => a.display_order - b.display_order)[0];
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      priceCop: r.price_cop,
      status: r.status,
      citySlug: city?.slug ?? 'bogota',
      cityName: city?.name ?? '',
      neighborhood: hood?.name ?? null,
      ownerId: r.owner_id,
      ownerName: owner?.full_name ?? null,
      createdAt: r.created_at,
      publishedAt: r.published_at,
      thumbnailUrl: firstImg ? publicUrlFor(firstImg.r2_key) : null,
    };
  });
  return { items, total: count ?? 0 };
}

export async function listListingsByOwner(ownerId: string): Promise<AdminListingRow[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('listings')
    .select(
      `id, slug, title, price_cop, status, owner_id, created_at, published_at,
       cities!inner(slug, name),
       neighborhoods(name),
       listing_images(r2_key, display_order)`
    )
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  type Row = {
    id: string; slug: string; title: string; price_cop: number; status: ListingStatus;
    owner_id: string; created_at: string; published_at: string | null;
    cities: { slug: string; name: string } | { slug: string; name: string }[];
    neighborhoods: { name: string } | { name: string }[] | null;
    listing_images: Array<{ r2_key: string; display_order: number }>;
  };
  return ((data ?? []) as unknown as Row[]).map((r) => {
    const city = one(r.cities);
    const hood = one(r.neighborhoods);
    const firstImg = (r.listing_images ?? []).slice().sort((a, b) => a.display_order - b.display_order)[0];
    return {
      id: r.id, slug: r.slug, title: r.title, priceCop: r.price_cop, status: r.status,
      citySlug: city?.slug ?? 'bogota', cityName: city?.name ?? '',
      neighborhood: hood?.name ?? null, ownerId: r.owner_id, ownerName: null,
      createdAt: r.created_at, publishedAt: r.published_at,
      thumbnailUrl: firstImg ? publicUrlFor(firstImg.r2_key) : null,
    };
  });
}

export async function getAdminStats(): Promise<{
  total: number;
  active: number;
  pendingReview: number;
  draft: number;
  archived: number;
  totalUsers: number;
  totalInquiries: number;
  newInquiries: number;
}> {
  const supabase = await getServerSupabase();
  if (!supabase) {
    return { total: 0, active: 0, pendingReview: 0, draft: 0, archived: 0, totalUsers: 0, totalInquiries: 0, newInquiries: 0 };
  }
  const listingStatus = async (s: ListingStatus | null) => {
    const base = supabase.from('listings').select('id', { count: 'exact', head: true });
    const q = s ? base.eq('status', s) : base;
    const { count } = await q;
    return count ?? 0;
  };
  const countProfiles = async () => {
    const { count } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    return count ?? 0;
  };
  const countInquiries = async (s: 'new' | null) => {
    const base = supabase.from('inquiries').select('id', { count: 'exact', head: true });
    const q = s ? base.eq('status', s) : base;
    const { count } = await q;
    return count ?? 0;
  };
  const [total, active, pendingReview, draft, archived, totalUsers, totalInquiries, newInquiries] = await Promise.all([
    listingStatus(null),
    listingStatus('active'),
    listingStatus('pending_review'),
    listingStatus('draft'),
    listingStatus('archived'),
    countProfiles(),
    countInquiries(null),
    countInquiries('new'),
  ]);
  return { total, active, pendingReview, draft, archived, totalUsers, totalInquiries, newInquiries };
}

async function _countActiveByCity(citySlug: string): Promise<number> {
  // Uses build client (no cookies) — safe inside unstable_cache. Count is public data.
  const supabase = getBuildSupabase();
  if (!supabase) return 0;
  const { count } = await supabase
    .from('listings')
    .select('id, cities!inner(slug)', { count: 'exact', head: true })
    .eq('status', 'active' satisfies ListingStatus)
    .eq('cities.slug', citySlug);
  return count ?? 0;
}

export function countActiveByCity(citySlug: string): Promise<number> {
  return unstable_cache(
    () => _countActiveByCity(citySlug),
    ['count-active', citySlug],
    { tags: ['listings', `city:${citySlug}`], revalidate: 300 },
  )();
}
