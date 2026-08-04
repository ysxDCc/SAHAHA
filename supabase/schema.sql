create extension if not exists pgcrypto;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 30),
  email text,
  reservation_date date not null,
  reservation_time time not null,
  guests integer not null check (guests between 1 and 30),
  note text check (note is null or char_length(note) <= 1000),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reservations_date_time_idx on public.reservations (reservation_date, reservation_time);
create index if not exists reservations_status_idx on public.reservations (status);
alter table public.reservations enable row level security;

-- No public policies: submissions and admin changes use the server-only service role.
