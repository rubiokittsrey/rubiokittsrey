alter table public.photographs
    add column if not exists year  integer,
    add column if not exists month integer,
    add column if not exists day   integer;

update public.photographs
set
    year  = extract(year  from date)::int,
    month = extract(month from date)::int,
    day   = extract(day   from date)::int
where date is not null and year is null;

alter table public.photographs
    alter column year set not null;

alter table public.photographs
    drop constraint if exists photographs_month_check,
    add  constraint photographs_month_check check (month is null or (month between 1 and 12));

alter table public.photographs
    drop constraint if exists photographs_day_check,
    add  constraint photographs_day_check check (day is null or (day between 1 and 31));

drop index if exists photographs_date_idx;

create index if not exists photographs_year_idx
    on public.photographs (year desc, month desc nulls last, day desc nulls last);

alter table public.photographs drop column if exists date;
