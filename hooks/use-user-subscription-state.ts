"use client";

import { useAuth } from "@/hooks/use-auth";
import { resolvePlanTier, type PlanTier } from "@/types/billing";
import type { Subscription } from "@/types/database";
import type { TenantUser } from "@/types/auth";

export type UserSubscriptionState = {
  tenantUser: TenantUser | null;
  subscriptionRecord: Subscription | null;
  planTier: PlanTier;
  hasStripeCustomer: boolean;
  organizationDisplayName: string;
};

/**
 * Derive billing UI inputs from the authenticated tenant user.
 * No network — subscription rows are already hydrated on the auth context.
 *
 * @returns Plan tier, Stripe customer presence, and org display name.
 */
export function useUserSubscriptionState(): UserSubscriptionState {
  const { tenantUser } = useAuth();
  const subscriptionRecord = tenantUser?.subscription ?? null;
  const planTier = resolvePlanTier(subscriptionRecord);
  const hasStripeCustomer = Boolean(tenantUser?.organization?.stripe_customer_id);
  const organizationDisplayName = tenantUser?.organization?.name ?? "your workspace";

  return {
    tenantUser,
    subscriptionRecord,
    planTier,
    hasStripeCustomer,
    organizationDisplayName,
  };
}
