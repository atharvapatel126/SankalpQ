-- SankalpQ Phase 1 learning architecture
-- This migration is additive and intentionally does not drop tables or delete data.
-- It must be reviewed and applied through the Supabase migration workflow.

create extension if not exists pgcrypto;

-- New-user profiles must default to student. Existing profile rows are not changed.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'display_name', '')), ''),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Keep the existing trigger name/behavior while preventing client role escalation.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Pin the search path for the existing timestamp trigger function.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.profiles
  add column if not exists role text not null default 'student',
  add column if not exists avatar_url text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('student', 'instructor'));
  end if;
end;
$$;

create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  if old.role is distinct from new.role
     and current_user not in ('postgres', 'service_role') then
    raise exception 'profile roles may only be changed by a trusted server operation';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_role_immutable on public.profiles;
create trigger profiles_role_immutable
  before update on public.profiles
  for each row execute procedure public.prevent_profile_role_change();

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  legacy_id text not null unique,
  slug text not null unique,
  title text not null,
  description text,
  outcome text,
  level integer,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  instructor_id uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  legacy_id text not null unique,
  title text not null,
  description text,
  position integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, position)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  legacy_id text not null unique,
  slug text not null,
  title text not null,
  description text,
  summary text,
  introduction text,
  core_explanation jsonb not null default '[]'::jsonb,
  key_points jsonb not null default '[]'::jsonb,
  formula jsonb,
  visual jsonb,
  interactive jsonb,
  builder_exercise jsonb,
  quiz jsonb,
  position integer not null,
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug),
  unique (module_id, position)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  status text not null default 'active'
    check (status in ('active', 'completed', 'withdrawn')),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.lesson_progress
  add column if not exists lesson_uuid uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.lesson_progress'::regclass
      and conname = 'lesson_progress_lesson_uuid_fkey'
  ) then
    alter table public.lesson_progress
      add constraint lesson_progress_lesson_uuid_fkey
      foreign key (lesson_uuid) references public.lessons(id);
  end if;
end;
$$;

-- Seed the four reviewed static courses under the oldest existing instructor.
-- This is deterministic and does not create or alter a profile.
do $$
begin
  if not exists (select 1 from public.profiles where role = 'instructor') then
    raise exception 'Phase 1 requires at least one existing instructor profile';
  end if;
end;
$$;

insert into public.courses
  (legacy_id, slug, title, description, outcome, level, status, instructor_id)
select seed.legacy_id, seed.slug, seed.title, seed.description, seed.outcome,
       seed.level, 'published', owner.id
from (
  values
    ('course-fundamentals', 'quantum-fundamentals', 'Quantum Fundamentals',
     'Build a precise mental model of qubits, amplitudes, superposition, and measurement.',
     'Read a single-qubit state and connect its amplitudes to measurement probabilities.', 1),
    ('course-gates', 'quantum-gates', 'Quantum Gates',
     'Learn how common single-qubit gates control bit values, phase, and rotations.',
     'Predict the action of Pauli, Hadamard, phase, and rotation gates on simple states.', 2),
    ('course-circuits', 'quantum-circuits', 'Quantum Circuits',
     'Combine gates across multiple qubits to create correlation and entanglement.',
     'Read multi-qubit circuit diagrams and explain how CNOT creates Bell and GHZ states.', 3),
    ('course-algorithms', 'quantum-algorithms', 'Quantum Algorithms',
     'See how superposition, phase, and interference combine into useful procedures.',
     'Explain the central mechanism and limits of Deutsch-Jozsa, Grover search, and the QFT.', 4)
) as seed(legacy_id, slug, title, description, outcome, level)
cross join lateral (
  select p.id
  from public.profiles p
  where p.role = 'instructor'
  order by p.created_at nulls first, p.id
  limit 1
) owner
on conflict (legacy_id) do update set
  slug = excluded.slug,
  title = excluded.title,
  description = excluded.description,
  outcome = excluded.outcome,
  level = excluded.level;

insert into public.course_modules (course_id, legacy_id, title, description, position)
select c.id, c.legacy_id || ':module-1', c.title || ' — Core lessons',
       'Guided lessons from the existing SankalpQ curriculum.', 1
from public.courses c
where c.legacy_id in ('course-fundamentals', 'course-gates', 'course-circuits', 'course-algorithms')
on conflict (legacy_id) do update set
  course_id = excluded.course_id,
  title = excluded.title,
  description = excluded.description,
  position = excluded.position;

