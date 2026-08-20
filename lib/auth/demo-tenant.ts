import type { TenantUser } from "@/types/auth";

/**
 * Frozen tenant graph for public demo mode (Ada Lovelace / Acme Labs).
 * Never persisted — the live auth provider is skipped when this is used.
 */
export const DEMO_TENANT_USER: TenantUser = {
  id: "demo-user",
  email: "ada@demo.saasforge.dev",
  organization_id: "demo-org",
  role: "owner",
  is_active: true,
  last_seen_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  profile: {
    id: "demo-profile",
    user_id: "demo-user",
    full_name: "Ada Lovelace",
    avatar_url: null,
    job_title: "Founder",
    timezone: "UTC",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  organization: {
    id: "demo-org",
    name: "Acme Labs",
    slug: "acme-labs",
    stripe_customer_id: "cus_demo_acme",
    billing_email: "billing@demo.saasforge.dev",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  subscription: {
    id: "demo-sub",
    organization_id: "demo-org",
    user_id: "demo-user",
    stripe_subscription_id: "sub_demo",
    stripe_price_id: "price_growth_demo",
    stripe_product_id: "prod_demo",
    status: "active",
    current_period_start: "2026-08-01T00:00:00.000Z",
    current_period_end: "2026-09-01T00:00:00.000Z",
    cancel_at_period_end: false,
    canceled_at: null,
    trial_end: null,
    metadata: {},
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
};
