-- ============================================================
-- Migration: Create Waitlist Table
-- Applied to production via Supabase MCP on 2026-04-06
-- Note: Content matches 001_waitlist.sql, renumbered for sequence
-- ============================================================

-- Waitlist entries
CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('inquilino', 'arrendador')),
  nombre text NOT NULL,
  email text NOT NULL,
  ciudad text NOT NULL DEFAULT 'Bogota',
  -- Inquilino fields
  arrienda_actualmente boolean,
  -- Arrendador fields
  num_propiedades text CHECK (num_propiedades IN ('1', '2-5', '6+')),
  -- Metadata
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text
);

-- Unique email constraint
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_unique ON public.waitlist (email);

-- Indexes for counting and querying
CREATE INDEX IF NOT EXISTS waitlist_tipo_idx ON public.waitlist (tipo);
CREATE INDEX IF NOT EXISTS waitlist_created_idx ON public.waitlist (created_at DESC);

-- Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the public form)
CREATE POLICY "Allow anonymous inserts" ON public.waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- No direct reads for anon (use RPC for count)
CREATE POLICY "Allow counting" ON public.waitlist
  FOR SELECT
  TO anon
  USING (false);

-- RPC function for public counter
CREATE OR REPLACE FUNCTION public.waitlist_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT count(*)::integer FROM public.waitlist;
$$;

-- Grant execute to anon
GRANT EXECUTE ON FUNCTION public.waitlist_count() TO anon;
