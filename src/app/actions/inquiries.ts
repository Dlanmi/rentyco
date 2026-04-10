'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { err, ok, type InquiryStatus, type Result } from '@/types/domain';
import { logger } from '@/lib/logger';

const CreateInquirySchema = z.object({
  listingId: z.string().uuid(),
  message: z.string().min(10, 'Mensaje muy corto').max(1000),
  contactPhone: z.string().max(30).optional(),
});

const INQUIRY_RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const INQUIRY_RATE_LIMIT = 5;

export async function createInquiry(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = CreateInquirySchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', parsed.error.issues[0]?.message ?? 'Datos inválidos');
  const current = await getCurrentUser();
  if (!current) return err('UNAUTHENTICATED', 'Inicia sesión para contactar al arrendador');
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  // F-04: per-user rate limit — max 5 inquiries per hour. Prevents harassment
  // and inbox flooding. Check before insert so we never burn a row on a reject.
  const windowStart = new Date(Date.now() - INQUIRY_RATE_WINDOW_MS).toISOString();
  const { count: recentCount } = await supabase
    .from('inquiries')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', current.user.id)
    .gte('created_at', windowStart);
  if ((recentCount ?? 0) >= INQUIRY_RATE_LIMIT) {
    return err('VALIDATION', 'Has enviado demasiados mensajes en la última hora. Intenta de nuevo más tarde.');
  }

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      listing_id: parsed.data.listingId,
      user_id: current.user.id,
      message: parsed.data.message,
      contact_phone: parsed.data.contactPhone ?? null,
    })
    .select('id')
    .single();
  if (error || !data) {
    logger.error('createInquiry failed', { error });
    return err('UNKNOWN', 'No pudimos enviar tu mensaje. Intenta de nuevo.');
  }
  revalidatePath('/cuenta/mensajes');
  return ok({ id: data.id });
}

const UpdateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'closed']),
});

export async function updateInquiryStatus(input: unknown): Promise<Result<void>> {
  const parsed = UpdateStatusSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', parsed.error.issues[0]?.message ?? 'Datos inválidos');
  const current = await getCurrentUser();
  if (!current) return err('UNAUTHENTICATED', 'No autenticado');
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  // Verify caller is the inquiry sender, the listing owner, or admin
  const { data: inquiry } = await supabase
    .from('inquiries')
    .select('user_id, listings!inner(owner_id)')
    .eq('id', parsed.data.id)
    .maybeSingle();
  if (!inquiry) return err('NOT_FOUND', 'Mensaje no encontrado');
  const listings = (inquiry as { user_id: string; listings: { owner_id: string } | { owner_id: string }[] }).listings;
  const ownerId = Array.isArray(listings) ? listings[0]?.owner_id : listings?.owner_id;
  const isAuthorized =
    current.user.id === inquiry.user_id ||
    current.user.id === ownerId ||
    current.profile.role === 'admin';
  if (!isAuthorized) return err('FORBIDDEN', 'No autorizado');

  const { error } = await supabase
    .from('inquiries')
    .update({ status: parsed.data.status as InquiryStatus })
    .eq('id', parsed.data.id);
  if (error) return err('UNKNOWN', error.message);
  revalidatePath('/cuenta/mensajes');
  return ok(undefined);
}
