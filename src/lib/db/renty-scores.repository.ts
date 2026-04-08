import 'server-only';
import { getServerSupabase } from '@/lib/supabase/server';
import type { ScoreColor, Inconsistency } from '@/lib/renty-score/types';

export interface RentyScoreRow {
  id: string;
  created_at: string;
  nombre: string;
  cedula: string;
  tipo_usuario: 'inquilino' | 'arrendador';
  inmueble_busca: string | null;
  canon_mensual: number | null;
  ingreso_hogar: number | null;
  ratio_arriendo_ingreso: number | null;
  ocupantes: number | null;
  a1: string;
  a2: string;
  a3: string;
  b1: string;
  b2: string;
  b3: string;
  c1: string;
  c2: string;
  c3: string;
  d1: string;
  d2: string;
  d3: string;
  score_total: number;
  score_declared: number;
  trust_factor: number;
  score_a: number;
  score_b: number;
  score_c: number;
  score_d: number;
  penalizaciones: number;
  consistency_score: number;
  inconsistencies: Inconsistency[];
  verification_level: number;
  resultado: ScoreColor;
  user_id: string | null;
  algorithm_version: string;
}

/** Get the most recent score for a user. */
export async function getLatestScore(userId: string): Promise<RentyScoreRow | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from('renty_scores')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as RentyScoreRow | null;
}

/** Check if user already submitted a score in the last 24 hours. */
export async function hasScoreToday(userId: string): Promise<boolean> {
  const supabase = await getServerSupabase();
  if (!supabase) return false;
  const since = new Date(Date.now() - 86_400_000).toISOString();
  const { count } = await supabase
    .from('renty_scores')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', since);
  return (count ?? 0) > 0;
}

/** Check if user has any score at all. */
export async function hasAnyScore(userId: string): Promise<boolean> {
  const supabase = await getServerSupabase();
  if (!supabase) return false;
  const { count } = await supabase
    .from('renty_scores')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  return (count ?? 0) > 0;
}
