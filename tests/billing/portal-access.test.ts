import { describe, expect, it } from "vitest";
import { decidePortalAccess } from "@/lib/billing/portal-access";
import { makeTenantUser } from "../helpers/tenant";

describe("decidePortalAccess", () => {
  it("rejects an empty / unauthenticated request", () => {
    expect(decidePortalAccess(null)).toEqual({
      ok: false,
      status: 401,
      error: "unauthorized",
    });
  });

  it("rejects an expired-session stand-in (inactive user)", () => {
    expect(decidePortalAccess(makeTenantUser({ is_active: false }))).toEqual({
      ok: false,
      status: 401,
      error: "unauthorized",
    });
  });

  it("forbids viewers from opening the customer portal", () => {
    expect(decidePortalAccess(makeTenantUser({ role: "viewer" }))).toEqual({
      ok: false,
      status: 403,
      error: "forbidden",
    });
    expect(decidePortalAccess(makeTenantUser({ role: "member" }))).toEqual({
      ok: false,
      status: 403,
      error: "forbidden",
    });
  });

  it("returns 409 when the org has no Stripe customer", () => {
    const user = makeTenantUser({
      organization: {
        id: "org_1",
        name: "Acme Labs",
        slug: "acme-labs",
        stripe_customer_id: null,
        billing_email: null,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    });
    expect(decidePortalAccess(user)).toEqual({
      ok: false,
      status: 409,
      error: "no_customer",
    });
  });

  it("treats a blank customer id as missing", () => {
    const user = makeTenantUser();
    if (user.organization) {
      user.organization.stripe_customer_id = "   ";
    }
    expect(decidePortalAccess(user).ok).toBe(false);
  });

  it("grants owners, admins, and billing roles a customer id", () => {
    for (const role of ["owner", "admin", "billing"] as const) {
      const decision = decidePortalAccess(makeTenantUser({ role }));
      expect(decision).toEqual({ ok: true, customerId: "cus_123" });
    }
  });
});
