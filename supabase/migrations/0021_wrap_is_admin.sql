-- ============================================================
-- Wrap is_admin() in (select is_admin()) for initplan optimization.
-- Same rationale as 0017's (select auth.uid()) wrap: forces Postgres
-- to evaluate the SECURITY DEFINER helper once per query instead of
-- once per row. is_admin() does a profiles lookup, so per-row
-- evaluation is especially expensive.
--
-- 17 policies affected across 9 tables. Semantics unchanged.
-- ============================================================

-- ── inquiries ────────────────────────────────────────────
DROP POLICY IF EXISTS "inquiries sender read" ON public.inquiries;
CREATE POLICY "inquiries sender read"
  ON public.inquiries FOR SELECT TO public
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = inquiries.listing_id AND l.owner_id = (select auth.uid())
    )
    OR (select is_admin())
  );

DROP POLICY IF EXISTS "inquiries owner update" ON public.inquiries;
CREATE POLICY "inquiries owner update"
  ON public.inquiries FOR UPDATE TO public
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = inquiries.listing_id AND l.owner_id = (select auth.uid())
    )
    OR (select is_admin())
  );

-- ── listings ─────────────────────────────────────────────
DROP POLICY IF EXISTS "listings public read active" ON public.listings;
CREATE POLICY "listings public read active"
  ON public.listings FOR SELECT TO public
  USING (
    (status = 'active'::listing_status AND deleted_at IS NULL)
    OR owner_id = (select auth.uid())
    OR (select is_admin())
  );

DROP POLICY IF EXISTS "listings owner insert" ON public.listings;
CREATE POLICY "listings owner insert"
  ON public.listings FOR INSERT TO public
  WITH CHECK (owner_id = (select auth.uid()) OR (select is_admin()));

DROP POLICY IF EXISTS "listings owner update" ON public.listings;
CREATE POLICY "listings owner update"
  ON public.listings FOR UPDATE TO public
  USING ((owner_id = (select auth.uid()) OR (select is_admin())) AND deleted_at IS NULL)
  WITH CHECK ((owner_id = (select auth.uid()) OR (select is_admin())) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "listings admin delete" ON public.listings;
CREATE POLICY "listings admin delete"
  ON public.listings FOR DELETE TO public
  USING ((select is_admin()));

-- ── listing_images ───────────────────────────────────────
DROP POLICY IF EXISTS "images_read" ON public.listing_images;
CREATE POLICY "images_read"
  ON public.listing_images FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_images.listing_id
        AND (
          (l.status = 'active'::listing_status AND l.deleted_at IS NULL)
          OR l.owner_id = (select auth.uid())
          OR (select is_admin())
        )
    )
  );

DROP POLICY IF EXISTS "images_insert" ON public.listing_images;
CREATE POLICY "images_insert"
  ON public.listing_images FOR INSERT TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_images.listing_id
        AND l.deleted_at IS NULL
        AND (l.owner_id = (select auth.uid()) OR (select is_admin()))
    )
  );

DROP POLICY IF EXISTS "images_update" ON public.listing_images;
CREATE POLICY "images_update"
  ON public.listing_images FOR UPDATE TO public
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_images.listing_id
        AND l.deleted_at IS NULL
        AND (l.owner_id = (select auth.uid()) OR (select is_admin()))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_images.listing_id
        AND l.deleted_at IS NULL
        AND (l.owner_id = (select auth.uid()) OR (select is_admin()))
    )
  );

DROP POLICY IF EXISTS "images_delete" ON public.listing_images;
CREATE POLICY "images_delete"
  ON public.listing_images FOR DELETE TO public
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_images.listing_id
        AND l.deleted_at IS NULL
        AND (l.owner_id = (select auth.uid()) OR (select is_admin()))
    )
  );

-- ── listing_views ────────────────────────────────────────
DROP POLICY IF EXISTS "views no direct access" ON public.listing_views;
CREATE POLICY "views no direct access"
  ON public.listing_views FOR SELECT TO public
  USING ((select is_admin()));

-- ── profiles ─────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update"
  ON public.profiles FOR UPDATE TO public
  USING (id = (select auth.uid()) OR (select is_admin()))
  WITH CHECK (id = (select auth.uid()) OR (select is_admin()));

-- ── renty_scores ─────────────────────────────────────────
DROP POLICY IF EXISTS "scores_read" ON public.renty_scores;
CREATE POLICY "scores_read"
  ON public.renty_scores FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()) OR (select is_admin()));

DROP POLICY IF EXISTS "admin_update_scores" ON public.renty_scores;
CREATE POLICY "admin_update_scores"
  ON public.renty_scores FOR UPDATE TO authenticated
  USING ((select is_admin()))
  WITH CHECK ((select is_admin()));

-- ── score_verifications ──────────────────────────────────
DROP POLICY IF EXISTS "verifications_read" ON public.score_verifications;
CREATE POLICY "verifications_read"
  ON public.score_verifications FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()) OR (select is_admin()));

DROP POLICY IF EXISTS "verifications_update" ON public.score_verifications;
CREATE POLICY "verifications_update"
  ON public.score_verifications FOR UPDATE TO authenticated
  USING (
    (select is_admin())
    OR (user_id = (select auth.uid()) AND status NOT IN ('verified', 'rejected'))
  )
  WITH CHECK (
    (select is_admin())
    OR user_id = (select auth.uid())
  );

-- ── waitlist ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin read all" ON public.waitlist;
CREATE POLICY "Admin read all"
  ON public.waitlist FOR SELECT TO authenticated
  USING ((select is_admin()));
