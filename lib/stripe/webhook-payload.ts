import type Stripe from "stripe";
import { toIso } from "@/lib/stripe/map-status";

export type SubscriptionBillingPeriod = {
  periodStartIso: string | null;
  periodEndIso: string | null;
};

export type SubscriptionItemPriceIds = {
  stripePriceId: string | null;
  stripeProductId: string | null;
};

/**
 * Narrow an unknown Stripe object to a plain record, or `null`.
 *
 * @param value - A Stripe SDK object or primitive.
 * @returns The object as a string-keyed record, or `null` when not an object.
 */
export function readObjectRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return null;
}

/**
 * Read a Unix-seconds field from a Stripe record.
 *
 * @param record - A plain object view of a Stripe resource.
 * @param fieldName - Property that should hold a number (seconds since epoch).
 * @returns The number, or `null` when missing or the wrong type.
 */
export function readUnixTimestampField(
  record: Record<string, unknown>,
  fieldName: string,
): number | null {
  const fieldValue = record[fieldName];
  return typeof fieldValue === "number" ? fieldValue : null;
}

/**
 * Current billing period on a Subscription (item first, then the parent).
 * Stripe 2025+ stores period timestamps on the subscription item.
 *
 * @param subscription - A retrieved Stripe Subscription.
 * @returns ISO timestamps for period start/end, each nullable.
 */
export function readSubscriptionBillingPeriod(
  subscription: Stripe.Subscription,
): SubscriptionBillingPeriod {
  const firstItem = subscription.items.data[0];
  const itemRecord = firstItem ? readObjectRecord(firstItem) : null;
  const subscriptionRecord = readObjectRecord(subscription) ?? {};

  const periodStartUnix =
    readUnixTimestampField(itemRecord ?? {}, "current_period_start") ??
    readUnixTimestampField(subscriptionRecord, "current_period_start");
  const periodEndUnix =
    readUnixTimestampField(itemRecord ?? {}, "current_period_end") ??
    readUnixTimestampField(subscriptionRecord, "current_period_end");

  return { periodStartIso: toIso(periodStartUnix), periodEndIso: toIso(periodEndUnix) };
}

/**
 * Normalize a Stripe customer reference to a customer id string.
 *
 * @param customer - An expanded Customer, a deleted customer, an id, or null.
 * @returns The `cus_…` id, or `null` when Stripe omitted the customer.
 */
export function readStripeCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): string | null {
  if (!customer) {
    return null;
  }
  return typeof customer === "string" ? customer : customer.id;
}

/**
 * Pull the related subscription id off an Invoice (top-level or parent details).
 *
 * @param invoice - A Stripe Invoice from `invoice.paid`.
 * @returns The `sub_…` id, or `null` when the invoice is not subscription-backed.
 */
export function readInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const invoiceRecord = readObjectRecord(invoice);
  const direct = invoiceRecord?.["subscription"];
  if (typeof direct === "string") {
    return direct;
  }
  const directObject = readObjectRecord(direct);
  if (directObject && typeof directObject["id"] === "string") {
    return directObject["id"];
  }

  const parent = readObjectRecord(invoiceRecord?.["parent"]);
  const subscriptionDetails = readObjectRecord(parent?.["subscription_details"]);
  const nested = subscriptionDetails?.["subscription"];
  if (typeof nested === "string") {
    return nested;
  }
  const nestedObject = readObjectRecord(nested);
  if (nestedObject && typeof nestedObject["id"] === "string") {
    return nestedObject["id"];
  }
  return null;
}

/**
 * Price and product ids from the first subscription item.
 *
 * @param subscription - A retrieved Stripe Subscription.
 * @returns Nullable Stripe price/product ids for the org's current plan.
 */
export function readFirstSubscriptionItemIds(
  subscription: Stripe.Subscription,
): SubscriptionItemPriceIds {
  const price = subscription.items.data[0]?.price;
  if (!price) {
    return { stripePriceId: null, stripeProductId: null };
  }
  const product = price.product;
  return {
    stripePriceId: price.id,
    stripeProductId: typeof product === "string" ? product : (product?.id ?? null),
  };
}