-- The structured lesson columns preserve the fields consumed by the current lesson model.
-- Rich lesson JSON is intentionally seeded only from reviewed static identifiers here;
-- application cutover must populate the structured content from course-data.ts before use.
insert into public.lessons
  (module_id, legacy_id, slug, title, description, summary, position, status)
select m.id, v.legacy_id, v.slug, v.title, v.summary, v.summary, v.position, 'published'
from (
  values
    ('quantum-fundamentals:introduction-to-quantum-computing', 'introduction-to-quantum-computing', 'Introduction to Quantum Computing', 'Understand what makes a quantum computation different.', 1, 'course-fundamentals'),
    ('quantum-fundamentals:classical-bit-vs-qubit', 'classical-bit-vs-qubit', 'Classical Bit vs Qubit', 'Compare definite classical values with quantum states.', 2, 'course-fundamentals'),
    ('quantum-fundamentals:qubit-states', 'qubit-states', 'Qubit States', 'Read basis states and the geometry of a pure qubit.', 3, 'course-fundamentals'),
    ('quantum-fundamentals:superposition', 'superposition', 'Superposition', 'Connect amplitudes, phase, and probabilistic outcomes.', 4, 'course-fundamentals'),
    ('quantum-fundamentals:quantum-measurement', 'quantum-measurement', 'Quantum Measurement', 'Use the Born rule to predict observed outcomes.', 5, 'course-fundamentals'),
    ('quantum-gates:introduction-to-quantum-gates', 'introduction-to-quantum-gates', 'Introduction to Quantum Gates', 'Treat gates as reversible transformations of quantum states.', 1, 'course-gates'),
    ('quantum-gates:pauli-x-gate', 'pauli-x-gate', 'Pauli X Gate', 'Use the quantum bit-flip operation.', 2, 'course-gates'),
    ('quantum-gates:pauli-y-gate', 'pauli-y-gate', 'Pauli Y Gate', 'Combine a bit flip with a phase change.', 3, 'course-gates'),
    ('quantum-gates:pauli-z-gate', 'pauli-z-gate', 'Pauli Z Gate', 'Change relative phase without flipping basis values.', 4, 'course-gates'),
    ('quantum-gates:hadamard-gate', 'hadamard-gate', 'Hadamard Gate', 'Move between computational and diagonal bases.', 5, 'course-gates'),
    ('quantum-gates:phase-gates', 'phase-gates', 'Phase Gates', 'Apply controlled quarter- and eighth-turn phase shifts.', 6, 'course-gates'),
    ('quantum-gates:rotation-gates', 'rotation-gates', 'Rotation Gates', 'Control qubits with continuous angles.', 7, 'course-gates'),
    ('quantum-circuits:quantum-circuit-basics', 'quantum-circuit-basics', 'Quantum Circuit Basics', 'Read wires, gates, time order, and measurements.', 1, 'course-circuits'),
    ('quantum-circuits:multiple-qubits', 'multiple-qubits', 'Multiple Qubits', 'Represent joint states with tensor products.', 2, 'course-circuits'),
    ('quantum-circuits:cnot-gate', 'cnot-gate', 'CNOT Gate', 'Control a target flip with another qubit.', 3, 'course-circuits'),
    ('quantum-circuits:entanglement', 'entanglement', 'Entanglement', 'Recognize correlations that cannot be separated.', 4, 'course-circuits'),
    ('quantum-circuits:bell-states', 'bell-states', 'Bell States', 'Prepare and distinguish maximally entangled pairs.', 5, 'course-circuits'),
    ('quantum-algorithms:deutsch-jozsa-algorithm', 'deutsch-jozsa-algorithm', 'Deutsch-Jozsa Algorithm', 'Distinguish promised constant and balanced functions.', 1, 'course-algorithms'),
    ('quantum-algorithms:grovers-algorithm', 'grovers-algorithm', 'Grover''s Algorithm', 'Amplify a marked item in an unstructured search.', 2, 'course-algorithms'),
    ('quantum-algorithms:quantum-fourier-transform', 'quantum-fourier-transform', 'Quantum Fourier Transform', 'Convert computational patterns into quantum phase patterns.', 3, 'course-algorithms')
) as v(legacy_id, slug, title, summary, position, course_legacy_id)
join public.course_modules m on m.legacy_id = v.course_legacy_id || ':module-1'
on conflict (legacy_id) do update set
  module_id = excluded.module_id,
  slug = excluded.slug,
  title = excluded.title,
  description = excluded.description,
  summary = excluded.summary,
  position = excluded.position;

