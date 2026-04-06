'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/site';
import { err, ok, type Result } from '@/types/domain';
import { logger } from '@/lib/logger';

const EmailSchema = z.object({
  email: z.string().email('Email inválido').max(200),
  next: z.string().optional(),
});

export async function signInWithEmail(
  input: unknown
): Promise<Result<{ sent: true }>> {
  const parsed = EmailSchema.safeParse(input);
  if (!parsed.success) {
    return err('VALIDATION', parsed.error.issues[0]?.message ?? 'Datos inválidos');
  }
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no configurado');

  const redirectTo = `${SITE_URL}/auth/callback${
    parsed.data.next ? `?next=${encodeURIComponent(parsed.data.next)}` : ''
  }`;

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
  });

  if (error) {
    logger.error('signInWithOtp failed', { error });
    return err('UNKNOWN', 'No pudimos enviar el enlace. Intenta de nuevo.');
  }
  return ok({ sent: true });
}

export async function signInWithGoogle(next?: string): Promise<void> {
  const supabase = await getServerSupabase();
  if (!supabase) return;
  const redirectTo = `${SITE_URL}/auth/callback${
    next ? `?next=${encodeURIComponent(next)}` : ''
  }`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      scopes: 'openid email profile',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  if (error || !data.url) {
    logger.error('OAuth init failed', { error });
    return;
  }
  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = await getServerSupabase();
  if (supabase) await supabase.auth.signOut();
  redirect('/');
}
