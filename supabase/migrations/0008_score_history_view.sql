-- ============================================================
-- Migration: Score History View (Audit Trail)
-- Applied to production via Supabase MCP on 2026-04-06
-- ============================================================

-- Window-function VIEW over the append-only renty_scores table.
-- Shows old/new score pairs per user for admin investigation.
-- No RLS needed — inherits from renty_scores policies.

CREATE OR REPLACE VIEW public.score_history AS
SELECT
  rs.id AS score_id,
  rs.user_id,
  rs.score_total AS new_score,
  LAG(rs.score_total) OVER w AS old_score,
  rs.resultado AS new_color,
  LAG(rs.resultado) OVER w AS old_color,
  rs.algorithm_version,
  rs.created_at,
  ROW_NUMBER() OVER w AS attempt_number
FROM public.renty_scores rs
WHERE rs.user_id IS NOT NULL
WINDOW w AS (PARTITION BY rs.user_id ORDER BY rs.created_at);
