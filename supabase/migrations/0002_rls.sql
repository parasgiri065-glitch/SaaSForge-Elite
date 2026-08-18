-- =============================================================================
-- 0002_rls.sql
-- Row-Level Security for every public table.
-- Default deny. Authenticated clients only see their own tenant.
-- Service role (webhooks, admin jobs) bypasses RLS by design.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- SECURITY DEFINER helpers
-- These bypass RLS on public.users so policies cannot recurse.
-- ---------------------------------------------------------------------------
create or replace function public.user_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.organization_id
  from public.users u
  where u.id = auth.uid()
    and u.is_active = true
$$;

create or replace function public.user_has_role(target_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.is_active = true
      and u.role = any (target_roles)
  )
$$;

revoke all on function public.user_organization_id() from public;
revoke all on function public.user_has_role(public.app_role[]) from public;
grant execute on function public.user_organization_id() to authenticated;
grant execute on function public.user_has_role(public.app_role[]) to authenticated;

-- ---------------------------------------------------------------------------
-- Privilege-escalation guard
-- Even if an UPDATE policy is too wide, role / org / id cannot be self-edited
-- unless the caller is an owner/admin (role only) or service_role.
-- ---------------------------------------------------------------------------
create or replace function public.prevent_user_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role public.app_role;
begin
  if auth.role() = 'service_role' or auth.uid() is null then
    return new;
  end if;

  if new.id is distinct from old.id then
    raise exception 'users.id is immutable';
  end if;

  if new.organization_id is distinct from old.organization_id then
    raise exception 'users.organization_id cannot be changed by clients';
  end if;

  if new.role is distinct from old.role then
    select u.role into caller_role
    from public.users u
    where u.id = auth.uid();

    if caller_role is null or caller_role not in ('owner', 'admin') then
      raise exception 'only owner or admin can change roles';
    end if;

    if old.role = 'owner' and new.role <> 'owner' and caller_role <> 'owner' then
      raise exception 'only an owner can demote another owner';
    end if;
  end if;

  return new;
end;
$$;

create trigger users_prevent_privilege_escalation
  before update on public.users
  for each row execute function public.prevent_user_privilege_escalation();

revoke all on function public.prevent_user_privilege_escalation() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Lock down grants (Supabase defaults are too open)
-- ---------------------------------------------------------------------------
revoke all on table public.organizations from anon, authenticated;
revoke all on table public.users from anon, authenticated;
revoke all on table public.profiles from anon, authenticated;

grant select on table public.organizations to authenticated;
grant update (name, billing_email) on table public.organizations to authenticated;

grant select on table public.users to authenticated;
grant update (last_seen_at, is_active, role) on table public.users to authenticated;

grant select, insert, update on table public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Enable RLS on every table
-- ---------------------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.profiles enable row level security;

alter table public.organizations force row level security;
alter table public.users force row level security;
alter table public.profiles force row level security;

-- organizations --------------------------------------------------------------
create policy organizations_select_member
  on public.organizations
  for select
  to authenticated
  using (id = public.user_organization_id());

create policy organizations_update_admins
  on public.organizations
  for update
  to authenticated
  using (
    id = public.user_organization_id()
    and public.user_has_role(array['owner', 'admin']::public.app_role[])
  )
  with check (id = public.user_organization_id());

-- users ----------------------------------------------------------------------
create policy users_select_same_org
  on public.users
  for select
  to authenticated
  using (organization_id = public.user_organization_id());

create policy users_update_self
  on public.users
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy users_update_admins
  on public.users
  for update
  to authenticated
  using (
    organization_id = public.user_organization_id()
    and public.user_has_role(array['owner', 'admin']::public.app_role[])
  )
  with check (organization_id = public.user_organization_id());

-- profiles -------------------------------------------------------------------
create policy profiles_select_same_org
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.users u
      where u.id = profiles.user_id
        and u.organization_id = public.user_organization_id()
    )
  );

create policy profiles_insert_self
  on public.profiles
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy profiles_update_self
  on public.profiles
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
