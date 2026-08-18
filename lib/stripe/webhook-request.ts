export type WebhookRequestDenial = {
  ok: false;
  status: 400;
  error: "empty_body" | "missing_stripe_signature";
};

export type WebhookRequestGrant = {
  ok: true;
  rawBody: string;
  signature: string;
};

export type WebhookRequestDecision = WebhookRequestDenial | WebhookRequestGrant;

/** Pre-crypto checks. Signature verification happens after this returns ok. */
export function inspectWebhookRequest(
  rawBody: string,
  signature: string | null,
): WebhookRequestDecision {
  if (rawBody.length === 0) {
    return { ok: false, status: 400, error: "empty_body" };
  }
  if (!signature || signature.trim().length === 0) {
    return { ok: false, status: 400, error: "missing_stripe_signature" };
  }
  return { ok: true, rawBody, signature };
}
