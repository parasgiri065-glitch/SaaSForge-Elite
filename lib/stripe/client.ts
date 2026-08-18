import "server-only";

import Stripe from "stripe";
import { serverEnv } from "@/lib/env.server";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(serverEnv.stripeSecretKey);
  }
  return stripeClient;
}
