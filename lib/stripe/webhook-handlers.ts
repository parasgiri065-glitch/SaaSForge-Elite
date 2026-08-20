import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { toIso } from "@/lib/stripe/map-status";
import { upsertOrganizationSubscription } from "@/lib/stripe/subscription-sync";
import {
  readInvoiceSubscriptionId,
  readStripeCustomerId,
} from "@/lib/stripe/webhook-payload";
import type { SupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Apply `invoice.paid`: retrieve the subscription and mark the org active.
 *
 * @param supabaseAdminClient - Service-role client used after signature verify.
 * @param invoice - The paid Stripe Invoice.
 * @returns Resolves after the subscription upsert, or immediately when no sub.
 */
export async function handleInvoicePaidEvent(
  supabaseAdminClient: SupabaseAdminClient,
  invoice: Stripe.Invoice,
): Promise<void> {
  const stripeSubscriptionId = readInvoiceSubscriptionId(invoice);
  if (!stripeSubscriptionId) {
    return;
  }

  const subscription = await getStripe().subscriptions.retrieve(stripeSubscriptionId);
  await upsertOrganizationSubscription(supabaseAdminClient, subscription, "active");
}

/**
 * Apply `customer.subscription.deleted`: persist canceled status twice so a
 * later out-of-order `updated` event cannot resurrect the row unnoticed.
 *
 * @param supabaseAdminClient - Service-role client used after signature verify.
 * @param subscription - The deleted Stripe Subscription.
 * @returns Resolves when both writes succeed.
 */
export async function handleSubscriptionDeletedEvent(
  supabaseAdminClient: SupabaseAdminClient,
  subscription: Stripe.Subscription,
): Promise<void> {
  await upsertOrganizationSubscription(supabaseAdminClient, subscription, "canceled");

  const { error: cancelUpdateError } = await supabaseAdminClient
    .from("subscriptions")
    .update({
      status: "canceled",
      cancel_at_period_end: false,
      canceled_at: toIso(subscription.canceled_at) ?? new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (cancelUpdateError) {
    throw new Error(cancelUpdateError.message);
  }
}

/**
 * Apply `checkout.session.completed`: attach the Stripe customer to the org
 * and upsert the subscription when Checkout created one.
 *
 * @param supabaseAdminClient - Service-role client used after signature verify.
 * @param checkoutSession - The completed Checkout Session.
 * @returns Resolves after org + optional subscription writes.
 */
export async function handleCheckoutSessionCompletedEvent(
  supabaseAdminClient: SupabaseAdminClient,
  checkoutSession: Stripe.Checkout.Session,
): Promise<void> {
  const organizationId =
    checkoutSession.metadata?.["organization_id"] ?? checkoutSession.client_reference_id;
  const stripeCustomerId = readStripeCustomerId(checkoutSession.customer);
  if (!organizationId || !stripeCustomerId) {
    return;
  }

  const { error: organizationUpdateError } = await supabaseAdminClient
    .from("organizations")
    .update({ stripe_customer_id: stripeCustomerId })
    .eq("id", organizationId);

  if (organizationUpdateError) {
    throw new Error(organizationUpdateError.message);
  }

  if (checkoutSession.subscription) {
    const stripeSubscriptionId =
      typeof checkoutSession.subscription === "string"
        ? checkoutSession.subscription
        : checkoutSession.subscription.id;
    const subscription = await getStripe().subscriptions.retrieve(stripeSubscriptionId);
    await upsertOrganizationSubscription(supabaseAdminClient, subscription);
  }
}
