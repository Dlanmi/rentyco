import 'server-only';
import { unstable_cache } from 'next/cache';
import { getBuildSupabase } from '@/lib/supabase/build';
import type { City, Neighborhood } from '@/types/domain';

export async function listActiveCities(): Promise<City[]> {
  // Build-safe (used by sitemap at build time).
  const supabase = getBuildSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('cities')
    .select('id, slug, name, active')
    .eq('active', true)
    .order('display_order', { ascending: true });
  return (data ?? []) as City[];
}

async function _getCityBySlug(slug: string): Promise<City | null> {
  // Uses build client (no cookies) — safe inside unstable_cache. Cities are public data.
  const supabase = getBuildSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from('cities')
    .select('id, slug, name, active')
    .eq('slug', slug)
    .maybeSingle();
  return (data ?? null) as City | null;
}

/** Cached for 1 hour — cities change very rarely. */
export function getCityBySlug(slug: string): Promise<City | null> {
  return unstable_cache(
    () => _getCityBySlug(slug),
    ['city', slug],
    { tags: ['cities'], revalidate: 3600 },
  )();
}

async function _listNeighborhoodsByCity(cityId: number): Promise<Neighborhood[]> {
  // Uses build client (no cookies) — safe inside unstable_cache. Neighborhoods are public data.
  const supabase = getBuildSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('neighborhoods')
    .select('id, city_id, slug, name, lat, lng')
    .eq('city_id', cityId)
    .order('display_order', { ascending: true });
  return (data ?? []).map((n: { id: number; city_id: number; slug: string; name: string; lat: number | null; lng: number | null }) => ({
    id: n.id,
    cityId: n.city_id,
    slug: n.slug,
    name: n.name,
    lat: n.lat,
    lng: n.lng,
  }));
}

/** Cached for 1 hour — neighborhoods change very rarely. */
export function listNeighborhoodsByCity(cityId: number): Promise<Neighborhood[]> {
  return unstable_cache(
    () => _listNeighborhoodsByCity(cityId),
    ['neighborhoods', String(cityId)],
    { tags: ['cities'], revalidate: 3600 },
  )();
}
