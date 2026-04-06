-- Renty Marketplace Schema
-- Run this in Supabase SQL Editor or via `supabase db push`

-- =========================================================================
-- Extensions
-- =========================================================================
create extension if not exists pgcrypto;
create extension if not exists moddatetime schema extensions;

-- =========================================================================
-- Enums
-- =========================================================================
do $$ begin
  create type property_type as enum ('apartamento','casa','apartaestudio','habitacion','estudio');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_status as enum ('draft','pending_review','active','paused','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('tenant','landlord','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type inquiry_status as enum ('new','contacted','closed');
exception when duplicate_object then null; end $$;

-- =========================================================================
-- cities
-- =========================================================================
create table if not exists public.cities (
  id smallserial primary key,
  slug text not null unique,
  name text not null,
  active boolean not null default true,
  display_order smallint not null default 0,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- neighborhoods
-- =========================================================================
create table if not exists public.neighborhoods (
  id serial primary key,
  city_id smallint not null references public.cities(id) on delete cascade,
  slug text not null,
  name text not null,
  lat numeric(9,6),
  lng numeric(9,6),
  display_order smallint not null default 0,
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists neighborhoods_city_idx on public.neighborhoods(city_id);

-- =========================================================================
-- profiles
-- =========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  role user_role not null default 'tenant',
  verified boolean not null default false,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists handle_profiles_updated_at on public.profiles;
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function extensions.moddatetime(updated_at);

-- Auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- is_admin() helper (SECURITY DEFINER to bypass RLS on profiles lookup)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- =========================================================================
-- listings
-- =========================================================================
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  city_id smallint not null references public.cities(id) on delete restrict,
  neighborhood_id integer references public.neighborhoods(id) on delete set null,
  slug text not null,
  title text not null check (char_length(title) between 8 and 140),
  description text not null check (char_length(description) between 40 and 5000),
  property_type property_type not null,
  price_cop integer not null check (price_cop between 200000 and 100000000),
  admin_fee_cop integer check (admin_fee_cop >= 0),
  deposit_cop integer check (deposit_cop >= 0),
  bedrooms smallint not null check (bedrooms between 0 and 20),
  bathrooms smallint not null check (bathrooms between 0 and 20),
  area_m2 smallint not null check (area_m2 between 10 and 2000),
  floor smallint,
  parking smallint default 0 check (parking >= 0),
  is_furnished boolean not null default false,
  amenities jsonb not null default '[]'::jsonb,
  rules text,
  address_line text,
  lat numeric(9,6),
  lng numeric(9,6),
  status listing_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

drop trigger if exists handle_listings_updated_at on public.listings;
create trigger handle_listings_updated_at
  before update on public.listings
  for each row
  execute function extensions.moddatetime(updated_at);

-- set published_at when status transitions to active
create or replace function public.set_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'active' and (old.status is distinct from 'active') then
    new.published_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists set_listings_published_at on public.listings;
create trigger set_listings_published_at
  before update on public.listings
  for each row
  execute function public.set_published_at();

-- status transition guard
create or replace function public.guard_status_transition()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Admins can do anything
  if public.is_admin() then
    return new;
  end if;
  -- Only admin can set status to 'active'
  if new.status = 'active' and old.status is distinct from 'active' then
    raise exception 'Only admins can activate listings';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_listings_status on public.listings;
create trigger guard_listings_status
  before update of status on public.listings
  for each row
  execute function public.guard_status_transition();

-- Indexes
create index if not exists listings_city_status_idx
  on public.listings(city_id, status, published_at desc);
create index if not exists listings_filters_idx
  on public.listings(city_id, status, property_type, bedrooms, price_cop);
create index if not exists listings_neighborhood_idx
  on public.listings(neighborhood_id) where status = 'active';
create index if not exists listings_owner_idx on public.listings(owner_id);

-- =========================================================================
-- listing_images
-- =========================================================================
create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  r2_key text not null unique,
  width integer not null,
  height integer not null,
  blurhash text,
  alt_text text,
  display_order smallint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists listing_images_listing_idx
  on public.listing_images(listing_id, display_order);

-- Enforce max 12 images per listing
create or replace function public.enforce_image_limit()
returns trigger
language plpgsql
as $$
declare
  cnt integer;
begin
  select count(*) into cnt from public.listing_images where listing_id = new.listing_id;
  if cnt >= 12 then
    raise exception 'Maximum 12 images per listing';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_listing_image_limit on public.listing_images;
create trigger enforce_listing_image_limit
  before insert on public.listing_images
  for each row
  execute function public.enforce_image_limit();

-- =========================================================================
-- favorites
-- =========================================================================
create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create index if not exists favorites_listing_idx on public.favorites(listing_id);

-- =========================================================================
-- inquiries
-- =========================================================================
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (char_length(message) between 10 and 1000),
  contact_phone text,
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists handle_inquiries_updated_at on public.inquiries;
create trigger handle_inquiries_updated_at
  before update on public.inquiries
  for each row
  execute function extensions.moddatetime(updated_at);

create index if not exists inquiries_listing_idx
  on public.inquiries(listing_id, created_at desc);
create index if not exists inquiries_user_idx
  on public.inquiries(user_id, created_at desc);

-- =========================================================================
-- listing_views (daily counter)
-- =========================================================================
create table if not exists public.listing_views (
  listing_id uuid not null references public.listings(id) on delete cascade,
  day date not null default current_date,
  views integer not null default 0,
  primary key (listing_id, day)
);

create or replace function public.increment_listing_view(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.listing_views(listing_id, day, views)
  values (p_listing_id, current_date, 1)
  on conflict (listing_id, day) do update
    set views = public.listing_views.views + 1;
end;
$$;

grant execute on function public.increment_listing_view(uuid) to anon, authenticated;

-- =========================================================================
-- Row Level Security
-- =========================================================================
alter table public.cities enable row level security;
alter table public.neighborhoods enable row level security;
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;
alter table public.inquiries enable row level security;
alter table public.listing_views enable row level security;

-- cities / neighborhoods: public read
drop policy if exists "cities are public" on public.cities;
create policy "cities are public" on public.cities for select using (true);

drop policy if exists "neighborhoods are public" on public.neighborhoods;
create policy "neighborhoods are public" on public.neighborhoods for select using (true);

-- profiles: public read (basic columns), self update
drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read" on public.profiles for select using (true);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- listings: public read active, owner/admin full access
drop policy if exists "listings public read active" on public.listings;
create policy "listings public read active" on public.listings
  for select using (status = 'active' or owner_id = auth.uid() or public.is_admin());

drop policy if exists "listings owner insert" on public.listings;
create policy "listings owner insert" on public.listings
  for insert with check (owner_id = auth.uid());

drop policy if exists "listings owner update" on public.listings;
create policy "listings owner update" on public.listings
  for update using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "listings owner delete" on public.listings;
create policy "listings owner delete" on public.listings
  for delete using (owner_id = auth.uid() or public.is_admin());

-- listing_images: public read if parent active, owner/admin manage
drop policy if exists "images public read" on public.listing_images;
create policy "images public read" on public.listing_images
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'active' or l.owner_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "images owner manage" on public.listing_images;
create policy "images owner manage" on public.listing_images
  for all using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.owner_id = auth.uid() or public.is_admin())
    )
  ) with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.owner_id = auth.uid() or public.is_admin())
    )
  );

