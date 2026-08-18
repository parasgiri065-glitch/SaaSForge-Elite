import type { TenantUser } from "@/types/auth";
import type { AppRole } from "@/types/database";

export function makeTenantUser(overrides: Partial<TenantUser> = {}): TenantUser {
  return {
    id: "user_1",
    email: "owner@acme.test",
    organization_id: "org_1",
    role: "owner" satisfies AppRole,
    is_active: true,
    last_seen_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    profile: null,
    organization: {
      id: "org_1",
      name: "Acme Labs",
      slug: "acme-labs",
      stripe_customer_id: "cus_123",
      billing_email: "billing@acme.test",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    },
    subscription: null,
    ...overrides,
  };
}
