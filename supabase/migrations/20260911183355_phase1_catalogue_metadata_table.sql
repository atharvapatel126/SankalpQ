-- Replace the owner-executed catalogue projection with a safe metadata table
-- and an invoker-security view. Rich lesson content remains protected by the
-- existing lessons table and RLS policies.

create table if not exists public.course_catalogue_metadata (
  course_id uuid not null references public.courses(id) on delete cascade,
  course_legacy_id text not null,
  course_slug text not null,
  course_title text not null,
  course_description text,
  course_outcome text,
  course_level integer,
  module_id uuid not null references public.course_modules(id) on delete cascade,
  module_legacy_id text not null,
  module_title text not null,
  module_description text,
  module_position integer not null,
  lesson_id uuid primary key references public.lessons(id) on delete cascade,
  lesson_legacy_id text not null,
  lesson_slug text not null,
  lesson_title text not null,
  lesson_description text,
  lesson_summary text,
  lesson_position integer not null,
  lesson_status text not null
    check (lesson_status in ('draft', 'published', 'archived'))
);

create index if not exists course_catalogue_metadata_course_idx
  on public.course_catalogue_metadata (course_id);

create index if not exists course_catalogue_metadata_module_position_idx
  on public.course_catalogue_metadata (course_id, module_position, lesson_position);

-- Idempotent initial synchronization for the Phase 1 seeded catalogue.
insert into public.course_catalogue_metadata (
  course_id,
  course_legacy_id,
  course_slug,
  course_title,
  course_description,
  course_outcome,
  course_level,
  module_id,
  module_legacy_id,
  module_title,
  module_description,
  module_position,
  lesson_id,
  lesson_legacy_id,
  lesson_slug,
  lesson_title,
  lesson_description,
  lesson_summary,
  lesson_position,
  lesson_status
)
select
  c.id,
  c.legacy_id,
  c.slug,
  c.title,
  c.description,
  c.outcome,
  c.level,
  cm.id,
  cm.legacy_id,
  cm.title,
  cm.description,
  cm.position,
  l.id,
  l.legacy_id,
  l.slug,
  l.title,
  l.description,
  l.summary,
  l.position,
  l.status
from public.courses as c
join public.course_modules as cm
  on cm.course_id = c.id
join public.lessons as l
  on l.module_id = cm.id
where c.status = 'published'
on conflict (lesson_id) do update set
  course_id = excluded.course_id,
  course_legacy_id = excluded.course_legacy_id,
  course_slug = excluded.course_slug,
  course_title = excluded.course_title,
  course_description = excluded.course_description,
  course_outcome = excluded.course_outcome,
  course_level = excluded.course_level,
  module_id = excluded.module_id,
  module_legacy_id = excluded.module_legacy_id,
  module_title = excluded.module_title,
  module_description = excluded.module_description,
  module_position = excluded.module_position,
  lesson_legacy_id = excluded.lesson_legacy_id,
  lesson_slug = excluded.lesson_slug,
  lesson_title = excluded.lesson_title,
  lesson_description = excluded.lesson_description,
  lesson_summary = excluded.lesson_summary,
  lesson_position = excluded.lesson_position,
  lesson_status = excluded.lesson_status;

alter table public.course_catalogue_metadata enable row level security;

drop policy if exists course_catalogue_metadata_select_published
  on public.course_catalogue_metadata;
create policy course_catalogue_metadata_select_published
  on public.course_catalogue_metadata
  for select to authenticated
  using (
    exists (
      select 1
      from public.courses as c
      where c.id = course_id
        and c.status = 'published'
    )
  );

revoke all on table public.course_catalogue_metadata from public;
revoke all on table public.course_catalogue_metadata from anon;
grant select on table public.course_catalogue_metadata to authenticated;

-- Keep the existing application-facing relation name while making the view
-- execute with the querying user's privileges. The view reads only from the
-- metadata table, never from rich lesson-content columns.
create or replace view public.published_course_catalogue
with (
  security_barrier = true,
  security_invoker = true
)
as
select
  course_id,
  course_legacy_id,
  course_slug,
  course_title,
  course_description,
  course_outcome,
  course_level,
  module_id,
  module_legacy_id,
  module_title,
  module_description,
  module_position,
  lesson_id,
  lesson_legacy_id,
  lesson_slug,
  lesson_title,
  lesson_description,
  lesson_summary,
  lesson_position,
  lesson_status
from public.course_catalogue_metadata;

revoke all on table public.published_course_catalogue from public;
revoke all on table public.published_course_catalogue from anon;
grant select on table public.published_course_catalogue to authenticated;
