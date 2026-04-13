-- Run this in your Supabase dashboard SQL editor:
-- https://supabase.com/dashboard/project/hnewzfpvkyvmrigqztig/sql/new

-- Add status column to bookings
alter table bookings
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'unavailable'));

-- Allow the service role (used by the respond API) to update bookings
create policy "allow service role update" on bookings
  for update using (true);
