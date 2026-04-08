-- 0014: Backfill profiles with trust_factor + score_declared from renty_scores
-- Migration 0013 updated the sync trigger, but existing rows inserted before
-- that migration don't have these profile fields populated.
--
-- Only backfill v2 scores. v1 scores have trust_factor=1.0 from migration 0012
-- backfill, but showing "100% verificado" for unverified users is misleading.
-- v1 users keep renty_trust_factor=NULL so the UI gracefully hides verification info.
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE profiles p
SET
  renty_trust_factor     = rs.trust_factor,
  renty_score_declared   = rs.score_declared
FROM (
  SELECT DISTINCT ON (user_id)
    user_id, trust_factor, score_declared
  FROM renty_scores
  WHERE user_id IS NOT NULL
    AND algorithm_version != '1.0'
  ORDER BY user_id, created_at DESC
) rs
WHERE p.id = rs.user_id;
