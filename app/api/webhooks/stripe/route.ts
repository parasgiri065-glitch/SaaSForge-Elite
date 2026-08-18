import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { processStripeEvent } from "@/lib/stripe/webhook";
import { createAdminClient } from "@/lib/supabase/admin";
import { serverEnv } from "@/lib/env.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(status: number, body: Record<string, string>) {
  return NextResponse.json(body, { status });
}

/**
 * POST /api/webhooks/stripe
 *
 * Trust order:
 * 1. Require Stripe-Signature
 * 2. Verify with the raw body (never JSON.parse first)
 * 3. Deduplicate on event.id
 * 4. Apply billing mutations with the service-role client
 */
export async function POST(request: Request) {
  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch (error) {
    console.error("[stripe.webhook] failed to read body", error);
    return json(400, { error: "invalid_body" });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return json(400, { error: "missing_stripe_signature" });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      serverEnv.stripeWebhookSecret,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid signature";
    console.error("[stripe.webhook] signature verification failed", message);
    return json(400, { error: "invalid_signature" });
  }

  const admin = createAdminClient();

  try {
    const { data: existing, error: lookupError } = await admin
      .from("stripe_webhook_events")
      .select("id, processed_at, error")
      .eq("id", event.id)
      .maybeSingle();

    if (lookupError) {
      throw new Error(lookupError.message);
    }

    if (existing?.processed_at && !existing.error) {
      return json(200, { status: "duplicate" });
    }

    if (!existing) {
      const { error: insertError } = await admin
        .from("stripe_webhook_events")
        .insert({ id: event.id, type: event.type });
      if (insertError && insertError.code !== "23505") {
        throw new Error(insertError.message);
      }
    }

    await processStripeEvent(event);

    const { error: updateError } = await admin
      .from("stripe_webhook_events")
      .update({
        processed_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", event.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return json(200, { status: "ok", type: event.type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    console.error("[stripe.webhook] processing failed", event.id, event.type, message);

    try {
      await admin
        .from("stripe_webhook_events")
        .update({ error: message })
        .eq("id", event.id);
    } catch (persistError) {
      console.error("[stripe.webhook] failed to persist error", persistError);
    }

    return json(500, { error: "processing_failed" });
  }
}

export function GET() {
  return json(405, { error: "method_not_allowed" });
}
