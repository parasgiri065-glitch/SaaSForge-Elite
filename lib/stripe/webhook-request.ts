import { stripeSignatureSchema } from "@/lib/security/api-schemas";

export const MAX_WEBHOOK_BYTES = 1_048_576;

export type WebhookRequestDenial = {
  ok: false;
  status: 400;
  error:
    "empty_body" | "missing_stripe_signature" | "payload_too_large" | "invalid_signature";
};

export type WebhookRequestGrant = {
  ok: true;
  rawBody: string;
  signature: string;
};

export type WebhookRequestDecision = WebhookRequestDenial | WebhookRequestGrant;

/**
 * Pre-crypto checks on a Stripe webhook request.
 * Signature verification happens after this returns `ok`.
 *
 * @param rawBody - Unparsed request text (never JSON.parse first).
 * @param signature - `Stripe-Signature` header, or `null`.
 * @returns A grant with body+signature, or a 400 denial.
 */
export function inspectWebhookRequest(
  rawBody: string,
  signature: string | null,
): WebhookRequestDecision {
  if (rawBody.length === 0) {
    return { ok: false, status: 400, error: "empty_body" };
  }
  if (rawBody.length > MAX_WEBHOOK_BYTES) {
    return { ok: false, status: 400, error: "payload_too_large" };
  }
  const parsed = stripeSignatureSchema.safeParse(signature);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "missing_stripe_signature" };
  }
  return { ok: true, rawBody, signature: parsed.data };
}
