'use server';

import { z } from 'zod';
import { getSupabase, getServerSupabase } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { getCurrentUser } from '@/lib/auth';
import { ALL_QUESTION_IDS } from '@/lib/renty-score/questions';
import { hasScoreToday } from '@/lib/db/renty-scores.repository';

const answerKeys = Object.fromEntries(
  ALL_QUESTION_IDS.map((id) => [id, z.string().min(1)])
);

const CEDULA_REGEX = /^\d{6,10}$/;

const InconsistencySchema = z.object({
  rule: z.string(),
  severity: z.enum(['alta', 'media', 'baja']),
  deduction: z.number(),
  explanation: z.string(),
});

const RentyScoreSchema = z.object({
  nombre: z.string().min(2, 'Nombre muy corto').max(100),
  cedula: z.string().regex(CEDULA_REGEX, 'La cédula debe tener entre 6 y 10 dígitos'),
  tipoUsuario: z.enum(['inquilino', 'arrendador']),
  inmuebleBusca: z.string().max(200).optional(),
  canonMensual: z.number().int().positive().nullable(),
  ingresoHogar: z.number().int().positive().nullable(),
  ocupantes: z.number().int().min(1).max(10).nullable(),
  recalcular: z.boolean().optional(),
  answers: z.object(answerKeys),
  score: z.object({
    total: z.number().int(),
    scoreDeclared: z.number().int(),
    trustFactor: z.number(),
    scoreA: z.number().int(),
    scoreB: z.number().int(),
    scoreC: z.number().int(),
    scoreD: z.number().int(),
    penalties: z.number().int(),
    consistencyScore: z.number().int(),
    inconsistencies: z.array(InconsistencySchema),
    color: z.enum(['verde', 'amarillo', 'naranja', 'rojo']),
  }),
});

export type RentyScoreInput = z.infer<typeof RentyScoreSchema>;

export interface RentyScoreResult {
  success: boolean;
  error?: string;
}

export async function submitRentyScore(input: unknown): Promise<RentyScoreResult> {
  const parsed = RentyScoreSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message || 'Datos inválidos' };
  }

  const { nombre, cedula, tipoUsuario, inmuebleBusca, canonMensual, ingresoHogar, ocupantes, answers, score } = parsed.data;

  const ratio = canonMensual && ingresoHogar ? canonMensual / ingresoHogar : null;

  // Use authenticated client if logged in, anon otherwise
  const current = await getCurrentUser();
  const supabase = current ? await getServerSupabase() : getSupabase();
  if (!supabase) {
    logger.error('Renty Score: no Supabase client available');
    return { success: false, error: 'Error de configuración. Intenta de nuevo.' };
  }

  const userId = current?.user.id ?? null;

  // Rate limit: 1 score per authenticated user per day (skip for recalculations)
  if (userId && !parsed.data.recalcular) {
    const alreadyToday = await hasScoreToday(userId);
    if (alreadyToday) {
      return { success: false, error: 'Ya calculaste tu score hoy. Puedes volver a intentarlo mañana.' };
    }
  }

  const { error } = await supabase.from('renty_scores').insert({
    nombre,
    cedula,
    tipo_usuario: tipoUsuario,
    inmueble_busca: inmuebleBusca || null,
    canon_mensual: canonMensual,
    ingreso_hogar: ingresoHogar,
    ratio_arriendo_ingreso: ratio ? Number(ratio.toFixed(4)) : null,
    ocupantes: ocupantes ?? null,
    ...answers,
    score_total: score.total,
    score_declared: score.scoreDeclared,
    trust_factor: score.trustFactor,
    score_a: score.scoreA,
    score_b: score.scoreB,
    score_c: score.scoreC,
    score_d: score.scoreD,
    penalizaciones: score.penalties,
    consistency_score: score.consistencyScore,
    inconsistencies: score.inconsistencies,
    resultado: score.color,
    algorithm_version: '2.0',
    user_id: userId,
  });

  if (error) {
    logger.error('Renty Score insert failed', { error, userId });
    return { success: false, error: 'Hubo un error guardando tu score. Intenta de nuevo.' };
  }

  return { success: true };
}
