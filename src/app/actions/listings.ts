'use server';

import { z } from 'zod';
import { revalidatePath, updateTag } from 'next/cache';
import { requireUser, requireOwner, requireAdmin, getCurrentUser } from '@/lib/auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { slugify } from '@/lib/slug';
import { err, ok, type Result, AMENITY_OPTIONS } from '@/types/domain';
import { logger } from '@/lib/logger';
import { deleteR2Object } from '@/lib/r2/presign';

const PROPERTY_TYPES = ['apartamento', 'casa', 'apartaestudio', 'habitacion', 'estudio'] as const;
const AMENITY_KEYS = AMENITY_OPTIONS.map((a) => a.value) as unknown as [string, ...string[]];
const IdSchema = z.string().uuid();

const ListingInputSchema = z.object({
  title:        z.string().min(8).max(140),
  description:  z.string().min(40).max(5000),
  propertyType: z.enum(PROPERTY_TYPES),
  citySlug:     z.string().min(1),
  neighborhoodSlug: z.string().optional().nullable(),
  priceCop:     z.number().int().min(200_000).max(100_000_000),
  adminFeeCop:  z.number().int().min(0).max(10_000_000).optional().nullable(),
  depositCop:   z.number().int().min(0).max(200_000_000).optional().nullable(),
  bedrooms:     z.number().int().min(0).max(20),
  bathrooms:    z.number().int().min(0).max(20),
  areaM2:       z.number().int().min(10).max(2000),
  floor:        z.number().int().min(-5).max(150).optional().nullable(),
  parking:      z.number().int().min(0).max(10).default(0),
  isFurnished:  z.boolean().default(false),
  acceptsRentyScore: z.boolean().default(false),
  amenities:    z.array(z.enum(AMENITY_KEYS)).default([]),
  rules:        z.string().max(2000).optional().nullable(),
  lat:          z.number().min(-90).max(90).optional().nullable(),
  lng:          z.number().min(-180).max(180).optional().nullable(),
  estrato:      z.number().int().min(1).max(6).optional().nullable(),
  antiguedad:   z.number().int().min(0).max(100).optional().nullable(),
  ownerId:      z.string().uuid().optional().nullable(),
});

export type ListingInput = z.infer<typeof ListingInputSchema>;

async function resolveCityAndHood(
  supabase: NonNullable<Awaited<ReturnType<typeof getServerSupabase>>>,
  citySlug: string,
  neighborhoodSlug?: string | null
): Promise<{ cityId: number; neighborhoodId: number | null } | null> {
  const { data: city } = await supabase.from('cities').select('id').eq('slug', citySlug).maybeSingle();
  if (!city) return null;
  let neighborhoodId: number | null = null;
  if (neighborhoodSlug) {
    const { data: hood } = await supabase
      .from('neighborhoods')
      .select('id')
      .eq('city_id', city.id)
      .eq('slug', neighborhoodSlug)
      .maybeSingle();
    neighborhoodId = hood?.id ?? null;
  }
  return { cityId: city.id, neighborhoodId };
}

