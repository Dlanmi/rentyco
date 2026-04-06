'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { err, ok, type Result } from '@/types/domain';

const ListingIdSchema = z.string().uuid();

export async function toggleFavorite(
  listingId: string
): Promise<Result<{ favorited: boolean }>> {
  const parsed = ListingIdSchema.safeParse(listingId);
  if (!parsed.success) return err('VALIDATION', 'ID inválido');
  const current = await getCurrentUser();
  if (!current) return err('UNAUTHENTICATED', 'Debes iniciar sesión para guardar favoritos');
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  // Try delete first — if a row was removed, it was unfavorited (1 query).
  // If nothing deleted, insert (2 queries worst-case, but saves the common "already faved" path).
  const { count: deleted } = await supabase
    .from('favorites')
    .delete({ count: 'exact' })
    .eq('user_id', current.user.id)
    .eq('listing_id', listingId);

  if (deleted && deleted > 0) {
    revalidatePath('/cuenta/favoritos');
    return ok({ favorited: false });
  }

  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: current.user.id, listing_id: listingId });
  if (error) return err('UNKNOWN', error.message);
  revalidatePath('/cuenta/favoritos');
  return ok({ favorited: true });
}
