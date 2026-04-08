-- 0015: Allow admin to update renty_scores
-- Required for trust factor recalculation after verification approval.
-- Without this, the UPDATE in reviewVerification silently affects 0 rows.

CREATE POLICY "admin_update_scores"
  ON public.renty_scores FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
