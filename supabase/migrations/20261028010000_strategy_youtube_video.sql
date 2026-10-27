create or replace function public.valid_strategy_video_url(strategy_sections jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  video_url text;
begin
  if not (strategy_sections ? 'videoUrl') then
    return true;
  end if;

  if jsonb_typeof(strategy_sections -> 'videoUrl') <> 'string' then
    return false;
  end if;

  video_url := btrim(strategy_sections ->> 'videoUrl');
  if video_url = '' then
    return true;
  end if;

  return char_length(video_url) <= 200
    and video_url ~ '^https://youtu\.be/[A-Za-z0-9_-]{11}$';
exception
  when others then
    return false;
end;
$$;

alter table public.strategies
add constraint strategies_youtube_video_check check (
  public.valid_strategy_video_url(sections)
);

update public.strategies
set sections = jsonb_set(
  sections,
  '{videoUrl}',
  to_jsonb('https://youtu.be/4i-BoXLldhc'::text),
  true
)
where source_key = 'siege-team-helper:aragorn-racuni-gyomei-vs-sylvia-daphnis';

revoke all on function public.valid_strategy_video_url(jsonb) from public;
grant execute on function public.valid_strategy_video_url(jsonb) to authenticated;
