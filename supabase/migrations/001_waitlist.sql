-- Renty Waitlist Schema
-- Run this in Supabase SQL Editor or via supabase db push

-- Waitlist entries
create table if not exists public.waitlist (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  tipo text not null check (tipo in ('inquilino', 'arrendador')),
  nombre text not null,
  email text not null,
  ciudad text not null default 'Bogotá',
  -- Inquilino fields
  arrienda_actualmente boolean,
  -- Arrendador fields
  num_propiedades text check (num_propiedades in ('1', '2-5', '6+')),
  -- Metadata
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text
);

-- Unique email constraint
create unique index if not exists waitlist_email_unique on public.waitlist (email);

-- Index for counting and querying
create index if not exists waitlist_tipo_idx on public.waitlist (tipo);
create index if not exists waitlist_created_idx on public.waitlist (created_at desc);

-- Row Level Security
alter table public.waitlist enable row level security;

-- Allow anonymous inserts (for the public form)
create policy "Allow anonymous inserts" on public.waitlist
  for insert
  to anon
  with check (true);

-- Allow reading count only (no PII exposed)
create policy "Allow counting" on public.waitlist
  for select
  to anon
  using (false); -- No direct reads; use RPC for count

-- RPC function for public counter
create or replace function public.waitlist_count()
returns integer
language sql
security definer
stable
as $$
  select count(*)::integer from public.waitlist;
$$;

-- Grant execute to anon
grant execute on function public.waitlist_count() to anon;
