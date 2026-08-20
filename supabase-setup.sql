-- ============================================================
-- S.O.S Cursos - Setup do banco de dados (Supabase)
-- Como usar: Dashboard do Supabase > SQL Editor > New query
-- Cole este script inteiro e clique em RUN.
-- ============================================================

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  hours integer not null default 0,
  price numeric(10, 2) not null default 0,
  kids boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.promos (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  hours integer not null default 0,
  from_price numeric(10, 2) not null default 0,
  price numeric(10, 2) not null default 0,
  icon text not null default '',
  created_at timestamptz not null default now()
);

-- Segurança: qualquer visitante pode LER o catálogo,
-- mas apenas usuários logados (você) podem alterar.
alter table public.courses enable row level security;
alter table public.promos enable row level security;

-- Expoe as tabelas para a Data API do Supabase (obrigatório em projetos
-- criados a partir de maio/2026, quando isso deixou de ser automatico).
grant select on public.courses to anon;
grant select, insert, update, delete on public.courses to authenticated;
grant select on public.promos to anon;
grant select, insert, update, delete on public.promos to authenticated;

drop policy if exists "courses_public_read" on public.courses;
drop policy if exists "courses_admin_write" on public.courses;
drop policy if exists "promos_public_read" on public.promos;
drop policy if exists "promos_admin_write" on public.promos;

-- Somente o administrador pode alterar o catálogo.
-- (antes, QUALQUER usuário logado podia apagar tudo - correcao)
create policy "courses_public_read" on public.courses
  for select using (true);

create policy "courses_admin_write" on public.courses
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'admin.azize@soscursos.com')
  with check (auth.jwt() ->> 'email' = 'admin.azize@soscursos.com');

create policy "promos_public_read" on public.promos
  for select using (true);

create policy "promos_admin_write" on public.promos
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'admin.azize@soscursos.com')
  with check (auth.jwt() ->> 'email' = 'admin.azize@soscursos.com');