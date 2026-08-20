import type { SubscriptionStatus } from "@/types/database";
import { isSubscriptionStatus } from "@/types/billing";

/**
 * Map a Stripe subscription status string onto our Postgres enum.
 * Unknown values collapse to `"incomplete"` rather than throwing.
 *
 * @param status - Stripe `subscription.status`.
 * @returns A `SubscriptionStatus` we can persist.
 */
export function mapStripeSubscriptionStatus(status: string): SubscriptionStatus {
  if (isSubscriptionStatus(status)) {
    return status;
  }
  return "incomplete";
}

/**
 * Convert Unix seconds to an ISO timestamp.
 *
 * @param unixSeconds - Seconds since epoch, or null/undefined.
 * @returns An ISO string, or `null` when the input is missing.
 */
export function toIso(unixSeconds: number | null | undefined): string | null {
  if (unixSeconds === null || unixSeconds === undefined) {
    return null;
  }
  return new Date(unixSeconds * 1000).toISOString();
}
