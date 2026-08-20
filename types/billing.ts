import {
  SUBSCRIPTION_STATUS_VALUES,
  type Subscription,
  type SubscriptionStatus,
} from "@/types/database";

export const SUBSCRIPTION_STATUSES = SUBSCRIPTION_STATUS_VALUES;

/**
 * Type-guard a string as a known Postgres subscription status.
 *
 * @param value - Candidate status string.
 * @returns `true` when `value` is in `SUBSCRIPTION_STATUSES`.
 */
const SUBSCRIPTION_STATUS_SET: ReadonlySet<string> = new Set(SUBSCRIPTION_STATUSES);

export function isSubscriptionStatus(value: string): value is SubscriptionStatus {
  return SUBSCRIPTION_STATUS_SET.has(value);
}

export const ACTIVE_SUBSCRIPTION_STATUSES: readonly SubscriptionStatus[] = [
  "trialing",
  "active",
];

export type InvoiceStatus = "paid" | "open" | "void" | "uncollectible";

export type Invoice = {
  id: string;
  number: string;
  issuedAt: string;
  amountCents: number;
  currency: string;
  status: InvoiceStatus;
  hostedUrl: string | null;
  isMock: boolean;
};

export type PlanTier = "Starter" | "Growth" | "Enterprise" | "None";

/**
 * Format an integer cent amount as USD.
 *
 * @param amountCents - Amount in cents (e.g. `4900` → `$49.00`).
 * @returns A locale-formatted USD string.
 */
export function formatUsd(amountCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountCents / 100);
}

/**
 * Map a Stripe price id onto a display plan tier.
 *
 * @param subscription - Tenant subscription row, or `null`.
 * @returns `"Starter" | "Growth" | "Enterprise" | "None"`.
 */
export function resolvePlanTier(subscription: Subscription | null): PlanTier {
  const price = (subscription?.stripe_price_id ?? "").toLowerCase();
  if (price.includes("enterprise")) {
    return "Enterprise";
  }
  if (price.includes("growth")) {
    return "Growth";
  }
  if (price.includes("starter")) {
    return "Starter";
  }
  if (subscription) {
    return "Growth";
  }
  return "None";
}
