-- Add algorithm version tracking to renty_scores
ALTER TABLE public.renty_scores
  ADD COLUMN algorithm_version text NOT NULL DEFAULT '1.0';
