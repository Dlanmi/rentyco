'use server';

import { z } from 'zod';
import { getSupabase } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

const WaitlistSchema = z.object({
  tipo: z.enum(['inquilino', 'arrendador']),
  nombre: z.string().min(2, 'Nombre muy corto').max(100),
  email: z.string().email('Email inválido').max(200),
  ciudad: z.string().min(2).max(50),
  arrienda_actualmente: z.boolean().optional(),
  num_propiedades: z.enum(['1', '2-5', '6+']).optional(),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  referrer: z.string().max(500).optional(),
});

export type WaitlistInput = z.infer<typeof WaitlistSchema>;
export interface WaitlistResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action — validates input with Zod, then inserts into Supabase.
 * Runs server-side so we never ship the anon key usage to the browser.
 * Returns { success: true } if Supabase is not configured (preview / dev).
 */
export async function submitWaitlist(input: unknown): Promise<WaitlistResult> {
  const parsed = WaitlistSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message || 'Datos inválidos' };
  }

  const supabase = getSupabase();
  if (!supabase) {
    // Graceful degradation: pretend success in dev/preview without env vars.
    return { success: true };
  }

  const { error } = await supabase.from('waitlist').insert(parsed.data);

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Este email ya está en la lista de espera.' };
    }
    logger.error('Waitlist insert failed', { error });
    return { success: false, error: 'Hubo un error. Intenta de nuevo.' };
  }

  return { success: true };
}
