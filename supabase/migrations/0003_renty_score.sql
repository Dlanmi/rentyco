create table public.renty_scores (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  -- Datos básicos
  nombre text not null,
  cedula text not null,
  tipo_usuario text not null check (tipo_usuario in ('inquilino', 'arrendador')),
  inmueble_busca text,
  canon_mensual integer,
  ingreso_hogar integer,
  ratio_arriendo_ingreso numeric(5,4),
  -- Respuestas (código de opción seleccionada)
  a1 text not null, a2 text not null, a3 text not null,
  b1 text not null, b2 text not null, b3 text not null,
  c1 text not null, c2 text not null, c3 text not null,
  d1 text not null, d2 text not null, d3 text not null,
  -- Score calculado
  score_total integer not null,
  score_a integer not null,
  score_b integer not null,
  score_c integer not null,
  score_d integer not null,
  penalizaciones integer not null default 0,
  resultado text not null check (resultado in ('verde', 'amarillo', 'naranja', 'rojo')),
  -- Optional link to authenticated user
  user_id uuid references auth.users(id) on delete set null
);

-- RLS
alter table public.renty_scores enable row level security;
create policy "anon_insert" on public.renty_scores for insert to anon with check (true);
create policy "users_read_own" on public.renty_scores for select to authenticated using (user_id = auth.uid());
create policy "authed_insert" on public.renty_scores for insert to authenticated with check (user_id = auth.uid());
