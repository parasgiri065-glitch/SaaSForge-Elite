import { readObjectRecord } from "@/lib/types/object-record";
import { toIso } from "@/lib/stripe/map-status";

export type SubscriptionBillingPeriod = {
  periodStartIso: string | null;
  periodEndIso: string | null;
};

export type SubscriptionItemPriceIds = {
  stripePriceId: string | null;
  stripeProductId: string | null;
};

export type StripeCustomerReference = string | { id: string } | null | undefined;

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
 * Accepts `unknown` so Stripe SDK snapshots and test fixtures share one path.
 *
 * @param subscription - A retrieved Stripe Subscription (or a structural stand-in).
 * @returns ISO timestamps for period start/end, each nullable.
 */
export function readSubscriptionBillingPeriod(
  subscription: unknown,
): SubscriptionBillingPeriod {
  const subscriptionRecord = readObjectRecord(subscription) ?? {};
  const itemsRecord = readObjectRecord(subscriptionRecord["items"]);
  const itemList = itemsRecord?.["data"];
  const firstItem = Array.isArray(itemList) ? itemList[0] : undefined;
  const itemRecord = readObjectRecord(firstItem);

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
export function readStripeCustomerId(customer: StripeCustomerReference): string | null {
  if (!customer) {
    return null;
  }
  return typeof customer === "string" ? customer : customer.id;
}

/**
 * Pull the related subscription id off an Invoice (top-level or parent details).
 *
 * @param invoice - A Stripe Invoice (or a structural stand-in).
 * @returns The `sub_…` id, or `null` when the invoice is not subscription-backed.
 */
export function readInvoiceSubscriptionId(invoice: unknown): string | null {
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
 * @param subscription - A retrieved Stripe Subscription (or a structural stand-in).
 * @returns Nullable Stripe price/product ids for the org's current plan.
 */
export function readFirstSubscriptionItemIds(
  subscription: unknown,
): SubscriptionItemPriceIds {
  const subscriptionRecord = readObjectRecord(subscription) ?? {};
  const itemsRecord = readObjectRecord(subscriptionRecord["items"]);
  const itemList = itemsRecord?.["data"];
  const firstItem = Array.isArray(itemList) ? itemList[0] : undefined;
  const itemRecord = readObjectRecord(firstItem);
  const priceRecord = readObjectRecord(itemRecord?.["price"]);
  if (!priceRecord || typeof priceRecord["id"] !== "string") {
    return { stripePriceId: null, stripeProductId: null };
  }
  const product = priceRecord["product"];
  const productRecord = readObjectRecord(product);
  const productId =
    typeof product === "string"
      ? product
      : typeof productRecord?.["id"] === "string"
        ? productRecord["id"]
        : null;
  return {
    stripePriceId: priceRecord["id"],
    stripeProductId: productId,
  };
}

export { readObjectRecord };
