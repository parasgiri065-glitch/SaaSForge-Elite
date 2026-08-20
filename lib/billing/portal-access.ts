import { BILLING_ROLES, hasRole } from "@/types/rbac";
import type { TenantUser } from "@/types/auth";

export type PortalDenial = {
  ok: false;
  status: 401 | 403 | 409;
  error: "unauthorized" | "forbidden" | "no_customer";
};

export type PortalGrant = {
  ok: true;
  customerId: string;
};

export type PortalDecision = PortalDenial | PortalGrant;

/**
 * Pure authorization for POST /api/stripe/portal.
 * Keeps the route handler free of branching that is hard to unit-test.
 *
 * @param user - Verified tenant user, or `null` for an empty request.
 * @returns A grant with `customerId`, or a 401/403/409 denial.
 */
export function decidePortalAccess(user: TenantUser | null): PortalDecision {
  if (!user || !user.is_active) {
    return { ok: false, status: 401, error: "unauthorized" };
  }
  if (!hasRole(user.role, BILLING_ROLES)) {
    return { ok: false, status: 403, error: "forbidden" };
  }
  const customerId = user.organization?.stripe_customer_id?.trim() ?? "";
  if (customerId.length === 0) {
    return { ok: false, status: 409, error: "no_customer" };
  }
  return { ok: true, customerId };
}
