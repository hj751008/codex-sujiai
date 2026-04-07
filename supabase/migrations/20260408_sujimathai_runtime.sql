create extension if not exists pgcrypto;

create table if not exists public.parent_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  family_name text not null check (char_length(trim(family_name)) > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.learner_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parent_profiles (id) on delete cascade,
  learner_name text not null check (char_length(trim(learner_name)) > 0),
  grade text not null check (grade in ('middle-1', 'middle-2', 'middle-3')),
  pin_hash text not null,
  pin_hint text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists learner_profiles_parent_id_idx
  on public.learner_profiles (parent_id, created_at desc);

create table if not exists public.learner_pin_sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learner_profiles (id) on delete cascade,
  session_token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists learner_pin_sessions_lookup_idx
  on public.learner_pin_sessions (session_token, expires_at desc);

create table if not exists public.learner_sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learner_profiles (id) on delete cascade,
  parent_id uuid not null references public.parent_profiles (id) on delete cascade,
  unit_id text not null,
  unit_title text not null,
  session_status text not null default 'active'
    check (session_status in ('active', 'completed')),
  latest_mode text,
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create index if not exists learner_sessions_parent_id_idx
  on public.learner_sessions (parent_id, started_at desc);

create table if not exists public.session_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.learner_sessions (id) on delete cascade,
  speaker text not null check (speaker in ('learner', 'tutor')),
  content text not null,
  concept_tags jsonb not null default '[]'::jsonb,
  next_question text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists session_messages_session_id_idx
  on public.session_messages (session_id, created_at asc);

create table if not exists public.session_reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.learner_sessions (id) on delete cascade,
  learner_id uuid not null references public.learner_profiles (id) on delete cascade,
  parent_id uuid not null references public.parent_profiles (id) on delete cascade,
  learner_name text not null,
  session_summary text not null,
  blocked_concepts jsonb not null default '[]'::jsonb,
  confidence_notes jsonb not null default '[]'::jsonb,
  next_recommendations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists session_reports_parent_id_idx
  on public.session_reports (parent_id, created_at desc);

alter table public.parent_profiles enable row level security;
alter table public.learner_profiles enable row level security;
alter table public.learner_sessions enable row level security;
alter table public.session_messages enable row level security;
alter table public.session_reports enable row level security;

drop policy if exists "parent profiles are owner scoped" on public.parent_profiles;
create policy "parent profiles are owner scoped"
  on public.parent_profiles
  for all
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "learner profiles are parent scoped" on public.learner_profiles;
create policy "learner profiles are parent scoped"
  on public.learner_profiles
  for select
  to authenticated
  using (parent_id = auth.uid());

drop policy if exists "parent can manage learner profiles" on public.learner_profiles;
create policy "parent can manage learner profiles"
  on public.learner_profiles
  for update
  to authenticated
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

drop policy if exists "parent can read learner sessions" on public.learner_sessions;
create policy "parent can read learner sessions"
  on public.learner_sessions
  for select
  to authenticated
  using (parent_id = auth.uid());

drop policy if exists "parent can read session messages" on public.session_messages;
create policy "parent can read session messages"
  on public.session_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.learner_sessions sessions
      where sessions.id = session_messages.session_id
        and sessions.parent_id = auth.uid()
    )
  );

drop policy if exists "parent can read session reports" on public.session_reports;
create policy "parent can read session reports"
  on public.session_reports
  for select
  to authenticated
  using (parent_id = auth.uid());

create or replace function public.create_learner_profile(
  p_learner_name text,
  p_grade text,
  p_pin text
)
returns table (
  id uuid,
  parent_id uuid,
  learner_name text,
  grade text,
  pin_hint text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent_id uuid := auth.uid();
  v_normalized_pin text := regexp_replace(coalesce(p_pin, ''), '\D', '', 'g');
begin
  if v_parent_id is null then
    raise exception 'Authenticated parent session required.';
  end if;

  if char_length(v_normalized_pin) <> 4 then
    raise exception 'Learner PIN must be exactly 4 digits.';
  end if;

  insert into public.learner_profiles (
    parent_id,
    learner_name,
    grade,
    pin_hash,
    pin_hint
  )
  values (
    v_parent_id,
    trim(p_learner_name),
    p_grade,
    crypt(v_normalized_pin, gen_salt('bf')),
    '**' || right(v_normalized_pin, 2)
  )
  returning
    learner_profiles.id,
    learner_profiles.parent_id,
    learner_profiles.learner_name,
    learner_profiles.grade,
    learner_profiles.pin_hint,
    learner_profiles.created_at
  into id, parent_id, learner_name, grade, pin_hint, created_at;

  return next;
end;
$$;

grant execute on function public.create_learner_profile(text, text, text) to authenticated;

create or replace function public.verify_learner_pin(
  p_learner_id uuid,
  p_pin text
)
returns table (
  session_token text,
  learner_id uuid,
  learner_name text,
  grade text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_normalized_pin text := regexp_replace(coalesce(p_pin, ''), '\D', '', 'g');
begin
  delete from public.learner_pin_sessions
  where expires_at < timezone('utc', now());

  return query
  with verified as (
    select id, learner_name, grade
    from public.learner_profiles
    where id = p_learner_id
      and crypt(v_normalized_pin, pin_hash) = pin_hash
  ), inserted as (
    insert into public.learner_pin_sessions (
      learner_id,
      session_token,
      expires_at
    )
    select
      verified.id,
      encode(gen_random_bytes(24), 'hex'),
      timezone('utc', now()) + interval '12 hours'
    from verified
    returning learner_id, session_token, expires_at
  )
  select
    inserted.session_token,
    verified.id,
    verified.learner_name,
    verified.grade,
    inserted.expires_at
  from inserted
  join verified on verified.id = inserted.learner_id;

  if not found then
    raise exception 'Learner PIN verification failed.';
  end if;
end;
$$;

grant execute on function public.verify_learner_pin(uuid, text) to anon, authenticated;

create or replace function public.resolve_learner_pin_session(
  p_session_token text
)
returns table (
  learner_id uuid,
  parent_id uuid,
  learner_name text,
  grade text
)
language sql
security definer
set search_path = public
as $$
  select
    learners.id,
    learners.parent_id,
    learners.learner_name,
    learners.grade
  from public.learner_pin_sessions pin_sessions
  join public.learner_profiles learners
    on learners.id = pin_sessions.learner_id
  where pin_sessions.session_token = p_session_token
    and pin_sessions.expires_at >= timezone('utc', now())
  limit 1;
$$;

grant execute on function public.resolve_learner_pin_session(text) to anon, authenticated;
