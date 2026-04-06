'use server';

import { z } from 'zod';
import { getSupabase, getServerSupabase } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { getCurrentUser } from '@/lib/auth';
import { ALL_QUESTION_IDS } from '@/lib/renty-score/questions';

const answerKeys = Object.fromEntries(
  ALL_QUESTION_IDS.map((id) => [id, z.string().min(1)])
);

const RentyScoreSchema = z.object({
  nombre: z.string().min(2, 'Nombre muy corto').max(100),
  cedula: z.string().min(5, 'Cédula muy corta').max(20),
  tipoUsuario: z.enum(['inquilino', 'arrendador']),
  inmuebleBusca: z.string().max(200).optional(),
  canonMensual: z.number().int().positive().nullable(),
  ingresoHogar: z.number().int().positive().nullable(),
  answers: z.object(answerKeys),
  score: z.object({
    total: z.number().int(),
    scoreA: z.number().int(),
    scoreB: z.number().int(),
    scoreC: z.number().int(),
    scoreD: z.number().int(),
    penalties: z.number().int(),
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

  const { nombre, cedula, tipoUsuario, inmuebleBusca, canonMensual, ingresoHogar, answers, score } = parsed.data;

  const ratio = canonMensual && ingresoHogar ? canonMensual / ingresoHogar : null;

  // Use authenticated client if logged in, anon otherwise
  const current = await getCurrentUser();
  const supabase = current ? await getServerSupabase() : getSupabase();
  if (!supabase) {
    logger.error('Renty Score: no Supabase client available');
    return { success: false, error: 'Error de configuración. Intenta de nuevo.' };
  }

  const userId = current?.user.id ?? null;

  const { error } = await supabase.from('renty_scores').insert({
    nombre,
    cedula,
    tipo_usuario: tipoUsuario,
    inmueble_busca: inmuebleBusca || null,
    canon_mensual: canonMensual,
    ingreso_hogar: ingresoHogar,
    ratio_arriendo_ingreso: ratio ? Number(ratio.toFixed(4)) : null,
    ...answers,
    score_total: score.total,
    score_a: score.scoreA,
    score_b: score.scoreB,
    score_c: score.scoreC,
    score_d: score.scoreD,
    penalizaciones: score.penalties,
    resultado: score.color,
    user_id: userId,
  });

  if (error) {
    logger.error('Renty Score insert failed', { error, userId });
    return { success: false, error: 'Hubo un error guardando tu score. Intenta de nuevo.' };
  }

  return { success: true };
}
