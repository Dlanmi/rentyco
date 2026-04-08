-- Renty Score v2: Consistency detection + verification system
-- Algorithm version bumps from 1.0 to 2.0

-- ============================================================
-- Part 1: New columns on renty_scores
-- ============================================================

ALTER TABLE public.renty_scores
  ADD COLUMN consistency_score integer NOT NULL DEFAULT 0,
  ADD COLUMN inconsistencies jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN verification_level integer NOT NULL DEFAULT 0
    CHECK (verification_level >= 0 AND verification_level <= 100),
  ADD COLUMN ocupantes smallint;

-- Update default algorithm version for new rows
ALTER TABLE public.renty_scores
  ALTER COLUMN algorithm_version SET DEFAULT '2.0';

-- ============================================================
-- Part 2: Verification tracking table
-- ============================================================

CREATE TABLE public.score_verifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score_id uuid REFERENCES public.renty_scores(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN (
    'profile_complete', 'identity', 'income_proof', 'landlord_reference', 'credit_consent'
  )),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'submitted', 'uploaded', 'contacted', 'consented',
    'verified', 'completed', 'rejected'
  )),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  r2_key text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, score_id, type)
);

-- Indexes
CREATE INDEX score_verifications_user_idx
  ON public.score_verifications(user_id, created_at DESC);

CREATE INDEX score_verifications_pending_idx
  ON public.score_verifications(status)
  WHERE status NOT IN ('verified', 'completed', 'rejected');

-- RLS
ALTER TABLE public.score_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "verifications_self_read"
  ON public.score_verifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "verifications_self_insert"
  ON public.score_verifications FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "verifications_self_update"
  ON public.score_verifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status NOT IN ('verified', 'rejected'))
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- Part 3: Add verification level to profiles
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS renty_verification_level integer NOT NULL DEFAULT 0;

-- ============================================================
-- Part 4: Update the profile sync trigger to include verification_level
-- ============================================================

CREATE OR REPLACE FUNCTION public.sync_renty_score_to_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET renty_score = NEW.score_total,
        renty_score_color = NEW.resultado,
        renty_score_date = NEW.created_at,
        renty_verification_level = COALESCE(NEW.verification_level, 0)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================================
-- Part 5: Cedula index for duplicate detection
-- ============================================================

CREATE INDEX IF NOT EXISTS renty_scores_cedula_user_idx
  ON public.renty_scores(cedula, user_id)
  WHERE user_id IS NOT NULL;
