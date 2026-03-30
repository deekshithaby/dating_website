create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique not null,
  display_name text,
  age int check (age >= 18 and age <= 30),
  gender text check (gender in ('male', 'female')),
  bio text check (char_length(bio) <= 300),
  photo_key text,
  photo_uploaded boolean default false,
  onboarding_complete boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete cascade,
  responses jsonb not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.quiz_responses enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "quiz_responses_select_own"
  on public.quiz_responses
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "quiz_responses_insert_own"
  on public.quiz_responses
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "quiz_responses_update_own"
  on public.quiz_responses
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
