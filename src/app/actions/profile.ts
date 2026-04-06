'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { err, ok, type Result } from '@/types/domain';

const CHOOSABLE_ROLES = ['tenant', 'landlord'] as const;

const SetRoleSchema = z.object({
  role: z.enum(CHOOSABLE_ROLES),
});

export async function setUserRole(input: unknown): Promise<Result<void>> {
  const parsed = SetRoleSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', 'Rol inválido');
  const current = await requireUser();
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  const { error } = await supabase
    .from('profiles')
    .update({ role: parsed.data.role })
    .eq('id', current.user.id);
  if (error) return err('UNKNOWN', error.message);

  revalidatePath('/cuenta');
  return ok(undefined);
}

const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).max(80).optional(),
  phone: z.string().max(30).optional().nullable(),
  avatarUrl: z.string().url().max(400).optional().nullable(),
});

export async function updateProfile(input: unknown): Promise<Result<void>> {
  const parsed = UpdateProfileSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', parsed.error.issues[0]?.message ?? 'Datos inválidos');
  const current = await requireUser();
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  const patch: Record<string, unknown> = {};
  if (parsed.data.fullName !== undefined) patch.full_name = parsed.data.fullName;
  if (parsed.data.phone !== undefined) patch.phone = parsed.data.phone;
  if (parsed.data.avatarUrl !== undefined) patch.avatar_url = parsed.data.avatarUrl;

  const { error } = await supabase.from('profiles').update(patch).eq('id', current.user.id);
  if (error) return err('UNKNOWN', error.message);

  revalidatePath('/cuenta/perfil');
  return ok(undefined);
}
