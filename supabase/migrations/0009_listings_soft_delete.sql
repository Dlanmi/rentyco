-- ============================================================
-- Migration: Listings Soft Delete
-- Applied to production via Supabase MCP on 2026-04-06
-- ============================================================

-- 1. Add deleted_at column
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- 2. Replace unique constraint with partial unique index (active only)
ALTER TABLE public.listings
  DROP CONSTRAINT IF EXISTS listings_city_id_slug_key;

CREATE UNIQUE INDEX IF NOT EXISTS listings_city_slug_active
  ON public.listings (city_id, slug)
  WHERE deleted_at IS NULL;

-- 3. Performance index for active listing queries
CREATE INDEX IF NOT EXISTS listings_active_not_deleted
  ON public.listings (city_id, status, published_at DESC)
  WHERE deleted_at IS NULL;

-- 4. Update listings RLS policies to add soft-delete awareness
--    Combined policies: public sees active+non-deleted, owners see all own, admins see all

DROP POLICY IF EXISTS "listings public read active" ON public.listings;
CREATE POLICY "listings public read active" ON public.listings
  FOR SELECT TO anon, authenticated
  USING (
    (status = 'active' AND deleted_at IS NULL)
    OR (owner_id = auth.uid())
    OR is_admin()
  );

DROP POLICY IF EXISTS "listings owner update" ON public.listings;
CREATE POLICY "listings owner update" ON public.listings
  FOR UPDATE TO authenticated
  USING (((owner_id = auth.uid()) OR is_admin()) AND deleted_at IS NULL)
  WITH CHECK (((owner_id = auth.uid()) OR is_admin()) AND deleted_at IS NULL);

-- 5. Update image RLS policies to respect soft-deleted listings

DROP POLICY IF EXISTS "images public read" ON public.listing_images;
CREATE POLICY "images public read" ON public.listing_images
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_id
        AND (
          (l.status = 'active' AND l.deleted_at IS NULL)
          OR (l.owner_id = auth.uid())
          OR is_admin()
        )
    )
  );

DROP POLICY IF EXISTS "images owner manage" ON public.listing_images;
CREATE POLICY "images owner manage" ON public.listing_images
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_id
        AND l.deleted_at IS NULL
        AND ((l.owner_id = auth.uid()) OR is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_id
        AND l.deleted_at IS NULL
        AND ((l.owner_id = auth.uid()) OR is_admin())
    )
  );
