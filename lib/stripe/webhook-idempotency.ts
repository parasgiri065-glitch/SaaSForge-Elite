import type { SupabaseAdminClient } from "@/lib/supabase/admin";

export type WebhookClaimResult = "duplicate" | "claimed";

/**
 * Claim a Stripe event id in `stripe_webhook_events` before mutation.
 * A row with `processed_at` and no `error` is treated as a successful duplicate.
 *
 * @param supabaseAdminClient - Service-role client used after signature verify.
 * @param stripeEventId - Stripe `event.id` (idempotency key).
 * @param stripeEventType - Stripe `event.type` stored on first insert.
 * @returns `"duplicate"` when already processed, otherwise `"claimed"`.
 */
export async function claimStripeWebhookEvent(
  supabaseAdminClient: SupabaseAdminClient,
  stripeEventId: string,
  stripeEventType: string,
): Promise<WebhookClaimResult> {
  const { data: existingEvent, error: lookupError } = await supabaseAdminClient
    .from("stripe_webhook_events")
    .select("id, processed_at, error")
    .eq("id", stripeEventId)
    .maybeSingle();

  if (lookupError) {
    throw new Error(lookupError.message);
  }

  if (existingEvent?.processed_at && !existingEvent.error) {
    return "duplicate";
  }

  if (!existingEvent) {
    const { error: insertError } = await supabaseAdminClient
      .from("stripe_webhook_events")
      .insert({ id: stripeEventId, type: stripeEventType });
    if (insertError && insertError.code !== "23505") {
      throw new Error(insertError.message);
    }
  }

  return "claimed";
}

/**
 * Mark a claimed event as successfully processed.
 *
 * @param supabaseAdminClient - Service-role client used after signature verify.
 * @param stripeEventId - Stripe `event.id`.
 * @returns Resolves when `processed_at` is set and `error` is cleared.
 */
export async function markStripeWebhookProcessed(
  supabaseAdminClient: SupabaseAdminClient,
  stripeEventId: string,
): Promise<void> {
  const { error: updateError } = await supabaseAdminClient
    .from("stripe_webhook_events")
    .update({
      processed_at: new Date().toISOString(),
      error: null,
    })
    .eq("id", stripeEventId);

  if (updateError) {
    throw new Error(updateError.message);
  }
}

/**
 * Persist a processing failure without throwing (logging is the caller's job).
 *
 * @param supabaseAdminClient - Service-role client used after signature verify.
 * @param stripeEventId - Stripe `event.id`.
 * @param errorMessage - Short failure reason stored on the event row.
 * @returns Resolves after the update attempt (errors are swallowed).
 */
export async function markStripeWebhookFailed(
  supabaseAdminClient: SupabaseAdminClient,
  stripeEventId: string,
  errorMessage: string,
): Promise<void> {
  try {
    await supabaseAdminClient
      .from("stripe_webhook_events")
      .update({ error: errorMessage })
      .eq("id", stripeEventId);
  } catch (persistError) {
    console.error("[stripe.webhook] failed to persist error", persistError);
  }
}
