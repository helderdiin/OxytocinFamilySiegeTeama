alter table public.strategy_comments
add column if not exists video_url text;

alter table public.strategy_comments
drop constraint if exists strategy_comments_video_url_check;

alter table public.strategy_comments
add constraint strategy_comments_video_url_check check (
  video_url is null
  or (
    char_length(video_url) <= 200
    and video_url ~ '^https://youtu[.]be/[A-Za-z0-9_-]{11}$'
  )
);
