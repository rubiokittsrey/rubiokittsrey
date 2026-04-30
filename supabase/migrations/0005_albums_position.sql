alter table public.albums
    add column if not exists position integer;

with ordered as (
    select id, row_number() over (order by updated_at desc) - 1 as rn
    from public.albums
    where position is null
)
update public.albums a
set position = ordered.rn
from ordered
where a.id = ordered.id;

alter table public.albums
    alter column position set default 0;

alter table public.albums
    alter column position set not null;

create index if not exists albums_position_idx
    on public.albums (position);
