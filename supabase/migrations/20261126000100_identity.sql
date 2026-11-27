create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (length(trim(full_name)) between 2 and 200),
  birth_date date not null,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_adult check (birth_date <= ((now() at time zone 'UTC')::date - interval '18 years')::date)
);

create table public.identity_acceptances (
  user_id uuid not null references public.profiles(id) on delete cascade,
  document_kind text not null check (document_kind in ('terms', 'privacy')),
  document_version text not null check (length(trim(document_version)) > 0),
  recorded_at timestamptz not null default now(),
  primary key (user_id, document_kind, document_version)
);

-- Access stays closed until the complete session and MFA gates are implemented.
alter table public.profiles enable row level security;
alter table public.identity_acceptances enable row level security;
revoke all on public.profiles, public.identity_acceptances from public, anon, authenticated;