-- favorites: user-owned
drop policy if exists "favorites self" on public.favorites;
create policy "favorites self" on public.favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- inquiries: sender, listing owner, admin
drop policy if exists "inquiries sender read" on public.inquiries;
create policy "inquiries sender read" on public.inquiries
  for select using (
    user_id = auth.uid()
    or exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists "inquiries sender insert" on public.inquiries;
create policy "inquiries sender insert" on public.inquiries
  for insert with check (user_id = auth.uid());

drop policy if exists "inquiries owner update" on public.inquiries;
create policy "inquiries owner update" on public.inquiries
  for update using (
    exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
    or public.is_admin()
  );

-- listing_views: no direct access (only via RPC)
drop policy if exists "views no direct access" on public.listing_views;
create policy "views no direct access" on public.listing_views for select using (public.is_admin());

-- =========================================================================
-- Seed: Bogotá + key neighborhoods
-- =========================================================================
insert into public.cities (slug, name, active, display_order) values
  ('bogota', 'Bogotá', true, 1)
on conflict (slug) do nothing;

insert into public.neighborhoods (city_id, slug, name, lat, lng, display_order)
select c.id, n.slug, n.name, n.lat, n.lng, n.ord
from public.cities c
cross join (values
  ('chapinero',      'Chapinero',      4.6486, -74.0629, 1),
  ('chico',          'Chicó',          4.6815, -74.0479, 2),
  ('usaquen',        'Usaquén',        4.6951, -74.0308, 3),
  ('teusaquillo',    'Teusaquillo',    4.6335, -74.0905, 4),
  ('salitre',        'Salitre',        4.6604, -74.1064, 5),
  ('cedritos',       'Cedritos',       4.7234, -74.0338, 6),
  ('suba',           'Suba',           4.7500, -74.0833, 7),
  ('engativa',       'Engativá',       4.7097, -74.1165, 8),
  ('kennedy',        'Kennedy',        4.6284, -74.1455, 9),
  ('fontibon',       'Fontibón',       4.6784, -74.1443, 10),
  ('santa-fe',       'Santa Fe',       4.6075, -74.0780, 11),
  ('la-candelaria',  'La Candelaria',  4.5974, -74.0734, 12),
  ('modelia',        'Modelia',        4.6707, -74.1220, 13),
  ('rosales',        'Rosales',        4.6625, -74.0485, 14),
  ('galerias',       'Galerías',       4.6454, -74.0799, 15)
) as n(slug, name, lat, lng, ord)
where c.slug = 'bogota'
on conflict (city_id, slug) do nothing;
