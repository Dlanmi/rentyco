import { cache } from 'react';
import { redirect, notFound } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { getServerSupabase } from '@/lib/supabase/server';

export interface AuthedProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: 'tenant' | 'landlord' | 'admin';
  verified: boolean;
  renty_score: number | null;
  renty_score_color: 'verde' | 'amarillo' | 'naranja' | 'rojo' | null;
  renty_score_date: string | null;
}

export interface AuthedUser {
  user: User;
  profile: AuthedProfile;
}

/** Returns current user + profile, or null when not authed / not configured.
 *  Wrapped with React cache() — deduplicated within a single server request. */
export const getCurrentUser = cache(async (): Promise<AuthedUser | null> => {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, phone, role, verified, renty_score, renty_score_color, renty_score_date')
    .eq('id', user.id)
    .maybeSingle();

  // Profile may not yet exist if trigger hasn't fired; default to tenant.
  const resolved: AuthedProfile = profile ?? {
    id: user.id,
    full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
    phone: null,
    role: 'tenant',
    verified: false,
    renty_score: null,
    renty_score_color: null,
    renty_score_date: null,
  };

  return { user, profile: resolved };
});

/** Redirects to /entrar if user is not signed in. */
export async function requireUser(nextPath?: string): Promise<AuthedUser> {
  const current = await getCurrentUser();
  if (!current) {
    const qs = nextPath ? `?next=${encodeURIComponent(nextPath)}` : '';
    redirect(`/entrar${qs}`);
  }
  return current;
}

/** 404 if user is not admin (do not leak existence of admin surface). */
export async function requireAdmin(): Promise<AuthedUser> {
  const current = await getCurrentUser();
  if (!current || current.profile.role !== 'admin') {
    notFound();
  }
  return current;
}

/** Sanitize a redirect path to prevent open redirects. */
export function sanitizeRedirectPath(path: string | null | undefined): string {
  if (!path || typeof path !== 'string') return '/cuenta';
  // Must start with exactly one slash, not protocol-relative //
  if (!path.startsWith('/') || path.startsWith('//')) return '/cuenta';
  // Strip any authority that could be hiding (e.g., /\evil.com)
  try {
    const url = new URL(path, 'http://localhost');
    if (url.hostname !== 'localhost') return '/cuenta';
  } catch {
    return '/cuenta';
  }
  return path;
}

/** Ensures current user owns the listing (or is admin). Otherwise 404. */
export async function requireOwner(listingId: string): Promise<AuthedUser> {
  const current = await requireUser();
  if (current.profile.role === 'admin') return current;
  const supabase = await getServerSupabase();
  if (!supabase) notFound();
  const { data } = await supabase
    .from('listings')
    .select('owner_id')
    .eq('id', listingId)
    .is('deleted_at', null)
    .maybeSingle();
  if (!data || data.owner_id !== current.user.id) notFound();
  return current;
}