async function uniqueSlug(
  supabase: NonNullable<Awaited<ReturnType<typeof getServerSupabase>>>,
  cityId: number,
  title: string
): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  for (let i = 0; i < 6; i++) {
    const { data } = await supabase
      .from('listings')
      .select('id')
      .eq('city_id', cityId)
      .eq('slug', candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function createListing(input: unknown): Promise<Result<{ id: string; slug: string }>> {
  const parsed = ListingInputSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', parsed.error.issues[0]?.message ?? 'Datos inválidos');
  const current = await requireUser();
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  // Admin can assign a listing to another landlord
  const isAdmin = current.profile.role === 'admin';
  const ownerId = (isAdmin && parsed.data.ownerId) ? parsed.data.ownerId : current.user.id;

  const loc = await resolveCityAndHood(supabase, parsed.data.citySlug, parsed.data.neighborhoodSlug ?? null);
  if (!loc) return err('VALIDATION', 'Ciudad inválida');

  const slug = await uniqueSlug(supabase, loc.cityId, parsed.data.title);

  const { data, error } = await supabase
    .from('listings')
    .insert({
      owner_id: ownerId,
      city_id: loc.cityId,
      neighborhood_id: loc.neighborhoodId,
      slug,
      title: parsed.data.title,
      description: parsed.data.description,
      property_type: parsed.data.propertyType,
      price_cop: parsed.data.priceCop,
      admin_fee_cop: parsed.data.adminFeeCop ?? null,
      deposit_cop: parsed.data.depositCop ?? null,
      bedrooms: parsed.data.bedrooms,
      bathrooms: parsed.data.bathrooms,
      area_m2: parsed.data.areaM2,
      floor: parsed.data.floor ?? null,
      parking: parsed.data.parking,
      is_furnished: parsed.data.isFurnished,
      accepts_renty_score: isAdmin ? parsed.data.acceptsRentyScore : false,
      amenities: parsed.data.amenities,
      rules: parsed.data.rules ?? null,
      lat: parsed.data.lat ?? null,
      lng: parsed.data.lng ?? null,
      estrato: parsed.data.estrato ?? null,
      antiguedad: parsed.data.antiguedad ?? null,
      status: 'draft',
    })
    .select('id, slug')
    .single();

  if (error || !data) {
    logger.error('createListing failed', { error });
    return err('UNKNOWN', 'No pudimos crear el arriendo');
  }
  revalidatePath('/admin/listings');
  revalidatePath('/cuenta/publicaciones');
  return ok({ id: data.id, slug: data.slug });
}

const UpdateSchema = ListingInputSchema.partial().extend({ id: z.string().uuid() });

export async function updateListing(input: unknown): Promise<Result<void>> {
  const parsed = UpdateSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', parsed.error.issues[0]?.message ?? 'Datos inválidos');
  const caller = await requireOwner(parsed.data.id);
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  const patch: Record<string, unknown> = {};
  const d = parsed.data;
  if (d.title !== undefined) patch.title = d.title;
  if (d.description !== undefined) patch.description = d.description;
  if (d.propertyType !== undefined) patch.property_type = d.propertyType;
  if (d.priceCop !== undefined) patch.price_cop = d.priceCop;
  if (d.adminFeeCop !== undefined) patch.admin_fee_cop = d.adminFeeCop;
  if (d.depositCop !== undefined) patch.deposit_cop = d.depositCop;
  if (d.bedrooms !== undefined) patch.bedrooms = d.bedrooms;
  if (d.bathrooms !== undefined) patch.bathrooms = d.bathrooms;
  if (d.areaM2 !== undefined) patch.area_m2 = d.areaM2;
  if (d.floor !== undefined) patch.floor = d.floor;
  if (d.parking !== undefined) patch.parking = d.parking;
  if (d.isFurnished !== undefined) patch.is_furnished = d.isFurnished;
  if (d.acceptsRentyScore !== undefined && caller.profile.role === 'admin') patch.accepts_renty_score = d.acceptsRentyScore;
  if (d.amenities !== undefined) patch.amenities = d.amenities;
  if (d.rules !== undefined) patch.rules = d.rules;
  if (d.lat !== undefined) patch.lat = d.lat;
  if (d.lng !== undefined) patch.lng = d.lng;
  if (d.estrato !== undefined) patch.estrato = d.estrato;
  if (d.antiguedad !== undefined) patch.antiguedad = d.antiguedad;

  if (d.neighborhoodSlug !== undefined || d.citySlug !== undefined) {
    // Need current city_id to resolve neighborhood
    const { data: row } = await supabase
      .from('listings')
      .select('city_id, cities!inner(slug)')
      .eq('id', d.id)
      .maybeSingle();
    const currentCitySlug = (row as { cities?: { slug?: string } | { slug?: string }[] } | null)?.cities;
    const cs = d.citySlug ?? (Array.isArray(currentCitySlug) ? currentCitySlug[0]?.slug : currentCitySlug?.slug) ?? 'bogota';
    const loc = await resolveCityAndHood(supabase, cs, d.neighborhoodSlug ?? null);
    if (!loc) return err('VALIDATION', 'Ciudad inválida');
    patch.city_id = loc.cityId;
    patch.neighborhood_id = loc.neighborhoodId;
  }

  const { error } = await supabase.from('listings').update(patch).eq('id', d.id);
  if (error) {
    logger.error('updateListing failed', { error });
    return err('UNKNOWN', 'No pudimos guardar los cambios');
  }

  revalidatePath('/admin/listings');
  revalidatePath('/cuenta/publicaciones');
  updateTag('listings');
  return ok(undefined);
}

export async function publishListing(id: string): Promise<Result<void>> {
  if (!IdSchema.safeParse(id).success) return err('VALIDATION', 'ID inválido');
  const current = await requireUser();
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  // Admin can go straight to active; owner → pending_review.
  const targetStatus = current.profile.role === 'admin' ? 'active' : 'pending_review';

  // Ownership check
  const { data: row } = await supabase.from('listings').select('owner_id').eq('id', id).maybeSingle();
  if (!row) return err('NOT_FOUND', 'Arriendo no encontrado');
  if (current.profile.role !== 'admin' && row.owner_id !== current.user.id) {
    return err('FORBIDDEN', 'No autorizado');
  }

  // Require at least one image
  const { count } = await supabase
    .from('listing_images')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', id);
  if ((count ?? 0) < 1) return err('VALIDATION', 'Agrega al menos una foto antes de publicar');

  const { error } = await supabase.from('listings').update({ status: targetStatus }).eq('id', id);
  if (error) return err('UNKNOWN', error.message);

  revalidatePath('/admin/listings');
  revalidatePath('/cuenta/publicaciones');
  updateTag('listings');
  return ok(undefined);
}

export async function archiveListing(id: string): Promise<Result<void>> {
  if (!IdSchema.safeParse(id).success) return err('VALIDATION', 'ID inválido');
  await requireOwner(id);
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');
  const { error } = await supabase.from('listings').update({ status: 'archived' }).eq('id', id);
  if (error) return err('UNKNOWN', error.message);
  revalidatePath('/admin/listings');
  revalidatePath('/cuenta/publicaciones');
  updateTag('listings');
  return ok(undefined);
}

export async function pauseListing(id: string): Promise<Result<void>> {
  if (!IdSchema.safeParse(id).success) return err('VALIDATION', 'ID inválido');
  await requireOwner(id);
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');
  const { error } = await supabase.from('listings').update({ status: 'paused' }).eq('id', id);
  if (error) return err('UNKNOWN', error.message);
  revalidatePath('/admin/listings');
  revalidatePath('/cuenta/publicaciones');
  updateTag('listings');
  return ok(undefined);
}

export async function deleteListing(id: string): Promise<Result<void>> {
  if (!IdSchema.safeParse(id).success) return err('VALIDATION', 'ID inválido');
  await requireAdmin();
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');
  const { error } = await supabase
    .from('listings')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null);
  if (error) return err('UNKNOWN', error.message);
  revalidatePath('/admin/listings');
  updateTag('listings');
  return ok(undefined);
}

const ReorderSchema = z.object({
  listingId: z.string().uuid(),
  order: z.array(z.string().uuid()).min(1).max(12),
});

export async function reorderImages(input: unknown): Promise<Result<void>> {
  const parsed = ReorderSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', 'Orden inválido');
  await requireOwner(parsed.data.listingId);
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  // Batch update all display_orders in parallel (N concurrent, 1 round-trip each)
  const results = await Promise.all(
    parsed.data.order.map((imageId, i) =>
      supabase
        .from('listing_images')
        .update({ display_order: i })
        .eq('id', imageId)
        .eq('listing_id', parsed.data.listingId)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return err('UNKNOWN', failed.error.message);

  revalidatePath('/admin/listings');
  updateTag('listings');
  return ok(undefined);
}

export async function deleteImage(imageId: string): Promise<Result<void>> {
  if (!IdSchema.safeParse(imageId).success) return err('VALIDATION', 'ID inválido');
  const current = await getCurrentUser();
  if (!current) return err('UNAUTHENTICATED', 'Inicia sesión');
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  // Ownership check via join — also fetch r2_key for R2 cleanup
  const { data: img } = await supabase
    .from('listing_images')
    .select('listing_id, r2_key, listings!inner(owner_id)')
    .eq('id', imageId)
    .maybeSingle();
  if (!img) return err('NOT_FOUND', 'Imagen no encontrada');
  const listings = (img as { listings: { owner_id: string } | { owner_id: string }[] }).listings;
  const ownerId = Array.isArray(listings) ? listings[0]?.owner_id : listings?.owner_id;
  if (current.profile.role !== 'admin' && ownerId !== current.user.id) {
    return err('FORBIDDEN', 'No autorizado');
  }

  const r2Key = (img as { r2_key: string }).r2_key;
  const { error } = await supabase.from('listing_images').delete().eq('id', imageId);
  if (error) return err('UNKNOWN', error.message);

  // Clean up R2 object (best-effort — don't fail if R2 is unavailable)
  if (r2Key) {
    try {
      await deleteR2Object({ key: r2Key });
    } catch (e) {
      logger.error('R2 delete failed (orphaned object)', { r2Key, error: e });
    }
  }

  revalidatePath('/admin/listings');
  updateTag('listings');
  return ok(undefined);
}

export async function updateListingOwner(
  listingId: string,
  newOwnerId: string
): Promise<Result<void>> {
  if (!IdSchema.safeParse(listingId).success || !IdSchema.safeParse(newOwnerId).success)
    return err('VALIDATION', 'ID inválido');
  await requireAdmin();
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Supabase no disponible');

  const { error } = await supabase
    .from('listings')
    .update({ owner_id: newOwnerId })
    .eq('id', listingId);
  if (error) return err('UNKNOWN', error.message);

  revalidatePath('/admin/listings');
  updateTag('listings');
  return ok(undefined);
}

const SearchQuerySchema = z.string().min(1).max(100);

export async function searchLandlords(query: string): Promise<Result<{ id: string; fullName: string | null; role: string }[]>> {
  if (!SearchQuerySchema.safeParse(query).success) return err('VALIDATION', 'Búsqueda inválida');
  await requireAdmin();
  const { searchProfiles } = await import('@/lib/db/profiles.repository');
  const results = await searchProfiles(query);
  return ok(results);
}
