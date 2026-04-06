'use server';

import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { revalidatePath, updateTag } from 'next/cache';
import { requireOwner } from '@/lib/auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { getPresignedPutUrl, getPresignedGetUrl } from '@/lib/r2/presign';
import {
  listingImageKey,
  extFromFilename,
  extFromContentType,
  isValidListingImageKey,
  MAX_IMAGE_BYTES,
  ALLOWED_IMAGE_TYPES,
} from '@/lib/r2/keys';
import { extractMetadata } from '@/lib/r2/processing';
import { err, ok, type Result } from '@/types/domain';
import { logger } from '@/lib/logger';

const MAX_IMAGES_PER_LISTING = 12;

const RequestUploadSchema = z.object({
  listingId: z.string().uuid(),
  filename: z.string().min(1).max(200),
  contentType: z.enum(ALLOWED_IMAGE_TYPES),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES),
});

export async function requestUploadUrl(
  input: unknown
): Promise<Result<{ uploadUrl: string; r2Key: string; expiresAt: string }>> {
  const parsed = RequestUploadSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', parsed.error.issues[0]?.message ?? 'Datos inválidos');

  await requireOwner(parsed.data.listingId);
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  // Enforce 12-image limit
  const { count } = await supabase
    .from('listing_images')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', parsed.data.listingId);
  if ((count ?? 0) >= MAX_IMAGES_PER_LISTING) {
    return err('LIMIT_EXCEEDED', `Máximo ${MAX_IMAGES_PER_LISTING} imágenes por arriendo`);
  }

  const ext =
    extFromFilename(parsed.data.filename) ??
    extFromContentType(parsed.data.contentType);
  if (!ext) return err('VALIDATION', 'Formato de imagen no soportado');

  const key = listingImageKey(parsed.data.listingId, randomUUID(), ext);
  const uploadUrl = await getPresignedPutUrl({
    key,
    contentType: parsed.data.contentType,
    contentLength: parsed.data.size,
  });
  if (!uploadUrl) return err('UNKNOWN', 'R2 no disponible');

  return ok({
    uploadUrl,
    r2Key: key,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });
}

const ConfirmUploadSchema = z.object({
  listingId: z.string().uuid(),
  r2Key: z.string().min(1).max(300),
  altText: z.string().max(200).optional(),
});

export async function confirmUpload(
  input: unknown
): Promise<Result<{ imageId: string; width: number; height: number; blurhash: string }>> {
  const parsed = ConfirmUploadSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', parsed.error.issues[0]?.message ?? 'Datos inválidos');

  await requireOwner(parsed.data.listingId);
  if (!isValidListingImageKey(parsed.data.r2Key, parsed.data.listingId)) {
    return err('VALIDATION', 'Key inválida');
  }

  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  // Determine next display_order
  const { data: existing } = await supabase
    .from('listing_images')
    .select('display_order')
    .eq('listing_id', parsed.data.listingId)
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = existing ? (existing.display_order as number) + 1 : 0;

  // Fetch the uploaded object via presigned GET to process server-side
  const getUrl = await getPresignedGetUrl({ key: parsed.data.r2Key });
  if (!getUrl) return err('UNKNOWN', 'R2 no disponible');

  let width = 0, height = 0, blurhash = '';
  try {
    const res = await fetch(getUrl);
    if (!res.ok) return err('NOT_FOUND', 'No encontramos la imagen subida');
    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await extractMetadata(buf);
    width = meta.width;
    height = meta.height;
    blurhash = meta.blurhash;
  } catch (e) {
    logger.error('confirmUpload processing failed', { error: e });
    const msg = e instanceof Error ? e.message : '';
    if (msg.includes('Formato') || msg.includes('dimensiones') || msg.includes('excede')) {
      return err('VALIDATION', msg);
    }
    return err('UNKNOWN', 'No pudimos procesar la imagen. Verifica que sea un archivo válido (JPG, PNG o WebP).');
  }

  const { data, error } = await supabase
    .from('listing_images')
    .insert({
      listing_id: parsed.data.listingId,
      r2_key: parsed.data.r2Key,
      width,
      height,
      blurhash,
      alt_text: parsed.data.altText ?? null,
      display_order: nextOrder,
    })
    .select('id')
    .single();
  if (error || !data) {
    logger.error('confirmUpload insert failed', { error });
    return err('UNKNOWN', 'No pudimos guardar la imagen');
  }

  revalidatePath('/admin/listings');
  updateTag('listings');
  return ok({ imageId: data.id, width, height, blurhash });
}
