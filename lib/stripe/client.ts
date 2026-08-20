import "server-only";

import Stripe from "stripe";
import { serverEnv } from "@/lib/env.server";

let stripeClient: Stripe | null = null;

/**
 * Lazy singleton Stripe SDK (secret key from `serverEnv`).
 *
 * @returns The process-wide Stripe client.
 */
export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(serverEnv.stripeSecretKey);
  }
  return stripeClient;
}
