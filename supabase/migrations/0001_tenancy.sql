-- =============================================================================
-- 0001_tenancy.sql
-- Multi-tenant foundation: organizations, users, profiles.
-- auth.users remains the identity source; public.users is the tenant member.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Shared timestamp helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- organizations  (tenant root)
-- ---------------------------------------------------------------------------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  stripe_customer_id text unique,
  billing_email text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index organizations_stripe_customer_id_idx
  on public.organizations (stripe_customer_id)
  where stripe_customer_id is not null;

create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

comment on table public.organizations is
  'Tenant root. Every billed resource is scoped to an organization.';

-- ---------------------------------------------------------------------------
-- users  (1:1 with auth.users, belongs to one organization)
-- ---------------------------------------------------------------------------
create type public.app_role as enum (
  'owner',
  'admin',
  'member',
  'billing',
  'viewer'
);

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  organization_id uuid not null references public.organizations (id) on delete restrict,
  role public.app_role not null default 'member',
  is_active boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint users_email_format check (position('@' in email) > 1)
);

create index users_organization_id_idx on public.users (organization_id);
create index users_email_idx on public.users (lower(email));

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

comment on table public.users is
  'Application user row. id always equals auth.users.id. organization_id is the tenant scope.';

-- ---------------------------------------------------------------------------
-- profiles  (public-facing attributes, 1:1 with users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  job_title text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_full_name_len check (
    full_name is null or char_length(full_name) <= 160
  )
);

create index profiles_user_id_idx on public.profiles (user_id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

comment on table public.profiles is
  'Display profile for a user. Never store secrets or billing state here.';

-- ---------------------------------------------------------------------------
-- Provisioning: new auth user → tenant + user + profile
--
-- Signup always creates a NEW organization as owner.
-- Invites must go through a verified invite token (not raw metadata)
-- so a client cannot join an arbitrary tenant by forging organization_id.
-- ---------------------------------------------------------------------------
create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from
    regexp_replace(lower(coalesce(input, 'workspace')), '[^a-z0-9]+', '-', 'g')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  org_name text;
  org_slug text;
  display_name text;
begin
  org_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'organization_name'), ''),
    split_part(coalesce(new.email, 'workspace'), '@', 1) || '''s workspace'
  );
  org_slug := public.slugify(org_name) || '-' || substr(new.id::text, 1, 8);
  display_name := nullif(trim(new.raw_user_meta_data ->> 'full_name'), '');

  insert into public.organizations (name, slug, billing_email)
  values (org_name, org_slug, new.email)
  returning id into new_org_id;

  insert into public.users (id, email, organization_id, role)
  values (new.id, coalesce(new.email, ''), new_org_id, 'owner');

  insert into public.profiles (user_id, full_name, avatar_url)
  values (
    new.id,
    display_name,
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_user_email_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.users
    set email = new.email
    where id = new.id;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.handle_user_email_sync();

-- Clients must never invoke provisioning functions directly.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.handle_user_email_sync() from public, anon, authenticated;
