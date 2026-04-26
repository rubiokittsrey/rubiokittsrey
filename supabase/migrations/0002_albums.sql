create extension if not exists "pgcrypto";

create table if not exists public.albums (
    id            uuid primary key default gen_random_uuid(),
    slug          text not null unique,
    title         text not null,
    description   text,
    cover_image   text not null,
    date          timestamptz,
    location      text,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create index if not exists albums_date_idx
    on public.albums (date desc nulls last);

create table if not exists public.photographs (
    id            uuid primary key default gen_random_uuid(),
    album_id      uuid not null references public.albums(id) on delete cascade,
    url           text not null,
    title         text not null,
    description   text,
    coordinates   jsonb,
    position      integer not null default 0,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create index if not exists photographs_album_position_idx
    on public.photographs (album_id, position);

drop trigger if exists albums_set_updated_at on public.albums;
create trigger albums_set_updated_at
    before update on public.albums
    for each row execute function public.set_updated_at();

drop trigger if exists photographs_set_updated_at on public.photographs;
create trigger photographs_set_updated_at
    before update on public.photographs
    for each row execute function public.set_updated_at();

alter table public.albums enable row level security;
alter table public.photographs enable row level security;

drop policy if exists "public reads albums" on public.albums;
create policy "public reads albums"
    on public.albums for select
    to anon
    using (true);

drop policy if exists "authed reads albums" on public.albums;
create policy "authed reads albums"
    on public.albums for select
    to authenticated
    using (true);

drop policy if exists "authed inserts albums" on public.albums;
create policy "authed inserts albums"
    on public.albums for insert
    to authenticated
    with check (true);

drop policy if exists "authed updates albums" on public.albums;
create policy "authed updates albums"
    on public.albums for update
    to authenticated
    using (true)
    with check (true);

drop policy if exists "authed deletes albums" on public.albums;
create policy "authed deletes albums"
    on public.albums for delete
    to authenticated
    using (true);

drop policy if exists "public reads photographs" on public.photographs;
create policy "public reads photographs"
    on public.photographs for select
    to anon
    using (true);

drop policy if exists "authed reads photographs" on public.photographs;
create policy "authed reads photographs"
    on public.photographs for select
    to authenticated
    using (true);

drop policy if exists "authed inserts photographs" on public.photographs;
create policy "authed inserts photographs"
    on public.photographs for insert
    to authenticated
    with check (true);

drop policy if exists "authed updates photographs" on public.photographs;
create policy "authed updates photographs"
    on public.photographs for update
    to authenticated
    using (true)
    with check (true);

drop policy if exists "authed deletes photographs" on public.photographs;
create policy "authed deletes photographs"
    on public.photographs for delete
    to authenticated
    using (true);
