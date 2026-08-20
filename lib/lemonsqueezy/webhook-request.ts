import { lemonSqueezySignatureSchema } from "@/lib/security/api-schemas";

export const MAX_LEMONSQUEEZY_WEBHOOK_BYTES = 1_048_576;

export type LemonSqueezyWebhookDenial = {
  ok: false;
  status: 400;
  error: "empty_body" | "missing_x_signature" | "payload_too_large";
};

export type LemonSqueezyWebhookGrant = {
  ok: true;
  rawBody: string;
  signature: string;
};

export type LemonSqueezyWebhookDecision =
  LemonSqueezyWebhookDenial | LemonSqueezyWebhookGrant;

/**
 * Pre-crypto checks on a Lemon Squeezy webhook request.
 * HMAC verification happens after this returns `ok`. Never JSON.parse first.
 *
 * @param rawBody - Unparsed request text.
 * @param signature - `X-Signature` header, or `null`.
 * @returns A grant with body+signature, or a 400 denial.
 */
export function inspectLemonSqueezyWebhookRequest(
  rawBody: string,
  signature: string | null,
): LemonSqueezyWebhookDecision {
  if (rawBody.length === 0) {
    return { ok: false, status: 400, error: "empty_body" };
  }
  if (rawBody.length > MAX_LEMONSQUEEZY_WEBHOOK_BYTES) {
    return { ok: false, status: 400, error: "payload_too_large" };
  }
  const parsed = lemonSqueezySignatureSchema.safeParse(signature);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "missing_x_signature" };
  }
  return { ok: true, rawBody, signature: parsed.data };
}
