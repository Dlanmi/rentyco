-- Add latest score fields to profiles for quick access
ALTER TABLE public.profiles
  ADD COLUMN renty_score integer,
  ADD COLUMN renty_score_color text CHECK (renty_score_color IN ('verde', 'amarillo', 'naranja', 'rojo')),
  ADD COLUMN renty_score_date timestamptz;

-- Trigger function: when a score is inserted with a user_id,
-- automatically update the corresponding profile row.
-- SECURITY DEFINER to bypass RLS (trigger runs as owner).
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
        renty_score_date = NEW.created_at
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_renty_score_insert
  AFTER INSERT ON public.renty_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_renty_score_to_profile();
