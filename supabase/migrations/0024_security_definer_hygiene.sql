-- ============================================================
-- F-07: SECURITY DEFINER attack-surface hygiene.
--
-- Problem: 6 SECURITY DEFINER functions live in `public` with
-- EXECUTE granted to PUBLIC. Supabase best practices call for
-- moving them to a private schema or revoking EXECUTE.
--
-- Approach (pragmatic, low-blast-radius):
--
--  1. DROP `public.increment_listing_view` — zero callers in
--     the codebase. Was the only realistically abusable one
--     (could inflate view counts).
--
--  2. DROP `public.waitlist_count` — zero callers in the
--     codebase. The audit called it "by design for the marketing
--     counter" but no counter is wired up. Dead code.
--
--  3. REVOKE EXECUTE FROM PUBLIC on trigger-only functions:
--     `handle_new_user`, `guard_status_transition`,
--     `sync_renty_score_to_profile`. Triggers fire under the
--     function-owner's privileges, so revoking from callers
--     does not break them — it just blocks direct RPC calls.
--
--  4. `public.is_admin()` stays in public with EXECUTE granted
--     broadly because RLS policies call it unqualified and on
--     every query. Audit rated its risk as "none" (it only
--     returns a bool based on the caller's own profile).
-- ============================================================

-- 1. DROP dead function — zero callers
DROP FUNCTION IF EXISTS public.increment_listing_view(uuid);

-- 2. DROP dead function — zero callers
DROP FUNCTION IF EXISTS public.waitlist_count();

-- 3. REVOKE EXECUTE from trigger-only functions. They still
-- fire via triggers, which use the function owner's rights.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;

REVOKE ALL ON FUNCTION public.guard_status_transition() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.guard_status_transition() FROM anon, authenticated;

REVOKE ALL ON FUNCTION public.sync_renty_score_to_profile() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.sync_renty_score_to_profile() FROM anon, authenticated;
