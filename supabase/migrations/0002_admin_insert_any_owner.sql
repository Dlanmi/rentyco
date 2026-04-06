-- Allow admin to create listings on behalf of other landlords.
-- Previously the INSERT policy restricted owner_id = auth.uid() only.
DROP POLICY IF EXISTS "listings owner insert" ON public.listings;
CREATE POLICY "listings owner insert" ON public.listings
  FOR INSERT WITH CHECK (owner_id = auth.uid() OR public.is_admin());
