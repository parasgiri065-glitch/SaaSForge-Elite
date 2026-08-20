import "server-only";

import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertOrganizationSubscription } from "@/lib/stripe/subscription-sync";
import {
  handleCheckoutSessionCompletedEvent,
  handleInvoicePaidEvent,
  handleSubscriptionDeletedEvent,
} from "@/lib/stripe/webhook-handlers";

/**
 * Dispatch a verified Stripe event onto tenant billing tables.
 * `Stripe.Event` is a discriminated union on `type`, so `data.object` is
 * narrowed without assertions.
 *
 * @param stripeEvent - A `Stripe.Event` from `constructEvent` (never JSON.parse).
 * @returns Resolves after the matching handler (unknown types are ignored).
 */
export async function processStripeEvent(stripeEvent: Stripe.Event): Promise<void> {
  const supabaseAdminClient = createAdminClient();

  switch (stripeEvent.type) {
    case "invoice.paid":
      await handleInvoicePaidEvent(supabaseAdminClient, stripeEvent.data.object);
      return;
    case "customer.subscription.deleted":
      await handleSubscriptionDeletedEvent(supabaseAdminClient, stripeEvent.data.object);
      return;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await upsertOrganizationSubscription(supabaseAdminClient, stripeEvent.data.object);
      return;
    case "checkout.session.completed":
      await handleCheckoutSessionCompletedEvent(
        supabaseAdminClient,
        stripeEvent.data.object,
      );
      return;
    default:
      return;
  }
}
