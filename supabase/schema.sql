-- Mumbai Jobz V1: source-of-truth job records for map aggregation
create extension if not exists pgcrypto;

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null,
  title text not null,
  skill text not null,
  area text not null,
  city text not null default 'Mumbai',
  latitude double precision not null,
  longitude double precision not null,
  salary_min integer,
  salary_max integer,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','pending_payment','active','paused','expired','filled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','failed','refunded')),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists jobs_public_map_idx on public.jobs(city, status, area, skill);
create index if not exists jobs_created_at_idx on public.jobs(created_at desc);

-- Public map counts: only active jobs are counted.
create or replace view public.public_job_counts as
select
  city,
  count(*)::int as total_jobs,
  count(*) filter (where area is not null)::int as mapped_jobs
from public.jobs
where status = 'active'
group by city;

create or replace view public.public_area_skill_counts as
select
  city,
  area,
  skill,
  count(*)::int as job_count
from public.jobs
where status = 'active'
group by city, area, skill;

create or replace view public.public_area_counts as
select
  city,
  area,
  count(*)::int as job_count
from public.jobs
where status = 'active'
group by city, area;
