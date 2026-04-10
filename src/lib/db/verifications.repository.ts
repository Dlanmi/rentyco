import 'server-only';
import { getServerSupabase } from '@/lib/supabase/server';

export type VerificationType =
  | 'identity'
  | 'income_proof'
  | 'landlord_reference'
  | 'credit_consent'
  | 'property_proof';

export type VerificationContext = 'tenant' | 'landlord';

export type VerificationDbStatus =
  | 'pending'
  | 'submitted'
  | 'uploaded'
  | 'contacted'
  | 'consented'
  | 'verified'
  | 'completed'
  | 'rejected';

export interface VerificationRow {
  id: string;
  user_id: string;
  score_id: string | null;
  type: VerificationType;
  context: VerificationContext;
  status: VerificationDbStatus;
  metadata: Record<string, unknown>;
  r2_key: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

/** All tenant-context verifications for a user, most recent first. */
export async function getTenantVerifications(userId: string): Promise<VerificationRow[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('score_verifications')
    .select('*')
    .eq('user_id', userId)
    .eq('context', 'tenant')
    .order('created_at', { ascending: false });
  return (data ?? []) as VerificationRow[];
}

/** Latest verification of a given type for a user. */
export async function getVerification(
  userId: string,
  type: VerificationType,
): Promise<VerificationRow | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from('score_verifications')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as VerificationRow) ?? null;
}

/** Admin: all pending/submitted/uploaded verifications for review. */
export async function getVerificationQueue(): Promise<
  (VerificationRow & { user_name: string | null; user_cedula: string | null; user_score: number | null })[]
> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('score_verifications')
    .select('*, renty_scores!score_verifications_score_id_fkey(nombre, cedula, score_total)')
    .in('status', ['submitted', 'uploaded', 'contacted', 'consented'])
    .order('created_at', { ascending: true });

  type Row = VerificationRow & {
    renty_scores: { nombre: string; cedula: string; score_total: number } | { nombre: string; cedula: string; score_total: number }[] | null;
  };

  return ((data ?? []) as Row[]).map((r) => {
    const score = Array.isArray(r.renty_scores) ? r.renty_scores[0] : r.renty_scores;
    return {
      ...r,
      renty_scores: undefined as never,
      user_name: score?.nombre ?? null,
      user_cedula: score?.cedula ?? null,
      user_score: score?.score_total ?? null,
    };
  });
}

/** Count pending verifications (for admin sidebar badge). */
export async function getVerificationQueueCount(): Promise<number> {
  const supabase = await getServerSupabase();
  if (!supabase) return 0;
  const { count } = await supabase
    .from('score_verifications')
    .select('*', { count: 'exact', head: true })
    .in('status', ['submitted', 'uploaded', 'contacted', 'consented']);
  return count ?? 0;
}

/** Admin: reviewed verifications (history). */
export async function getReviewedVerifications(): Promise<
  (VerificationRow & { user_name: string | null; user_cedula: string | null; user_score: number | null })[]
> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('score_verifications')
    .select('*, renty_scores!score_verifications_score_id_fkey(nombre, cedula, score_total)')
    .in('status', ['verified', 'completed', 'rejected'])
    .order('reviewed_at', { ascending: false })
    .limit(50);

  type Row = VerificationRow & {
    renty_scores: { nombre: string; cedula: string; score_total: number } | { nombre: string; cedula: string; score_total: number }[] | null;
  };

  return ((data ?? []) as Row[]).map((r) => {
    const score = Array.isArray(r.renty_scores) ? r.renty_scores[0] : r.renty_scores;
    return {
      ...r,
      renty_scores: undefined as never,
      user_name: score?.nombre ?? null,
      user_cedula: score?.cedula ?? null,
      user_score: score?.score_total ?? null,
    };
  });
}

/** Get completed/verified verification types for a user (for trust factor mapping). */
export async function getVerifiedTypesForUser(userId: string): Promise<Set<VerificationType>> {
  const supabase = await getServerSupabase();
  if (!supabase) return new Set();
  const { data } = await supabase
    .from('score_verifications')
    .select('type')
    .eq('user_id', userId)
    .eq('context', 'tenant')
    .in('status', ['verified', 'completed']);
  return new Set((data ?? []).map((r: { type: string }) => r.type as VerificationType));
}

/** All landlord verifications for a user. */
export async function getLandlordVerifications(userId: string): Promise<VerificationRow[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('score_verifications')
    .select('*')
    .eq('user_id', userId)
    .eq('context', 'landlord')
    .order('created_at', { ascending: false });
  return (data ?? []) as VerificationRow[];
}

/** Check if a landlord has both required verifications approved. */
export async function isLandlordFullyVerified(userId: string): Promise<boolean> {
  const supabase = await getServerSupabase();
  if (!supabase) return false;
  const { data } = await supabase
    .from('score_verifications')
    .select('type')
    .eq('user_id', userId)
    .eq('context', 'landlord')
    .in('type', ['identity', 'property_proof'])
    .in('status', ['verified', 'completed']);
  const types = new Set((data ?? []).map((r: { type: string }) => r.type));
  return types.has('identity') && types.has('property_proof');
}
