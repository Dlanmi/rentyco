import 'server-only';
import { unstable_cache } from 'next/cache';
import { getBuildSupabase } from '@/lib/supabase/build';

/**
 * Live waitlist count from Supabase, cached 5 min.
 * Falls back to a floor so copy never says "0" during preview builds.
 */
const FLOOR = 98;

async function _count(): Promise<number> {
  const supabase = getBuildSupabase();
  if (!supabase) return FLOOR;
  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });
  return Math.max(FLOOR, count ?? FLOOR);
}

export const getWaitlistCount = unstable_cache(
  () => _count(),
  ['waitlist-count'],
  { tags: ['waitlist'], revalidate: 300 },
);
