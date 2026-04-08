-- ============================================================
-- Security & Performance fixes from Supabase advisor audit
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. CRITICAL: Fix score_history view (SECURITY DEFINER → INVOKER)
--    The view bypasses RLS and exposes ALL users' score data.
--    Recreate with security_invoker=true so it respects the
--    caller's RLS policies on renty_scores.
-- ────────────────────────────────────────────────────────────

DROP VIEW IF EXISTS public.score_history;

CREATE VIEW public.score_history
WITH (security_invoker = true)
AS
SELECT
  rs.id AS score_id,
  rs.user_id,
  rs.score_total AS new_score,
  lag(rs.score_total) OVER w AS old_score,
  rs.resultado AS new_color,
  lag(rs.resultado) OVER w AS old_color,
  rs.algorithm_version,
  rs.created_at,
  row_number() OVER w AS attempt_number
FROM public.renty_scores rs
WHERE rs.user_id IS NOT NULL
WINDOW w AS (PARTITION BY rs.user_id ORDER BY rs.created_at);

-- ────────────────────────────────────────────────────────────
-- 2. WARN: Waitlist INSERT policies — add basic validation
--    Currently WITH CHECK (true) allows completely empty rows.
--    Require non-empty email at minimum.
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.waitlist;
CREATE POLICY "Allow anonymous inserts"
  ON public.waitlist FOR INSERT TO anon
  WITH CHECK (length(trim(email)) > 0);

DROP POLICY IF EXISTS "Allow authenticated inserts" ON public.waitlist;
CREATE POLICY "Allow authenticated inserts"
  ON public.waitlist FOR INSERT TO authenticated
  WITH CHECK (length(trim(email)) > 0);

-- ────────────────────────────────────────────────────────────
-- 3. WARN: RLS InitPlan — wrap auth.uid() in (select ...)
--    This changes per-row evaluation to per-query evaluation.
--    Affects: favorites, inquiries, listings, listing_images,
--    profiles, renty_scores, score_verifications
-- ────────────────────────────────────────────────────────────

-- favorites
DROP POLICY IF EXISTS "favorites self" ON public.favorites;
CREATE POLICY "favorites self"
  ON public.favorites FOR ALL TO public
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- inquiries
DROP POLICY IF EXISTS "inquiries sender read" ON public.inquiries;
CREATE POLICY "inquiries sender read"
  ON public.inquiries FOR SELECT TO public
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = inquiries.listing_id AND l.owner_id = (select auth.uid())
    )
    OR is_admin()
  );

DROP POLICY IF EXISTS "inquiries sender insert" ON public.inquiries;
CREATE POLICY "inquiries sender insert"
  ON public.inquiries FOR INSERT TO public
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "inquiries owner update" ON public.inquiries;
CREATE POLICY "inquiries owner update"
  ON public.inquiries FOR UPDATE TO public
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = inquiries.listing_id AND l.owner_id = (select auth.uid())
    )
    OR is_admin()
  );

-- listings
DROP POLICY IF EXISTS "listings public read active" ON public.listings;
CREATE POLICY "listings public read active"
  ON public.listings FOR SELECT TO public
  USING (
    (status = 'active'::listing_status AND deleted_at IS NULL)
    OR owner_id = (select auth.uid())
    OR is_admin()
  );

DROP POLICY IF EXISTS "listings owner insert" ON public.listings;
CREATE POLICY "listings owner insert"
  ON public.listings FOR INSERT TO public
  WITH CHECK (owner_id = (select auth.uid()) OR is_admin());

DROP POLICY IF EXISTS "listings owner update" ON public.listings;
CREATE POLICY "listings owner update"
  ON public.listings FOR UPDATE TO public
  USING ((owner_id = (select auth.uid()) OR is_admin()) AND deleted_at IS NULL)
  WITH CHECK ((owner_id = (select auth.uid()) OR is_admin()) AND deleted_at IS NULL);

-- listing_images
DROP POLICY IF EXISTS "images owner manage" ON public.listing_images;
CREATE POLICY "images owner manage"
  ON public.listing_images FOR ALL TO public
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

DROP POLICY IF EXISTS "images public read" ON public.listing_images;
CREATE POLICY "images public read"
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

-- profiles
DROP POLICY IF EXISTS "profiles self update" ON public.profiles;
CREATE POLICY "profiles self update"
  ON public.profiles FOR UPDATE TO public
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- renty_scores
DROP POLICY IF EXISTS "users_read_own" ON public.renty_scores;
CREATE POLICY "users_read_own"
  ON public.renty_scores FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "authed_insert" ON public.renty_scores;
CREATE POLICY "authed_insert"
  ON public.renty_scores FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- score_verifications
DROP POLICY IF EXISTS "verifications_self_read" ON public.score_verifications;
CREATE POLICY "verifications_self_read"
  ON public.score_verifications FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "verifications_self_insert" ON public.score_verifications;
CREATE POLICY "verifications_self_insert"
  ON public.score_verifications FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "verifications_self_update" ON public.score_verifications;
CREATE POLICY "verifications_self_update"
  ON public.score_verifications FOR UPDATE TO authenticated
  USING (user_id = (select auth.uid()) AND status NOT IN ('verified', 'rejected'))
  WITH CHECK (user_id = (select auth.uid()));

-- ────────────────────────────────────────────────────────────
-- 4. INFO: Add missing FK indexes on score_verifications
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS score_verifications_score_id_idx
  ON public.score_verifications(score_id);

CREATE INDEX IF NOT EXISTS score_verifications_reviewed_by_idx
  ON public.score_verifications(reviewed_by);
