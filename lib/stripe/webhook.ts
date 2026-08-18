import "server-only";

import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { mapStripeSubscriptionStatus, toIso } from "@/lib/stripe/map-status";
import type { SubscriptionStatus } from "@/types/database";

type AdminClient = ReturnType<typeof createAdminClient>;

interface Period {
  start: string | null;
  end: string | null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return null;
}

function readUnix(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  return typeof value === "number" ? value : null;
}

function periodFromSubscription(subscription: Stripe.Subscription): Period {
  const item = subscription.items.data[0];
  const itemRecord = item ? asRecord(item) : null;
  const subRecord = asRecord(subscription) ?? {};

  const start =
    readUnix(itemRecord ?? {}, "current_period_start") ??
    readUnix(subRecord, "current_period_start");
  const end =
    readUnix(itemRecord ?? {}, "current_period_end") ??
    readUnix(subRecord, "current_period_end");

  return { start: toIso(start), end: toIso(end) };
}

function customerIdFrom(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): string | null {
  if (!customer) {
    return null;
  }
  return typeof customer === "string" ? customer : customer.id;
}

function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const record = asRecord(invoice);
  const direct = record?.["subscription"];
  if (typeof direct === "string") {
    return direct;
  }
  const directObj = asRecord(direct);
  if (directObj && typeof directObj["id"] === "string") {
    return directObj["id"];
  }

  const parent = asRecord(record?.["parent"]);
  const details = asRecord(parent?.["subscription_details"]);
  const nested = details?.["subscription"];
  if (typeof nested === "string") {
    return nested;
  }
  const nestedObj = asRecord(nested);
  if (nestedObj && typeof nestedObj["id"] === "string") {
    return nestedObj["id"];
  }
  return null;
}

function firstItemIds(subscription: Stripe.Subscription): {
  priceId: string | null;
  productId: string | null;
} {
  const price = subscription.items.data[0]?.price;
  if (!price) {
    return { priceId: null, productId: null };
  }
  const product = price.product;
  return {
    priceId: price.id,
    productId: typeof product === "string" ? product : (product?.id ?? null),
  };
}

async function resolveOrganizationId(
  admin: AdminClient,
  subscription: Stripe.Subscription,
): Promise<{ organizationId: string; userId: string | null } | null> {
  const metadataOrg = subscription.metadata["organization_id"];
  if (metadataOrg) {
    const { data } = await admin
      .from("organizations")
      .select("id")
      .eq("id", metadataOrg)
      .maybeSingle();
    if (data) {
      return {
        organizationId: data.id,
        userId: subscription.metadata["user_id"] ?? null,
      };
    }
  }

  const customerId = customerIdFrom(subscription.customer);
  if (!customerId) {
    return null;
  }

  const { data: org } = await admin
    .from("organizations")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (!org) {
    return null;
  }

  return {
    organizationId: org.id,
    userId: subscription.metadata["user_id"] ?? null,
  };
}

async function upsertSubscription(
  admin: AdminClient,
  subscription: Stripe.Subscription,
  statusOverride?: SubscriptionStatus,
): Promise<void> {
  const resolved = await resolveOrganizationId(admin, subscription);
  if (!resolved) {
    throw new Error(`No organization mapped for Stripe subscription ${subscription.id}`);
  }

  const customerId = customerIdFrom(subscription.customer);
  if (customerId) {
    const { error: orgError } = await admin
      .from("organizations")
      .update({ stripe_customer_id: customerId })
      .eq("id", resolved.organizationId);
    if (orgError) {
      throw new Error(orgError.message);
    }
  }

  const period = periodFromSubscription(subscription);
  const ids = firstItemIds(subscription);
  const trialEnd = toIso(subscription.trial_end);
  const canceledAt = toIso(subscription.canceled_at);

  const { error } = await admin.from("subscriptions").upsert(
    {
      organization_id: resolved.organizationId,
      user_id: resolved.userId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: ids.priceId,
      stripe_product_id: ids.productId,
      status: statusOverride ?? mapStripeSubscriptionStatus(subscription.status),
      current_period_start: period.start,
      current_period_end: period.end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: canceledAt,
      trial_end: trialEnd,
    },
    { onConflict: "organization_id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}

async function handleInvoicePaid(
  admin: AdminClient,
  invoice: Stripe.Invoice,
): Promise<void> {
  const subscriptionId = invoiceSubscriptionId(invoice);
  if (!subscriptionId) {
    return;
  }

  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  await upsertSubscription(admin, subscription, "active");
}

async function handleSubscriptionDeleted(
  admin: AdminClient,
  subscription: Stripe.Subscription,
): Promise<void> {
  await upsertSubscription(admin, subscription, "canceled");

  const { error } = await admin
    .from("subscriptions")
    .update({
      status: "canceled",
      cancel_at_period_end: false,
      canceled_at: toIso(subscription.canceled_at) ?? new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    throw new Error(error.message);
  }
}

async function handleCheckoutCompleted(
  admin: AdminClient,
  session: Stripe.Checkout.Session,
): Promise<void> {
  const organizationId =
    session.metadata?.["organization_id"] ?? session.client_reference_id;
  const customerId = customerIdFrom(session.customer);
  if (!organizationId || !customerId) {
    return;
  }

  const { error } = await admin
    .from("organizations")
    .update({ stripe_customer_id: customerId })
    .eq("id", organizationId);

  if (error) {
    throw new Error(error.message);
  }

  if (session.subscription) {
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription.id;
    const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
    await upsertSubscription(admin, subscription);
  }
}

export async function processStripeEvent(event: Stripe.Event): Promise<void> {
  const admin = createAdminClient();

  switch (event.type) {
    case "invoice.paid":
      await handleInvoicePaid(admin, event.data.object as Stripe.Invoice);
      return;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(admin, event.data.object as Stripe.Subscription);
      return;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await upsertSubscription(admin, event.data.object as Stripe.Subscription);
      return;
    case "checkout.session.completed":
      await handleCheckoutCompleted(admin, event.data.object as Stripe.Checkout.Session);
      return;
    default:
      return;
  }
}
