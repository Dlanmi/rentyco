-- 0013: Verification flow — admin RLS + profile fields for landlord display
-- ─────────────────────────────────────────────────────────────────────────

-- Part 1: Admin RLS on score_verifications
-- Admin can read all verifications (review queue)
CREATE POLICY "admin_read_all_verifications"
  ON public.score_verifications FOR SELECT TO authenticated
  USING (public.is_admin());

-- Admin can update any verification (approve/reject)
CREATE POLICY "admin_update_verifications"
  ON public.score_verifications FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Part 2: Profile fields for trust factor display
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS renty_trust_factor numeric(4,3) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS renty_score_declared integer DEFAULT NULL;

-- Part 3: Update sync trigger to include trust factor fields
CREATE OR REPLACE FUNCTION public.sync_renty_score_to_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET
      renty_score            = NEW.score_total,
      renty_score_color      = NEW.resultado,
      renty_score_date       = NEW.created_at,
      renty_verification_level = COALESCE(NEW.verification_level, 0),
      renty_trust_factor     = NEW.trust_factor,
      renty_score_declared   = NEW.score_declared
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Also handle UPDATE on renty_scores (when trust factor is recalculated)
DROP TRIGGER IF EXISTS on_renty_score_update ON public.renty_scores;
CREATE TRIGGER on_renty_score_update
  AFTER UPDATE OF score_total, trust_factor ON public.renty_scores
  FOR EACH ROW
  EXECUTE FUNCTION sync_renty_score_to_profile();