-- Preserve every existing progress row and only add the canonical lesson reference.
update public.lesson_progress lp
set lesson_uuid = l.id
from public.lessons l
join public.course_modules cm on cm.id = l.module_id
join public.courses c on c.id = cm.course_id
where lp.lesson_uuid is null
  and l.legacy_id = lp.lesson_id
  and c.legacy_id = lp.course_id;

do $$
declare
  missing_count integer;
  mismatch_count integer;
begin
  select count(*) into missing_count
  from public.lesson_progress
  where lesson_uuid is null;
  if missing_count > 0 then
    raise exception 'Phase 1 lesson_progress backfill incomplete: % rows unmapped', missing_count;
  end if;

  select count(*) into mismatch_count
  from public.lesson_progress lp
  join public.lessons l on l.id = lp.lesson_uuid
  join public.course_modules cm on cm.id = l.module_id
  join public.courses c on c.id = cm.course_id
  where lp.course_id is distinct from c.legacy_id;
  if mismatch_count > 0 then
    raise exception 'Phase 1 lesson_progress backfill has % course mismatches', mismatch_count;
  end if;
end;
$$;

do $$
begin
  if (select count(*) from public.lessons
      where legacy_id in (
        'quantum-fundamentals:introduction-to-quantum-computing',
        'quantum-fundamentals:classical-bit-vs-qubit',
        'quantum-fundamentals:qubit-states',
        'quantum-fundamentals:superposition',
        'quantum-fundamentals:quantum-measurement',
        'quantum-gates:introduction-to-quantum-gates',
        'quantum-gates:pauli-x-gate',
        'quantum-gates:pauli-y-gate',
        'quantum-gates:pauli-z-gate',
        'quantum-gates:hadamard-gate',
        'quantum-gates:phase-gates',
        'quantum-gates:rotation-gates',
        'quantum-circuits:quantum-circuit-basics',
        'quantum-circuits:multiple-qubits',
        'quantum-circuits:cnot-gate',
        'quantum-circuits:entanglement',
        'quantum-circuits:bell-states',
        'quantum-algorithms:deutsch-jozsa-algorithm',
        'quantum-algorithms:grovers-algorithm',
        'quantum-algorithms:quantum-fourier-transform'
      )) <> 20 then
    raise exception 'Phase 1 lesson seed validation failed: expected 20 lessons';
  end if;
end;
$$;

insert into public.enrollments (user_id, course_id, status)
select distinct lp.user_id, c.id, 'active'
from public.lesson_progress lp
join public.lessons l on l.id = lp.lesson_uuid
join public.course_modules cm on cm.id = l.module_id
join public.courses c on c.id = cm.course_id
on conflict (user_id, course_id) do nothing;

create index if not exists courses_instructor_id_idx on public.courses (instructor_id);
create index if not exists courses_status_idx on public.courses (status);
create index if not exists course_modules_course_position_idx on public.course_modules (course_id, position);
create index if not exists lessons_module_position_idx on public.lessons (module_id, position);
create index if not exists enrollments_user_status_idx on public.enrollments (user_id, status);
create index if not exists enrollments_course_status_idx on public.enrollments (course_id, status);
create index if not exists lesson_progress_user_updated_idx on public.lesson_progress (user_id, updated_at desc);
create index if not exists lesson_progress_lesson_uuid_idx on public.lesson_progress (lesson_uuid);
create unique index if not exists lesson_progress_user_lesson_uuid_uidx
  on public.lesson_progress (user_id, lesson_uuid)
  where lesson_uuid is not null;

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select p.role from public.profiles p where p.id = (select auth.uid());
$$;

revoke all on function public.current_profile_role() from public;
grant execute on function public.current_profile_role() to authenticated;

-- Replace policies only on Phase 1 tables. Unrelated Phase 2 tables are untouched.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles', 'lesson_progress', 'courses', 'course_modules', 'lessons', 'enrollments')
  loop
    execute format('drop policy if exists %I on public.%I', policy_record.policyname, policy_record.tablename);
  end loop;
end;
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

create policy profiles_update_safe_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()) and role = public.current_profile_role());

revoke update (role) on public.profiles from authenticated;
grant update (display_name, preferred_language, avatar_url) on public.profiles to authenticated;

create policy courses_select_published on public.courses
  for select to authenticated
  using (status = 'published' or instructor_id = (select auth.uid()));

create policy courses_insert_owned on public.courses
  for insert to authenticated
  with check (
    instructor_id = (select auth.uid())
    and public.current_profile_role() = 'instructor'
  );

create policy courses_update_owned on public.courses
  for update to authenticated
  using (instructor_id = (select auth.uid()) and public.current_profile_role() = 'instructor')
  with check (instructor_id = (select auth.uid()) and public.current_profile_role() = 'instructor');

