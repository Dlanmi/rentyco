import 'server-only';
import { getServerSupabase } from '@/lib/supabase/server';
import { listActiveListings } from './listings.repository';
import type { ListingCard } from '@/types/domain';

export async function getFavoriteListingIds(userId: string): Promise<Set<string>> {
  const supabase = await getServerSupabase();
  if (!supabase) return new Set();
  const { data } = await supabase
    .from('favorites')
    .select('listing_id')
    .eq('user_id', userId);
  return new Set((data ?? []).map((r: { listing_id: string }) => r.listing_id));
}

export async function listFavoriteListings(userId: string): Promise<ListingCard[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('favorites')
    .select('listing_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  const ids = (data ?? []).map((r: { listing_id: string }) => r.listing_id);
  if (!ids.length) return [];
  // Reuse the card mapper via repo by fetching each city's active entries is heavy;
  // query directly for cards by id filter.
  const { data: rows } = await supabase
    .from('listings')
    .select(`
      id, slug, title, price_cop, bedrooms, bathrooms, area_m2,
      property_type, is_furnished,
      cities!inner(slug),
      neighborhoods(slug, name),
      listing_images(id, r2_key, width, height, blurhash, alt_text, display_order)
    `)
    .in('id', ids);
  const byId = new Map<string, ListingCard>();
  // Use the same mapper shape as listings.repo – import cyclic avoided via inline map.
  const { publicUrlFor } = await import('@/lib/r2/client');
  (rows ?? []).forEach((r: unknown) => {
    const row = r as {
      id: string; slug: string; title: string; price_cop: number;
      bedrooms: number; bathrooms: number; area_m2: number;
      property_type: ListingCard['propertyType']; is_furnished: boolean;
      cities: { slug: string } | { slug: string }[];
      neighborhoods: { slug: string; name: string } | { slug: string; name: string }[] | null;
      listing_images: Array<{ id: string; r2_key: string; width: number; height: number; blurhash: string | null; alt_text: string | null; display_order: number }>;
    };
    const city = Array.isArray(row.cities) ? row.cities[0] : row.cities;
    const hood = Array.isArray(row.neighborhoods) ? row.neighborhoods?.[0] : row.neighborhoods;
    byId.set(row.id, {
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
      isFavorited: true,
      images: (row.listing_images ?? [])
        .slice()
        .sort((a, b) => a.display_order - b.display_order)
        .map((i) => ({
          id: i.id, url: publicUrlFor(i.r2_key), blurhash: i.blurhash,
          width: i.width, height: i.height, altText: i.alt_text, order: i.display_order,
        })),
    });
  });
  // preserve favorite creation order
  return ids.map((id) => byId.get(id)).filter(Boolean) as ListingCard[];
}
// silence unused lint
export { listActiveListings };
