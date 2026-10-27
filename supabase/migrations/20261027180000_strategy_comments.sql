create table if not exists public.strategy_comments (
  id uuid primary key default gen_random_uuid(),
  strategy_id uuid not null references public.strategies(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null check (char_length(trim(author_name)) between 2 and 64),
  body text not null,
  reaction smallint check (reaction is null or reaction in (-1, 1)),
  created_at timestamptz not null default now()
);

create index if not exists strategy_comments_strategy_created_at_idx
on public.strategy_comments (strategy_id, created_at asc);

create index if not exists strategy_comments_author_id_idx
on public.strategy_comments (author_id);

alter table public.strategy_comments
drop constraint if exists strategy_comments_body_check;

alter table public.strategy_comments
drop constraint if exists strategy_comments_body_content_check;

alter table public.strategy_comments
add constraint strategy_comments_body_content_check check (
  char_length(body) between 1 and 500
  and body ~ '[^[:space:]]'
);

alter table public.strategy_comments enable row level security;

revoke all on table public.strategy_comments from anon, authenticated;
grant select, insert on table public.strategy_comments to authenticated;

drop policy if exists "Authenticated users can read strategy comments" on public.strategy_comments;
create policy "Authenticated users can read strategy comments"
on public.strategy_comments for select
to authenticated
using (true);

drop policy if exists "Users can create strategy comments" on public.strategy_comments;
create policy "Users can create strategy comments"
on public.strategy_comments for insert
to authenticated
with check (
  (select auth.uid()) = author_id
  and author_name = (select nick from public.profiles where id = (select auth.uid()))
);