create policy courses_delete_owned on public.courses
  for delete to authenticated
  using (instructor_id = (select auth.uid()) and public.current_profile_role() = 'instructor');

create policy modules_select_visible on public.course_modules
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_id
        and (c.status = 'published' or c.instructor_id = (select auth.uid()))
    )
  );

create policy modules_manage_owned on public.course_modules
  for all to authenticated
  using (
    public.current_profile_role() = 'instructor'
    and exists (select 1 from public.courses c where c.id = course_id and c.instructor_id = (select auth.uid()))
  )
  with check (
    public.current_profile_role() = 'instructor'
    and exists (select 1 from public.courses c where c.id = course_id and c.instructor_id = (select auth.uid()))
  );

-- Lesson rows contain learning content, so students see them only after enrollment.
create policy lessons_select_enrolled_or_owned on public.lessons
  for select to authenticated
  using (
    exists (
      select 1
      from public.course_modules cm
      join public.courses c on c.id = cm.course_id
      where cm.id = module_id
        and (
          c.instructor_id = (select auth.uid())
          or exists (
            select 1 from public.enrollments e
            where e.course_id = c.id
              and e.user_id = (select auth.uid())
              and e.status = 'active'
          )
        )
    )
  );

create policy lessons_manage_owned on public.lessons
  for all to authenticated
  using (
    public.current_profile_role() = 'instructor'
    and exists (
      select 1 from public.course_modules cm
      join public.courses c on c.id = cm.course_id
      where cm.id = module_id and c.instructor_id = (select auth.uid())
    )
  )
  with check (
    public.current_profile_role() = 'instructor'
    and exists (
      select 1 from public.course_modules cm
      join public.courses c on c.id = cm.course_id
      where cm.id = module_id and c.instructor_id = (select auth.uid())
    )
  );

create policy enrollments_select_own_or_owned on public.enrollments
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (select 1 from public.courses c where c.id = course_id and c.instructor_id = (select auth.uid()))
  );

create policy enrollments_insert_own on public.enrollments
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and public.current_profile_role() = 'student'
    and exists (select 1 from public.courses c where c.id = course_id and c.status = 'published')
  );

create policy progress_select_own_or_owned on public.lesson_progress
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.lessons l
      join public.course_modules cm on cm.id = l.module_id
      join public.courses c on c.id = cm.course_id
      where l.id = lesson_uuid
        and c.instructor_id = (select auth.uid())
    )
    or exists (
      select 1 from public.lessons l
      join public.course_modules cm on cm.id = l.module_id
      join public.courses c on c.id = cm.course_id
      where lesson_uuid is null
        and l.legacy_id = lesson_progress.lesson_id
        and c.legacy_id = lesson_progress.course_id
        and c.instructor_id = (select auth.uid())
    )
  );

create policy progress_insert_own on public.lesson_progress
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (
      (
        lesson_uuid is not null
        and exists (
          select 1
          from public.enrollments e
          join public.lessons l on l.id = lesson_uuid
          join public.course_modules cm on cm.id = l.module_id
          join public.courses c on c.id = cm.course_id
          where e.user_id = (select auth.uid())
            and e.course_id = c.id
            and e.status = 'active'
            and (course_id is null or course_id = c.legacy_id)
        )
      )
      or (
        lesson_uuid is null
        and exists (
          select 1
          from public.enrollments e
          join public.lessons l on l.legacy_id = lesson_id
          join public.course_modules cm on cm.id = l.module_id
          join public.courses c on c.id = cm.course_id
          where e.user_id = (select auth.uid())
            and e.course_id = c.id
            and e.status = 'active'
            and c.legacy_id = course_id
        )
      )
    )
  );

create policy progress_update_own on public.lesson_progress
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and (
      (
        lesson_uuid is not null
        and exists (
          select 1
          from public.enrollments e
          join public.lessons l on l.id = lesson_uuid
          join public.course_modules cm on cm.id = l.module_id
          where e.user_id = (select auth.uid())
            and e.course_id = cm.course_id
            and e.status = 'active'
        )
      )
      or (
        lesson_uuid is null
        and exists (
          select 1
          from public.enrollments e
          join public.lessons l on l.legacy_id = lesson_id
          join public.course_modules cm on cm.id = l.module_id
          join public.courses c on c.id = cm.course_id
          where e.user_id = (select auth.uid())
            and e.course_id = c.id
            and e.status = 'active'
            and c.legacy_id = course_id
        )
      )
    )
  );

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.set_updated_at() from public;
