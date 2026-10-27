alter table public.strategies
add column if not exists is_active boolean not null default true;

create index if not exists strategies_active_created_at_idx
on public.strategies (created_at desc)
where is_active;

update public.strategies
set is_active = false
where source_key in (
  'siege-team-helper:mihyang-windy-vigor-vs-carcano-liu-mei',
  'siege-team-helper:chiwu-deborah-legolas-vs-tarnisha-miles'
);
