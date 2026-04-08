-- ============================================================
-- Consolidate multiple permissive policies into single ones
-- Prevents per-row evaluation of each overlapping policy.
-- ============================================================

-- ── profiles UPDATE: merge self + admin into one ─────────
DROP POLICY IF EXISTS "profiles self update" ON public.profiles;
DROP POLICY IF EXISTS "profiles admin update" ON public.profiles;
CREATE POLICY "profiles_update"
  ON public.profiles FOR UPDATE TO public
  USING (id = (select auth.uid()) OR is_admin())
  WITH CHECK (id = (select auth.uid()) OR is_admin());

-- ── renty_scores SELECT: merge self + admin into one ─────
DROP POLICY IF EXISTS "users_read_own" ON public.renty_scores;
DROP POLICY IF EXISTS "admin_read_all" ON public.renty_scores;
CREATE POLICY "scores_read"
  ON public.renty_scores FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()) OR is_admin());

-- ── score_verifications SELECT: merge self + admin ───────
DROP POLICY IF EXISTS "verifications_self_read" ON public.score_verifications;
DROP POLICY IF EXISTS "admin_read_all_verifications" ON public.score_verifications;
CREATE POLICY "verifications_read"
  ON public.score_verifications FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()) OR is_admin());

-- ── score_verifications UPDATE: merge self + admin ───────
-- Admin can update any row (no status restriction).
-- User can only update their own non-terminal rows.
DROP POLICY IF EXISTS "verifications_self_update" ON public.score_verifications;
DROP POLICY IF EXISTS "admin_update_verifications" ON public.score_verifications;
CREATE POLICY "verifications_update"
  ON public.score_verifications FOR UPDATE TO authenticated
  USING (
    is_admin()
    OR (user_id = (select auth.uid()) AND status NOT IN ('verified', 'rejected'))
  )
  WITH CHECK (
    is_admin()
    OR user_id = (select auth.uid())
  );

-- ── listing_images SELECT: split ALL into per-command ────
-- The ALL policy (images owner manage) overlaps with the
-- SELECT policy (images public read). Fix: single SELECT
-- covering all cases, separate INSERT/UPDATE/DELETE.

DROP POLICY IF EXISTS "images owner manage" ON public.listing_images;
DROP POLICY IF EXISTS "images public read" ON public.listing_images;

-- Single SELECT policy covering public read + owner + admin
CREATE POLICY "images_read"
  ON public.listing_images FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_images.listing_id
        AND (
          (l.status = 'active'::listing_status AND l.deleted_at IS NULL)
          OR l.owner_id = (select auth.uid())
          OR is_admin()
        )
    )
  );

-- Owner/admin INSERT
CREATE POLICY "images_insert"
  ON public.listing_images FOR INSERT TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_images.listing_id
        AND l.deleted_at IS NULL
        AND (l.owner_id = (select auth.uid()) OR is_admin())
    )
  );

-- Owner/admin UPDATE
CREATE POLICY "images_update"
  ON public.listing_images FOR UPDATE TO public
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_images.listing_id
        AND l.deleted_at IS NULL
        AND (l.owner_id = (select auth.uid()) OR is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_images.listing_id
        AND l.deleted_at IS NULL
        AND (l.owner_id = (select auth.uid()) OR is_admin())
    )
  );

-- Owner/admin DELETE
CREATE POLICY "images_delete"
  ON public.listing_images FOR DELETE TO public
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_images.listing_id
        AND l.deleted_at IS NULL
        AND (l.owner_id = (select auth.uid()) OR is_admin())
    )
  );
