import 'server-only';
import { getServerSupabase } from '@/lib/supabase/server';
import type { UserRole } from '@/types/domain';

export interface PublicProfile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  verified: boolean;
  role: UserRole;
}

export interface ProfileOption {
  id: string;
  fullName: string | null;
  role: UserRole;
}

/** Search profiles by name — for admin owner selector. */
export async function searchProfiles(query: string, limit = 20): Promise<ProfileOption[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .or('role.eq.landlord,role.eq.admin')
    .ilike('full_name', `%${query}%`)
    .order('full_name', { ascending: true })
    .limit(limit);
  return (data ?? []).map((p: { id: string; full_name: string | null; role: UserRole }) => ({
    id: p.id,
    fullName: p.full_name,
    role: p.role,
  }));
}

export async function getProfile(id: string): Promise<PublicProfile | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, verified, role')
    .eq('id', id)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    fullName: data.full_name,
    avatarUrl: data.avatar_url,
    verified: data.verified,
    role: data.role,
  };
}
