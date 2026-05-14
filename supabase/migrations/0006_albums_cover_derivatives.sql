alter table public.albums
    add column if not exists cover_thumb text,
    add column if not exists cover_blur  text;
