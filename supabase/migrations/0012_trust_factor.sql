-- Trust factor model: Score_final = Score_declared × Trust_factor
-- Adds score_declared and trust_factor columns to renty_scores

ALTER TABLE public.renty_scores
  ADD COLUMN score_declared integer,
  ADD COLUMN trust_factor numeric(4,3) NOT NULL DEFAULT 1.0;

-- Backfill: existing rows have score_declared = score_total and factor = 1.0
UPDATE public.renty_scores
SET score_declared = score_total
WHERE score_declared IS NULL;

ALTER TABLE public.renty_scores
  ALTER COLUMN score_declared SET NOT NULL;
