import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyLemonSqueezySignature } from "@/lib/lemonsqueezy/verify-signature";

function sign(rawBody: string, secret: string): string {
  return createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
}

describe("verifyLemonSqueezySignature", () => {
  it("accepts a matching HMAC-SHA256 hex digest", () => {
    const rawBody = '{"meta":{"event_name":"order_created"}}';
    const secret = "whsec_test_secret_value";
    expect(verifyLemonSqueezySignature(rawBody, sign(rawBody, secret), secret)).toBe(
      true,
    );
  });

  it("rejects a tampered body", () => {
    const secret = "whsec_test_secret_value";
    const signature = sign('{"ok":true}', secret);
    expect(verifyLemonSqueezySignature('{"ok":false}', signature, secret)).toBe(false);
  });

  it("rejects a different secret", () => {
    const rawBody = "{}";
    const signature = sign(rawBody, "secret-a");
    expect(verifyLemonSqueezySignature(rawBody, signature, "secret-b")).toBe(false);
  });

  it("rejects a length-mismatched signature without throwing", () => {
    expect(verifyLemonSqueezySignature("{}", "abc", "secret")).toBe(false);
  });
});
