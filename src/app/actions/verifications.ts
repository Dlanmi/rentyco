'use server';

import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { getPresignedPutUrl } from '@/lib/r2/presign';
import { verificationDocKey, extFromDocFilename, isValidVerificationKey, MAX_DOC_BYTES, ALLOWED_DOC_TYPES } from '@/lib/r2/keys';
import { getLatestScore } from '@/lib/db/renty-scores.repository';
import { getVerifiedTypesForUser } from '@/lib/db/verifications.repository';
import { calculateTrustFactor } from '@/lib/renty-score/trust-factor';
import type { VerificationStatus, VerificationKey } from '@/lib/renty-score/types';
import { err, ok, type Result } from '@/types/domain';
import { logger } from '@/lib/logger';

// ── Mapping: DB verification type → trust factor key ──────────────────

const TYPE_TO_TRUST_KEY: Record<string, VerificationKey> = {
  identity: 'identity',
  income_proof: 'bank_statement',
  landlord_reference: 'landlord_reference',
  credit_consent: 'employment_proof',
};

function buildVerificationStatus(verifiedTypes: Set<string>): VerificationStatus {
  return {
    bank_statement: verifiedTypes.has('income_proof') ? 1 : 0,
    landlord_reference: verifiedTypes.has('landlord_reference') ? 1 : 0,
    identity: verifiedTypes.has('identity') ? 1 : 0,
    employment_proof: verifiedTypes.has('credit_consent') ? 1 : 0,
  };
}

// ── Request document upload URL ──────────────────────────────────────

const RequestDocUploadSchema = z.object({
  type: z.enum(['identity', 'income_proof']),
  filename: z.string().min(1).max(200),
  contentType: z.enum(ALLOWED_DOC_TYPES),
  size: z.number().int().positive().max(MAX_DOC_BYTES),
});

export async function requestVerificationUploadUrl(
  input: unknown
): Promise<Result<{ uploadUrl: string; r2Key: string }>> {
  const parsed = RequestDocUploadSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', parsed.error.issues[0]?.message ?? 'Datos inválidos');

  const current = await getCurrentUser();
  if (!current) return err('UNAUTHENTICATED', 'Debes iniciar sesión');

  const userId = current.user.id;
  const ext = extFromDocFilename(parsed.data.filename);
  if (!ext) return err('VALIDATION', 'Tipo de archivo no permitido. Usa JPG, PNG, WebP o PDF.');

  const r2Key = verificationDocKey(userId, parsed.data.type, randomUUID(), ext);
  const uploadUrl = await getPresignedPutUrl({
    key: r2Key,
    contentType: parsed.data.contentType,
    contentLength: parsed.data.size,
    bucket: 'verifications',
  });
  if (!uploadUrl) return err('UNKNOWN', 'No se pudo generar la URL de subida');

  return ok({ uploadUrl, r2Key });
}

// ── Submit document verification ─────────────────────────────────────

const SubmitDocSchema = z.object({
  type: z.enum(['identity', 'income_proof']),
  r2Key: z.string().min(1),
});

