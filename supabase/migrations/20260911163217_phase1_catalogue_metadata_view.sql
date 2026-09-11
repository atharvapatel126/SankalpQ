-- Phase 1 catalogue metadata projection.
--
-- This view intentionally runs with the view owner's privileges (the default
-- PostgreSQL view behavior).  Do not add security_invoker = true: the purpose
-- of this column-limited projection is to expose catalogue metadata without
-- weakening the base lessons RLS policy or exposing protected lesson content.
--
-- Rollback: drop view if exists public.published_course_catalogue;

create or replace view public.published_course_catalogue
with (
  security_barrier = true,
  security_invoker = false
)
as
select
  c.id as course_id,
  c.legacy_id as course_legacy_id,
  c.slug as course_slug,
  c.title as course_title,
  c.description as course_description,
  c.outcome as course_outcome,
  c.level as course_level,
  cm.id as module_id,
  cm.legacy_id as module_legacy_id,
  cm.title as module_title,
  cm.description as module_description,
  cm.position as module_position,
  l.id as lesson_id,
  l.legacy_id as lesson_legacy_id,
  l.slug as lesson_slug,
  l.title as lesson_title,
  l.description as lesson_description,
  l.summary as lesson_summary,
  l.position as lesson_position,
  l.status as lesson_status
from public.courses as c
join public.course_modules as cm
  on cm.course_id = c.id
join public.lessons as l
  on l.module_id = cm.id
where c.status = 'published';

-- The catalogue is intentionally readable only by authenticated clients.
-- No write privilege is granted, and anon/public access is explicitly removed.
revoke all on table public.published_course_catalogue from public;
revoke all on table public.published_course_catalogue from anon;
grant select on table public.published_course_catalogue to authenticated;
