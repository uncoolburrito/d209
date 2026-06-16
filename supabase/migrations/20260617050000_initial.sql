-- ============================================================================
-- Wasim — initial schema
-- ============================================================================
-- 1. allowed_emails  signup allowlist (only listed emails can register)
-- 2. profiles        one row per user, linked to auth.users
-- 3. handle_new_user trigger that enforces the allowlist + creates the profile
-- 4. RLS policies    deny-by-default; explicit reads/writes per table
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. allowed_emails: the signup allowlist
-- ----------------------------------------------------------------------------
-- Add a row when a new roommate moves in. Delete to revoke future signups
-- (existing accounts are unaffected — drop the user from auth.users for that).

create table public.allowed_emails (
  email     text primary key,
  note      text,
  added_at  timestamptz not null default now()
);

-- RLS on, with NO policies => nothing (except service_role, which bypasses RLS)
-- can read or write this table. Management happens via the SQL editor or admin
-- tooling running with the service role key.
alter table public.allowed_emails enable row level security;


-- ----------------------------------------------------------------------------
-- 2. profiles: per-user metadata
-- ----------------------------------------------------------------------------
-- Rows are inserted automatically by the trigger below.
-- Deleted via cascade when the auth.users row is deleted.

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null,
  avatar_url    text,
  created_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Any signed-in user can read all profiles (so chat can show usernames).
create policy "profiles: authenticated can read all"
  on public.profiles
  for select
  to authenticated
  using (true);

-- A user can update their own profile row only.
create policy "profiles: users can update own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No insert/delete policies on purpose: inserts happen via the trigger,
-- deletes happen via the cascade from auth.users.


-- ----------------------------------------------------------------------------
-- 3. Signup trigger: enforce allowlist + auto-create profile
-- ----------------------------------------------------------------------------
-- Runs on every insert into auth.users. If the email isn't on the allowlist,
-- raise — the transaction rolls back and the auth user is never created.
-- security definer is required so the function can read public.allowed_emails
-- past its RLS. search_path is pinned to prevent search-path attacks.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.allowed_emails
    where lower(email) = lower(new.email)
  ) then
    raise exception 'Email not authorized for this app'
      using errcode = '42501';
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ----------------------------------------------------------------------------
-- 4. Seed the allowlist
-- ----------------------------------------------------------------------------
-- REPLACE these placeholders with your apartment's actual emails before
-- applying this migration (or run the inserts later via the SQL editor).

-- insert into public.allowed_emails (email, note) values
--   ('you@example.com',       'me'),
--   ('roommate1@example.com', 'roommate 1'),
--   ('roommate2@example.com', 'roommate 2'),
--   ('roommate3@example.com', 'roommate 3'),
--   ('roommate4@example.com', 'roommate 4'),
--   ('roommate5@example.com', 'roommate 5')
-- on conflict (email) do nothing;
