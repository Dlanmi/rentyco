-- Landlord verification: extend score_verifications to support landlord document uploads.
-- Adds context column (tenant/landlord), property_proof type, and updated unique constraint.

-- 1. Add context column (all existing rows are tenant)
ALTER TABLE public.score_verifications
ADD COLUMN context text NOT NULL DEFAULT 'tenant'
  CHECK (context IN ('tenant', 'landlord'));

-- 2. Extend type check to include property_proof
ALTER TABLE public.score_verifications
DROP CONSTRAINT score_verifications_type_check;

ALTER TABLE public.score_verifications
ADD CONSTRAINT score_verifications_type_check
  CHECK (type IN ('profile_complete', 'identity', 'income_proof', 'landlord_reference', 'credit_consent', 'property_proof'));

-- 3. Update unique constraint to include context
ALTER TABLE public.score_verifications
DROP CONSTRAINT score_verifications_user_id_score_id_type_key;

ALTER TABLE public.score_verifications
ADD CONSTRAINT score_verifications_user_id_context_type_key
  UNIQUE (user_id, context, type);
