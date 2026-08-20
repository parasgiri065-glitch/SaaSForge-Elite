import type Stripe from "stripe";
import { mapStripeSubscriptionStatus, toIso } from "@/lib/stripe/map-status";
import {
  readFirstSubscriptionItemIds,
  readStripeCustomerId,
  readSubscriptionBillingPeriod,
} from "@/lib/stripe/webhook-payload";
import type { SupabaseAdminClient } from "@/lib/supabase/admin";
import type { SubscriptionStatus } from "@/types/database";

export type ResolvedBillingOrganization = {
  organizationId: string;
  userId: string | null;
};

/**
 * Map a Stripe subscription onto a tenant organization.
 * Prefers `metadata.organization_id` when that row exists, otherwise the
 * Stripe customer id stored on `organizations`.
 *
 * @param supabaseAdminClient - Service-role client (RLS bypass, webhook-only).
 * @param subscription - The Stripe Subscription being applied.
 * @returns The org id plus optional user id, or `null` when unmapped.
 */
export async function resolveOrganizationForSubscription(
  supabaseAdminClient: SupabaseAdminClient,
  subscription: Stripe.Subscription,
): Promise<ResolvedBillingOrganization | null> {
  const metadataOrganizationId = subscription.metadata["organization_id"];
  if (metadataOrganizationId) {
    const { data: organizationRow } = await supabaseAdminClient
      .from("organizations")
      .select("id")
      .eq("id", metadataOrganizationId)
      .maybeSingle();
    if (organizationRow) {
      return {
        organizationId: organizationRow.id,
        userId: subscription.metadata["user_id"] ?? null,
      };
    }
  }

  const stripeCustomerId = readStripeCustomerId(subscription.customer);
  if (!stripeCustomerId) {
    return null;
  }

  const { data: organizationByCustomer } = await supabaseAdminClient
    .from("organizations")
    .select("id")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();

  if (!organizationByCustomer) {
    return null;
  }

  return {
    organizationId: organizationByCustomer.id,
    userId: subscription.metadata["user_id"] ?? null,
  };
}

/**
 * Upsert the tenant `subscriptions` row (one per organization) from Stripe.
 * Also backfills `organizations.stripe_customer_id` when present.
 *
 * @param supabaseAdminClient - Service-role client used after signature verify.
 * @param subscription - Canonical Stripe Subscription snapshot.
 * @param statusOverride - Force a status (e.g. `"active"` after `invoice.paid`).
 * @returns Resolves when the row is written.
 * @throws When the subscription cannot be mapped to an organization.
 */
export async function upsertOrganizationSubscription(
  supabaseAdminClient: SupabaseAdminClient,
  subscription: Stripe.Subscription,
  statusOverride?: SubscriptionStatus,
): Promise<void> {
  const resolvedOrganization = await resolveOrganizationForSubscription(
    supabaseAdminClient,
    subscription,
  );
  if (!resolvedOrganization) {
    throw new Error(`No organization mapped for Stripe subscription ${subscription.id}`);
  }

  const stripeCustomerId = readStripeCustomerId(subscription.customer);
  if (stripeCustomerId) {
    const { error: organizationUpdateError } = await supabaseAdminClient
      .from("organizations")
      .update({ stripe_customer_id: stripeCustomerId })
      .eq("id", resolvedOrganization.organizationId);
    if (organizationUpdateError) {
      throw new Error(organizationUpdateError.message);
    }
  }

  const billingPeriod = readSubscriptionBillingPeriod(subscription);
  const priceIds = readFirstSubscriptionItemIds(subscription);
  const trialEndIso = toIso(subscription.trial_end);
  const canceledAtIso = toIso(subscription.canceled_at);

  const { error: upsertError } = await supabaseAdminClient.from("subscriptions").upsert(
    {
      organization_id: resolvedOrganization.organizationId,
      user_id: resolvedOrganization.userId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceIds.stripePriceId,
      stripe_product_id: priceIds.stripeProductId,
      status: statusOverride ?? mapStripeSubscriptionStatus(subscription.status),
      current_period_start: billingPeriod.periodStartIso,
      current_period_end: billingPeriod.periodEndIso,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: canceledAtIso,
      trial_end: trialEndIso,
    },
    { onConflict: "organization_id" },
  );

  if (upsertError) {
    throw new Error(upsertError.message);
  }
}
