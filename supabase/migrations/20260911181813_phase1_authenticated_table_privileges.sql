-- Grant only the table privileges required by the authenticated learning flows.
-- RLS remains the authorization boundary for every table below.

grant select on table public.courses to authenticated;

grant select, insert on table public.enrollments to authenticated;

grant select, insert, update on table public.lesson_progress to authenticated;
