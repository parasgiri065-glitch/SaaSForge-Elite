import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { processStripeEvent } from "@/lib/stripe/webhook";
import { inspectWebhookRequest } from "@/lib/stripe/webhook-request";
import {
  claimStripeWebhookEvent,
  markStripeWebhookFailed,
  markStripeWebhookProcessed,
} from "@/lib/stripe/webhook-idempotency";
import { createAdminClient } from "@/lib/supabase/admin";
import { serverEnv } from "@/lib/env.server";
import { stripeEventMetaSchema } from "@/lib/security/api-schemas";
import { jsonResponse } from "@/lib/http/json-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/stripe
 *
 * Trust order:
 * 1. Require Stripe-Signature
 * 2. Verify with the raw body (never JSON.parse first)
 * 3. Deduplicate on event.id
 * 4. Apply billing mutations with the service-role client
 *
 * @param request - Incoming webhook request with a raw body.
 * @returns 200 `{ status }` on success/duplicate, 400 on inspect/signature
 *   failure, 500 when processing throws.
 */
export async function POST(request: Request) {
  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch (error) {
    console.error("[stripe.webhook] failed to read body", error);
    return jsonResponse(400, { error: "invalid_body" });
  }

  const inspected = inspectWebhookRequest(
    rawBody,
    request.headers.get("stripe-signature"),
  );
  if (!inspected.ok) {
    return jsonResponse(inspected.status, { error: inspected.error });
  }

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = getStripe().webhooks.constructEvent(
      inspected.rawBody,
      inspected.signature,
      serverEnv.stripeWebhookSecret,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid signature";
    console.error("[stripe.webhook] signature verification failed", message);
    return jsonResponse(400, { error: "invalid_signature" });
  }

  const eventMeta = stripeEventMetaSchema.safeParse({
    id: stripeEvent.id,
    type: stripeEvent.type,
  });
  if (!eventMeta.success) {
    return jsonResponse(400, { error: "invalid_event" });
  }

  const supabaseAdminClient = createAdminClient();

  try {
    const claim = await claimStripeWebhookEvent(
      supabaseAdminClient,
      stripeEvent.id,
      stripeEvent.type,
    );
    if (claim === "duplicate") {
      return jsonResponse(200, { status: "duplicate" });
    }

    await processStripeEvent(stripeEvent);
    await markStripeWebhookProcessed(supabaseAdminClient, stripeEvent.id);

    return jsonResponse(200, { status: "ok", type: stripeEvent.type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    console.error(
      "[stripe.webhook] processing failed",
      stripeEvent.id,
      stripeEvent.type,
      message,
    );
    await markStripeWebhookFailed(supabaseAdminClient, stripeEvent.id, message);
    return jsonResponse(500, { error: "processing_failed" });
  }
}

/**
 * GET /api/webhooks/stripe
 *
 * @returns 405 `{ error: "method_not_allowed" }`.
 */
export function GET() {
  return jsonResponse(405, { error: "method_not_allowed" });
}
