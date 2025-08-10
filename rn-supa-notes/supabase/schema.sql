-- Enable needed extensions
create extension if not exists pgcrypto;

-- Notes table owned by user
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Update trigger for updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger notes_set_updated_at
before update on public.notes
for each row
execute procedure public.set_updated_at();

-- Indexes
create index if not exists idx_notes_user_id on public.notes(user_id);
create index if not exists idx_notes_updated_at on public.notes(updated_at desc);

-- Enable realtime replication for notes
alter publication supabase_realtime add table public.notes;

-- Row Level Security
alter table public.notes enable row level security;

-- Policies
create policy if not exists "Allow select own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy if not exists "Allow insert own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy if not exists "Allow update own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy if not exists "Allow delete own notes"
  on public.notes for delete
  using (auth.uid() = user_id);