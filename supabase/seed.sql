-- SaaSForge Elite seed
-- Do not insert into auth.users from SQL — sign up through /signup so
-- handle_new_user() creates the tenant, user, and profile atomically.
--
-- After your first signup you can rename the demo tenant:
--
--   update public.organizations
--   set name = 'Acme Labs'
--   where id = public.user_organization_id();

select 1;
