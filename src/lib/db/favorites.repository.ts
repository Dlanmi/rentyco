import 'server-only';
import { getServerSupabase } from '@/lib/supabase/server';
import { publicUrlFor } from '@/lib/r2/client';
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

/** Single joined query: favorites → listings (preserves favorite creation order). */
export async function listFavoriteListings(userId: string): Promise<ListingCard[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('favorites')
    .select(`
      listing_id,
      listings!inner(
        id, slug, title, price_cop, bedrooms, bathrooms, area_m2,
        property_type, is_furnished, accepts_renty_score,
        cities!inner(slug),
        neighborhoods(slug, name),
        listing_images(id, r2_key, width, height, blurhash, alt_text, display_order)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (!data?.length) return [];

  return data.map((fav) => {
    const nested = fav.listings;
    const row = (Array.isArray(nested) ? nested[0] : nested) as {
      id: string; slug: string; title: string; price_cop: number;
      bedrooms: number; bathrooms: number; area_m2: number;
      property_type: ListingCard['propertyType']; is_furnished: boolean; accepts_renty_score: boolean;
      cities: { slug: string } | { slug: string }[];
      neighborhoods: { slug: string; name: string } | { slug: string; name: string }[] | null;
      listing_images: Array<{ id: string; r2_key: string; width: number; height: number; blurhash: string | null; alt_text: string | null; display_order: number }>;
    };
    const city = Array.isArray(row.cities) ? row.cities[0] : row.cities;
    const hood = Array.isArray(row.neighborhoods) ? row.neighborhoods?.[0] : row.neighborhoods;
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
      acceptsRentyScore: row.accepts_renty_score,
      isFavorited: true,
      images: (row.listing_images ?? [])
        .slice()
        .sort((a, b) => a.display_order - b.display_order)
        .map((i) => ({
          id: i.id, url: publicUrlFor(i.r2_key), blurhash: i.blurhash,
          width: i.width, height: i.height, altText: i.alt_text, order: i.display_order,
        })),
    } satisfies ListingCard;
  });
}
