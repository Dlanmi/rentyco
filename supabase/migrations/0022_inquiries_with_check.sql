-- ============================================================
-- F-12: Add WITH CHECK to "inquiries owner update" policy.
--
-- The existing policy (recreated in 0021) has USING but no
-- WITH CHECK. A listing owner who can legitimately UPDATE an
-- inquiry row (to change status) could also change listing_id
-- to a listing they don't own, re-homing the inquiry.
--
-- The fix mirrors the USING predicate as WITH CHECK so the
-- post-update row must still satisfy the same ownership test.
-- Severity Low — the server action layer
-- (src/app/actions/inquiries.ts) is the real gate today, but
-- this closes the defense-in-depth gap.
-- ============================================================

DROP POLICY IF EXISTS "inquiries owner update" ON public.inquiries;
CREATE POLICY "inquiries owner update"
  ON public.inquiries FOR UPDATE TO public
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = inquiries.listing_id AND l.owner_id = (select auth.uid())
    )
    OR (select is_admin())
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = inquiries.listing_id AND l.owner_id = (select auth.uid())
    )
    OR (select is_admin())
  );
