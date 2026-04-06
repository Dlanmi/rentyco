'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Browser Supabase client — singleton. Reads cookies for SSR continuity.
 * Throws at runtime if env vars are missing (browser code always needs them).
 */
export function getBrowserSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY');
  }
  _client = createBrowserClient(url, anonKey);
  return _client;
}
