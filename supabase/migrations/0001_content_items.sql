create extension if not exists "pgcrypto";

create table if not exists public.content_items (
    id            uuid primary key default gen_random_uuid(),
    type          text not null check (type in ('gallery', 'project', 'blog')),
    slug          text not null,
    title         text not null,
    description   text,
    body          text,
    cover_image   text,
    media         text[] not null default '{}',
    tags          text[] not null default '{}',
    status        text not null default 'draft' check (status in ('draft', 'published')),
    published_at  timestamptz,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now(),
    unique (type, slug)
);

create index if not exists content_items_type_status_idx
    on public.content_items (type, status);

create index if not exists content_items_published_at_idx
    on public.content_items (published_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists content_items_set_updated_at on public.content_items;
create trigger content_items_set_updated_at
    before update on public.content_items
    for each row execute function public.set_updated_at();

alter table public.content_items enable row level security;

drop policy if exists "public reads published" on public.content_items;
create policy "public reads published"
    on public.content_items for select
    to anon
    using (status = 'published');

drop policy if exists "authed reads all" on public.content_items;
create policy "authed reads all"
    on public.content_items for select
    to authenticated
    using (true);

drop policy if exists "authed inserts" on public.content_items;
create policy "authed inserts"
    on public.content_items for insert
    to authenticated
    with check (true);

drop policy if exists "authed updates" on public.content_items;
create policy "authed updates"
    on public.content_items for update
    to authenticated
    using (true)
    with check (true);

drop policy if exists "authed deletes" on public.content_items;
create policy "authed deletes"
    on public.content_items for delete
    to authenticated
    using (true);
