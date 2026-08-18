import type { Subscription, SubscriptionStatus } from "@/types/database";

export const SUBSCRIPTION_STATUSES = [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
] as const satisfies readonly SubscriptionStatus[];

export function isSubscriptionStatus(value: string): value is SubscriptionStatus {
  return (SUBSCRIPTION_STATUSES as readonly string[]).includes(value);
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

export function formatUsd(amountCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountCents / 100);
}

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
