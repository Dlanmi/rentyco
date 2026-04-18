'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { getSupabase } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { limit } from '@/lib/ratelimit';

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

async function getClientIp(): Promise<string> {
  const h = await headers();
  // Vercel sets x-forwarded-for; fall back to a stable default so the limiter
  // still meters *something* when behind a weird proxy.
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Server Action — validates input with Zod, rate-limits per-IP (5 req/min),
 * then inserts into Supabase. Returns { success: true } if Supabase is not
 * configured (preview / dev).
 */
export async function submitWaitlist(input: unknown): Promise<WaitlistResult> {
  const parsed = WaitlistSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message || 'Datos inválidos' };
  }

  // Rate limit per IP — 5 submits per minute is generous for humans, hard
  // wall for bots. Upstash no-ops if env vars missing.
  const ip = await getClientIp();
  const { success: allowed, retryAfter } = await limit(`waitlist:${ip}`, {
    requests: 5,
    window: '1 m',
  });
  if (!allowed) {
    return {
      success: false,
      error: `Demasiados intentos. Intenta de nuevo en ${retryAfter}s.`,
    };
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
