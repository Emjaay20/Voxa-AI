-- ==========================================================
-- VOXA CORE DATABASE
-- Migration: 001_core.sql
-- ==========================================================

create extension if not exists pgcrypto;

-- ==========================================================
-- UPDATED_AT HELPER
-- ==========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

-- ==========================================================
-- USER PROFILES
-- ==========================================================

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    username text unique,
    avatar_url text,
    bio text,
    communication_score integer default 0,
    total_sessions integer default 0,
    current_streak integer default 0,
    total_words integer default 0,
    created_at timestamptz default timezone('utc', now()),
    updated_at timestamptz default timezone('utc', now())
);

create trigger profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

-- ==========================================================
-- SCENARIOS
-- ==========================================================

create table if not exists public.scenarios (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    title text not null,
    description text,
    icon text,
    difficulty integer default 1,
    status text default 'active',
    created_at timestamptz default timezone('utc', now())
);

-- ==========================================================
-- PRACTICE SESSIONS
-- ==========================================================

create table if not exists public.sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade,
    scenario_id uuid references public.scenarios(id) on delete set null,
    title text,
    overall_score integer,
    ai_summary text,
    created_at timestamptz default timezone('utc', now()),
    updated_at timestamptz default timezone('utc', now())
);

create trigger sessions_updated_at
before update on public.sessions
for each row
execute procedure public.set_updated_at();

-- ==========================================================
-- PRACTICE ATTEMPTS
-- ==========================================================

create table if not exists public.practice_attempts (
    id uuid primary key default gen_random_uuid(),
    session_id uuid references public.sessions(id) on delete cascade,
    attempt_number integer not null,
    transcript text,
    duration integer,
    overall_score integer,
    created_at timestamptz default timezone('utc', now())
);

-- ==========================================================
-- COMMUNICATION METRICS
-- ==========================================================

create table if not exists public.communication_metrics (
    id uuid primary key default gen_random_uuid(),
    attempt_id uuid references public.practice_attempts(id) on delete cascade,
    words integer default 0,
    wpm integer default 0,
    confidence integer default 0,
    clarity integer default 0,
    delivery integer default 0,
    storytelling integer default 0,
    engagement integer default 0,
    expertise integer default 0,
    long_pauses integer default 0,
    silence_seconds numeric default 0,
    filler_words jsonb default '{}'::jsonb,
    created_at timestamptz default timezone('utc', now())
);

-- ==========================================================
-- COACH FEEDBACK
-- ==========================================================

create table if not exists public.coach_feedback (
    id uuid primary key default gen_random_uuid(),
    attempt_id uuid references public.practice_attempts(id) on delete cascade,
    coach text,
    score integer,
    strengths text[] default '{}',
    weaknesses text[] default '{}',
    advice text,
    created_at timestamptz default timezone('utc', now())
);

-- ==========================================================
-- INDEXES
-- ==========================================================

create index if not exists idx_sessions_user on public.sessions(user_id);
create index if not exists idx_attempt_session on public.practice_attempts(session_id);
create index if not exists idx_metrics_attempt on public.communication_metrics(attempt_id);
create index if not exists idx_feedback_attempt on public.coach_feedback(attempt_id);

-- ==========================================================
-- ENABLE RLS
-- ==========================================================

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.communication_metrics enable row level security;
alter table public.coach_feedback enable row level security;

-- ==========================================================
-- PROFILE POLICIES
-- ==========================================================

create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- ==========================================================
-- SESSION POLICIES
-- ==========================================================

create policy "sessions_select" on public.sessions for select using (auth.uid() = user_id);
create policy "sessions_insert" on public.sessions for insert with check (auth.uid() = user_id);
create policy "sessions_update" on public.sessions for update using (auth.uid() = user_id);

-- ==========================================================
-- ATTEMPT POLICIES
-- ==========================================================

create policy "attempt_select" on public.practice_attempts for select using (
  exists (select 1 from public.sessions where sessions.id = practice_attempts.session_id and sessions.user_id = auth.uid())
);
create policy "attempt_insert" on public.practice_attempts for insert with check (
  exists (select 1 from public.sessions where sessions.id = practice_attempts.session_id and sessions.user_id = auth.uid())
);

-- ==========================================================
-- METRIC POLICIES
-- ==========================================================

create policy "metrics_select" on public.communication_metrics for select using (
  exists (select 1 from public.practice_attempts pa join public.sessions s on s.id = pa.session_id where pa.id = communication_metrics.attempt_id and s.user_id = auth.uid())
);
create policy "metrics_insert" on public.communication_metrics for insert with check (
  exists (select 1 from public.practice_attempts pa join public.sessions s on s.id = pa.session_id where pa.id = communication_metrics.attempt_id and s.user_id = auth.uid())
);

-- ==========================================================
-- FEEDBACK POLICIES
-- ==========================================================

create policy "feedback_select" on public.coach_feedback for select using (
  exists (select 1 from public.practice_attempts pa join public.sessions s on s.id = pa.session_id where pa.id = coach_feedback.attempt_id and s.user_id = auth.uid())
);
create policy "feedback_insert" on public.coach_feedback for insert with check (
  exists (select 1 from public.practice_attempts pa join public.sessions s on s.id = pa.session_id where pa.id = coach_feedback.attempt_id and s.user_id = auth.uid())
);

-- ==========================================================
-- AUTO CREATE PROFILE
-- ==========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- ==========================================================
-- DEFAULT SCENARIOS
-- ==========================================================

insert into public.scenarios (slug,title,description,icon,difficulty)
values
('job-interview','Job Interview','Practice behavioural and technical interviews','briefcase',2),
('presentation','Presentation','Deliver compelling presentations','presentation',2),
('sales-pitch','Sales Pitch','Improve persuasive communication','chart',3),
('meeting','Meeting','Practice workplace discussions','users',1),
('podcast','Podcast Interview','Practice conversational interviews','mic',3),
('teaching','Teaching','Explain concepts clearly','graduation-cap',2),
('debate','Debate','Improve structured arguments','scale',4),
('ielts','IELTS Speaking','Prepare for IELTS Speaking','book-open',2),
('viva','Viva Defence','Practice academic defence','university',4),
('difficult-conversation','Difficult Conversation','Handle sensitive conversations','message-circle',3)
on conflict (slug) do nothing;
