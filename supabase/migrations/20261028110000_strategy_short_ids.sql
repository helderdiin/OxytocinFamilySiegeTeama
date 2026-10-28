create or replace function public.generate_strategy_short_id()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  candidate text;
  character_index integer;
begin
  loop
    candidate := '';
    for character_index in 1..8 loop
      candidate := candidate || substr(
        alphabet,
        1 + floor(random() * length(alphabet))::integer,
        1
      );
    end loop;

    exit when not exists (
      select 1
      from public.strategies as strategy
      where strategy.short_id = candidate
    );
  end loop;

  return candidate;
end;
$$;

alter table public.strategies
add column if not exists short_id text;

update public.strategies
set short_id = public.generate_strategy_short_id()
where short_id is null;

alter table public.strategies
alter column short_id set default public.generate_strategy_short_id(),
alter column short_id set not null;

alter table public.strategies
drop constraint if exists strategies_short_id_format_check;

alter table public.strategies
add constraint strategies_short_id_format_check
check (short_id ~ '^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$');

create unique index if not exists strategies_short_id_key
on public.strategies (short_id);

revoke all on function public.generate_strategy_short_id() from public, anon;
grant execute on function public.generate_strategy_short_id() to authenticated, service_role;