export async function submitDocumentVerification(
  input: unknown
): Promise<Result<{ id: string }>> {
  const parsed = SubmitDocSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', 'Datos inválidos');

  const current = await getCurrentUser();
  if (!current) return err('UNAUTHENTICATED', 'Debes iniciar sesión');

  const userId = current.user.id;
  if (!isValidVerificationKey(parsed.data.r2Key, userId)) {
    return err('VALIDATION', 'Clave de archivo inválida');
  }

  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Error de configuración');

  const score = await getLatestScore(userId);
  if (!score) return err('VALIDATION', 'Primero debes calcular tu Renty Score');

  const { data, error } = await supabase
    .from('score_verifications')
    .upsert(
      {
        user_id: userId,
        score_id: score.id,
        type: parsed.data.type,
        status: 'uploaded',
        r2_key: parsed.data.r2Key,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,score_id,type' }
    )
    .select('id')
    .single();

  if (error) {
    logger.error('Failed to submit document verification', { error, userId });
    return err('UNKNOWN', 'Error guardando la verificación');
  }

  revalidatePath('/cuenta/mi-score');
  return ok({ id: data.id });
}

// ── Submit landlord reference ────────────────────────────────────────

const LandlordRefSchema = z.object({
  landlordName: z.string().min(2, 'Nombre requerido').max(100),
  landlordPhone: z.string().min(7, 'Teléfono requerido').max(15),
  previousAddress: z.string().min(5, 'Dirección requerida').max(200),
});

export async function submitLandlordReference(
  input: unknown
): Promise<Result<{ id: string }>> {
  const parsed = LandlordRefSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', parsed.error.issues[0]?.message ?? 'Datos inválidos');

  const current = await getCurrentUser();
  if (!current) return err('UNAUTHENTICATED', 'Debes iniciar sesión');

  const userId = current.user.id;
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Error de configuración');

  const score = await getLatestScore(userId);
  if (!score) return err('VALIDATION', 'Primero debes calcular tu Renty Score');

  const { data, error } = await supabase
    .from('score_verifications')
    .upsert(
      {
        user_id: userId,
        score_id: score.id,
        type: 'landlord_reference',
        status: 'submitted',
        metadata: {
          landlord_name: parsed.data.landlordName,
          landlord_phone: parsed.data.landlordPhone,
          previous_address: parsed.data.previousAddress,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,score_id,type' }
    )
    .select('id')
    .single();

  if (error) {
    logger.error('Failed to submit landlord reference', { error, userId });
    return err('UNKNOWN', 'Error guardando la referencia');
  }

  revalidatePath('/cuenta/mi-score');
  return ok({ id: data.id });
}

// ── Submit credit consent ────────────────────────────────────────────

export async function submitCreditConsent(): Promise<Result<{ id: string }>> {
  const current = await getCurrentUser();
  if (!current) return err('UNAUTHENTICATED', 'Debes iniciar sesión');

  const userId = current.user.id;
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Error de configuración');

  const score = await getLatestScore(userId);
  if (!score) return err('VALIDATION', 'Primero debes calcular tu Renty Score');

  const { data, error } = await supabase
    .from('score_verifications')
    .upsert(
      {
        user_id: userId,
        score_id: score.id,
        type: 'credit_consent',
        status: 'consented',
        metadata: { consented_at: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,score_id,type' }
    )
    .select('id')
    .single();

  if (error) {
    logger.error('Failed to submit credit consent', { error, userId });
    return err('UNKNOWN', 'Error guardando el consentimiento');
  }

  revalidatePath('/cuenta/mi-score');
  return ok({ id: data.id });
}

// ── Admin: approve/reject verification ──────────────────────────────

const ReviewSchema = z.object({
  verificationId: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  note: z.string().max(500).optional(),
});

export async function reviewVerification(
  input: unknown
): Promise<Result<{ newTrustFactor?: number; newTotal?: number }>> {
  const parsed = ReviewSchema.safeParse(input);
  if (!parsed.success) return err('VALIDATION', 'Datos inválidos');

  const admin = await requireAdmin();
  const supabase = await getServerSupabase();
  if (!supabase) return err('UNKNOWN', 'Error de configuración');

  const { data: verification, error: fetchErr } = await supabase
    .from('score_verifications')
    .select('*')
    .eq('id', parsed.data.verificationId)
    .single();

  if (fetchErr || !verification) return err('NOT_FOUND', 'Verificación no encontrada');

  const newStatus = parsed.data.action === 'approve' ? 'verified' : 'rejected';

  const { error: updateErr } = await supabase
    .from('score_verifications')
    .update({
      status: newStatus,
      reviewed_by: admin.user.id,
      reviewed_at: new Date().toISOString(),
      metadata: {
        ...((verification.metadata as Record<string, unknown>) ?? {}),
        ...(parsed.data.note ? { review_note: parsed.data.note } : {}),
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.verificationId);

  if (updateErr) {
    logger.error('Failed to review verification', { error: updateErr });
    return err('UNKNOWN', 'Error actualizando la verificación');
  }

  // If approved, recalculate trust factor for this user's latest score
  let newTrustFactor: number | undefined;
  let newTotal: number | undefined;

  if (parsed.data.action === 'approve' && verification.user_id) {
    const userId = verification.user_id;
    const score = await getLatestScore(userId);

    if (score) {
      const verifiedTypes = await getVerifiedTypesForUser(userId);
      const verificationStatus = buildVerificationStatus(verifiedTypes);
      const trustResult = calculateTrustFactor(verificationStatus, score.score_declared);

      newTrustFactor = trustResult.factor;
      newTotal = Math.max(0, Math.min(1000, Math.round(score.score_declared * trustResult.factor)));

      // Update the score row — trigger will sync to profiles
      const { error: scoreErr } = await supabase
        .from('renty_scores')
        .update({
          trust_factor: newTrustFactor,
          score_total: newTotal,
          resultado: newTotal >= 750 ? 'verde' : newTotal >= 600 ? 'amarillo' : newTotal >= 400 ? 'naranja' : 'rojo',
          verification_level: Math.round(trustResult.verificationIndex * 100),
        })
        .eq('id', score.id);

      if (scoreErr) {
        logger.error('Failed to update score after verification', { error: scoreErr, userId });
        revalidatePath('/cuenta/mi-score');
        revalidatePath('/admin/verificaciones');
        return err('UNKNOWN', 'Verificación aprobada pero el score no se actualizó.');
      }
    }
  }

  revalidatePath('/cuenta/mi-score');
  revalidatePath('/admin/verificaciones');
  return ok({ newTrustFactor, newTotal });
}
