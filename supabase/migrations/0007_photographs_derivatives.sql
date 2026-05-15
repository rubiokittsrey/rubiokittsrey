alter table public.photographs
    add column if not exists thumb_path text,
    add column if not exists blur       text;
