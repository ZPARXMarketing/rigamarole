-- Rigmarole initial schema
-- Creates the script_data table with RLS policies scoped to auth.uid()

create table if not exists public.script_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  cards jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.script_data enable row level security;

drop policy if exists "script_data_select_own" on public.script_data;
create policy "script_data_select_own"
  on public.script_data
  for select
  using (auth.uid() = user_id);

drop policy if exists "script_data_insert_own" on public.script_data;
create policy "script_data_insert_own"
  on public.script_data
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "script_data_update_own" on public.script_data;
create policy "script_data_update_own"
  on public.script_data
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
