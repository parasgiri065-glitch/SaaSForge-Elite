import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verify a Lemon Squeezy `X-Signature` HMAC-SHA256 hex digest.
 * Uses Node `crypto` (not Web Crypto) so the comparison is constant-time.
 *
 * @param rawBody - Exact request text used to compute the digest.
 * @param signatureHeader - Hex digest from `X-Signature`.
 * @param webhookSecret - `LEMONSQUEEZY_WEBHOOK_SECRET`.
 * @returns `true` only when the digest matches and lengths are equal.
 */
export function verifyLemonSqueezySignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string,
): boolean {
  const digestHex = createHmac("sha256", webhookSecret)
    .update(rawBody, "utf8")
    .digest("hex");
  const digestBuffer = Buffer.from(digestHex, "utf8");
  const signatureBuffer = Buffer.from(signatureHeader, "utf8");
  if (digestBuffer.length !== signatureBuffer.length) {
    return false;
  }
  return timingSafeEqual(digestBuffer, signatureBuffer);
}
