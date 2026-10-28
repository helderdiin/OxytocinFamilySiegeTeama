alter table public.strategy_comments
add column if not exists updated_at timestamptz;

create or replace function public.set_strategy_comment_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists strategy_comments_set_updated_at on public.strategy_comments;
create trigger strategy_comments_set_updated_at
before update of body, video_url, reaction on public.strategy_comments
for each row execute function public.set_strategy_comment_updated_at();

revoke update on table public.strategy_comments from authenticated;
grant update (body, video_url, reaction) on table public.strategy_comments to authenticated;

drop policy if exists "Users can update their strategy comments" on public.strategy_comments;
create policy "Users can update their strategy comments"
on public.strategy_comments for update
to authenticated
using ((select auth.uid()) = author_id)
with check ((select auth.uid()) = author_id);
