-- 0005_security_fixes.sql
-- Fix two RLS vulnerabilities:
-- 1. renty_scores anon insert allows arbitrary user_id (can corrupt any profile)
-- 2. profiles table is fully public (exposes phone, role, score to anonymous users)

-- Fix 1: Restrict anonymous renty_scores inserts to only allow null user_id.
-- The server action already sets user_id = null for anon users.
-- Authenticated inserts are covered by the existing "authed_insert" policy.
DROP POLICY IF EXISTS "anon_insert" ON public.renty_scores;
CREATE POLICY "anon_insert" ON public.renty_scores
  FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

-- Fix 2: Replace the permissive "profiles public read" policy.
-- Previously: anyone (including anon) could read all profile data.
-- Now: only authenticated users can read profiles; anon has no access.
DROP POLICY IF EXISTS "profiles public read" ON public.profiles;

-- Users can always read their own profile
CREATE POLICY "profiles self read" ON public.profiles
  FOR SELECT USING (id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "profiles admin read" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Authenticated users can read other profiles (needed for listing owner cards, inquiries)
CREATE POLICY "profiles authenticated read" ON public.profiles
  FOR SELECT TO authenticated USING (true);
