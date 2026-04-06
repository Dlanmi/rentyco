import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Build-time / static generation Supabase client.
 * Does NOT use cookies — safe to use in `generateStaticParams` and ISR revalidation.
 */
let _client: SupabaseClient | null = null;

export function getBuildSupabase(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  _client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
