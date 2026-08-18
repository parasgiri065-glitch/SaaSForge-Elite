import type { SubscriptionStatus } from "@/types/database";
import { isSubscriptionStatus } from "@/types/billing";

export function mapStripeSubscriptionStatus(status: string): SubscriptionStatus {
  if (isSubscriptionStatus(status)) {
    return status;
  }
  return "incomplete";
}

export function toIso(unixSeconds: number | null | undefined): string | null {
  if (unixSeconds === null || unixSeconds === undefined) {
    return null;
  }
  return new Date(unixSeconds * 1000).toISOString();
}
