create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nick text not null check (char_length(trim(nick)) between 2 and 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.strategies (
  id uuid primary key default gen_random_uuid(),
  source_key text unique,
  owner_id uuid references public.profiles(id) on delete set null,
  player_name text not null check (char_length(trim(player_name)) between 2 and 64),
  attack text[] not null constraint strategies_attack_composition_check check (
    cardinality(attack) = 3
    and attack[1] is not null and btrim(attack[1]) <> '' and attack[1] <> '*'
    and attack[2] is not null and btrim(attack[2]) <> '' and attack[2] <> '*'
    and attack[3] is not null and btrim(attack[3]) <> ''
  ),
  defense text[] not null constraint strategies_defense_composition_check check (
    cardinality(defense) = 3
    and defense[1] is not null and btrim(defense[1]) <> '' and defense[1] <> '*'
    and defense[2] is not null and btrim(defense[2]) <> '' and defense[2] <> '*'
    and defense[3] is not null and btrim(defense[3]) <> ''
  ),
  safety text not null check (safety in ('very_safe', 'safe', 'situational', 'experimental')),
  validation_status text not null check (validation_status in ('proven', 'recommended', 'needs_testing')),
  sections jsonb not null default '{}'::jsonb check (jsonb_typeof(sections) = 'object'),
  is_seed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((is_seed and owner_id is null) or (not is_seed and owner_id is not null))
);

create index strategies_created_at_idx on public.strategies (created_at desc);
create index strategies_owner_id_idx on public.strategies (owner_id);
create index strategies_safety_idx on public.strategies (safety);
create index strategies_validation_status_idx on public.strategies (validation_status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger strategies_set_updated_at
before update on public.strategies
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.strategies enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.strategies from anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.strategies to authenticated;

create policy "Authenticated users can read profiles"
on public.profiles for select
to authenticated
using (true);

create policy "Users can create their profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Authenticated users can read strategies"
on public.strategies for select
to authenticated
using (true);

create policy "Users can create their strategies"
on public.strategies for insert
to authenticated
with check (
  (select auth.uid()) = owner_id
  and is_seed = false
  and player_name = (select nick from public.profiles where id = (select auth.uid()))
);

create policy "Users can update their strategies"
on public.strategies for update
to authenticated
using ((select auth.uid()) = owner_id and is_seed = false)
with check (
  (select auth.uid()) = owner_id
  and is_seed = false
  and player_name = (select nick from public.profiles where id = (select auth.uid()))
);

create policy "Users can delete their strategies"
on public.strategies for delete
to authenticated
using ((select auth.uid()) = owner_id and is_seed = false);
