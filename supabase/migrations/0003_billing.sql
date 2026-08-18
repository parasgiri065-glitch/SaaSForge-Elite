-- =============================================================================
-- 0003_billing.sql
-- Stripe-backed subscriptions + idempotent webhook event log.
-- Writes are service-role only. Members may read their tenant's subscription.
-- =============================================================================

create type public.subscription_status as enum (
  'incomplete',
  'incomplete_expired',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'paused'
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  stripe_subscription_id text not null unique,
  stripe_price_id text,
  stripe_product_id text,
  status public.subscription_status not null default 'incomplete',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  trial_end timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index subscriptions_status_idx on public.subscriptions (status);
create index subscriptions_user_id_idx on public.subscriptions (user_id);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

comment on table public.subscriptions is
  'Current Stripe subscription for an organization. One row per tenant.';

-- Idempotency + retry ledger for /api/webhooks/stripe
create table public.stripe_webhook_events (
  id text primary key,
  type text not null,
  processed_at timestamptz,
  error text,
  received_at timestamptz not null default timezone('utc', now())
);

comment on table public.stripe_webhook_events is
  'Stripe event.id ledger. Prevents double-application of webhook deliveries.';

-- Grants: authenticated can read their subscription, never write billing rows.
revoke all on table public.subscriptions from anon, authenticated;
revoke all on table public.stripe_webhook_events from anon, authenticated;
grant select on table public.subscriptions to authenticated;

alter table public.subscriptions enable row level security;
alter table public.stripe_webhook_events enable row level security;
alter table public.subscriptions force row level security;
alter table public.stripe_webhook_events force row level security;

create policy subscriptions_select_member
  on public.subscriptions
  for select
  to authenticated
  using (organization_id = public.user_organization_id());

-- stripe_webhook_events: no policies for anon/authenticated → default deny.
-- service_role bypasses RLS and is the only writer.
