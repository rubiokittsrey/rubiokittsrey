-- 2048px-wide webp display derivatives: served via srcset next to the 800px thumb, so
-- retina screens get a sharp image without downloading the multi-MB originals.
alter table public.albums
    add column if not exists cover_display text;

alter table public.photographs
    add column if not exists display_path text;
