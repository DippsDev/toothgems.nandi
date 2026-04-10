-- Run this in your Supabase dashboard SQL editor:
-- https://supabase.com/dashboard/project/hnewzfpvkyvmrigqztig/sql/new

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text unique not null,
  service_slug text not null,
  items jsonb not null,
  total integer not null,
  date date not null,
  time text not null,
  name text not null,
  phone text not null,
  email text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table bookings enable row level security;

-- Allow inserts from the browser (anon/publishable key)
create policy "allow public insert" on bookings
  for insert with check (true);

-- Allow reading booked slots (for availability checking)
create policy "allow public select time and date" on bookings
  for select using (true);
