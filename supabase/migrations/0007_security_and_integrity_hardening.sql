-- ============================================================
-- Migration: Security & Integrity Hardening
-- Applied to production via Supabase MCP on 2026-04-06
-- ============================================================

-- 1. Fix anon_insert RLS on renty_scores
--    BEFORE: WITH CHECK (true) — allows anon to set any user_id
--    AFTER:  WITH CHECK (user_id IS NULL) — anon scores must be unlinked
DROP POLICY IF EXISTS anon_insert ON public.renty_scores;
CREATE POLICY anon_insert ON public.renty_scores
  FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

-- 2. Add composite index for score lookups by user
--    Covers: getLatestScore, hasScoreToday, hasAnyScore
CREATE INDEX IF NOT EXISTS renty_scores_user_created_idx
  ON public.renty_scores (user_id, created_at DESC);

-- 3. Add CHECK constraint on score_total (valid range 0-1000)
ALTER TABLE public.renty_scores
  ADD CONSTRAINT renty_scores_score_total_range
  CHECK (score_total >= 0 AND score_total <= 1000);

-- 4. Add admin read policy on renty_scores
--    Allows admins to view all scores for support/investigation
CREATE POLICY admin_read_all ON public.renty_scores
  FOR SELECT TO authenticated
  USING (is_admin());
