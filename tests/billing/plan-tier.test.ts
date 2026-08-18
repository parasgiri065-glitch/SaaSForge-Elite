import { describe, expect, it } from "vitest";
import { resolvePlanTier } from "@/types/billing";
import type { Subscription } from "@/types/database";

function sub(price: string | null): Subscription {
  return {
    id: "sub_1",
    organization_id: "org_1",
    user_id: null,
    stripe_subscription_id: "sub_stripe",
    stripe_price_id: price,
    stripe_product_id: null,
    status: "active",
    current_period_start: null,
    current_period_end: null,
    cancel_at_period_end: false,
    canceled_at: null,
    trial_end: null,
    metadata: {},
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("resolvePlanTier", () => {
  it("returns None without a subscription", () => {
    expect(resolvePlanTier(null)).toBe("None");
  });

  it("maps known price ids", () => {
    expect(resolvePlanTier(sub("STRIPE_PRICE_ENTERPRISE"))).toBe("Enterprise");
    expect(resolvePlanTier(sub("price_growth_monthly"))).toBe("Growth");
    expect(resolvePlanTier(sub("starter"))).toBe("Starter");
  });
});
