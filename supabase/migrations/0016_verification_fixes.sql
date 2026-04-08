-- 0016: Verification fixes
-- 1. Expand update trigger to fire on resultado and verification_level changes
-- 2. Add partial unique index for NULL score_id (prevents duplicate verifications)
-- 3. Add optimized queue index for admin verification panel

-- Part 1: Expand trigger column list
DROP TRIGGER IF EXISTS on_renty_score_update ON public.renty_scores;
CREATE TRIGGER on_renty_score_update
  AFTER UPDATE OF score_total, trust_factor, resultado, verification_level
  ON public.renty_scores
  FOR EACH ROW
  EXECUTE FUNCTION sync_renty_score_to_profile();

-- Part 2: Partial unique index for NULL score_id
-- The UNIQUE(user_id, score_id, type) constraint doesn't prevent duplicates
-- when score_id IS NULL because NULL != NULL in PostgreSQL.
CREATE UNIQUE INDEX IF NOT EXISTS score_verifications_user_type_null_score
  ON public.score_verifications(user_id, type)
  WHERE score_id IS NULL;

-- Part 3: Queue-optimized index for admin verification panel
CREATE INDEX IF NOT EXISTS score_verifications_queue_idx
  ON public.score_verifications(created_at ASC)
  WHERE status IN ('submitted', 'uploaded', 'contacted', 'consented');
