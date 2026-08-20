import { describe, expect, it } from "vitest";
import { inspectLemonSqueezyWebhookRequest } from "@/lib/lemonsqueezy/webhook-request";

describe("inspectLemonSqueezyWebhookRequest", () => {
  it("rejects an empty body before any crypto runs", () => {
    expect(inspectLemonSqueezyWebhookRequest("", "ab".repeat(16))).toEqual({
      ok: false,
      status: 400,
      error: "empty_body",
    });
  });

  it("rejects a missing or blank X-Signature", () => {
    expect(inspectLemonSqueezyWebhookRequest("{}", null)).toEqual({
      ok: false,
      status: 400,
      error: "missing_x_signature",
    });
    expect(inspectLemonSqueezyWebhookRequest("{}", "   ")).toEqual({
      ok: false,
      status: 400,
      error: "missing_x_signature",
    });
  });

  it("rejects a non-hex signature", () => {
    expect(inspectLemonSqueezyWebhookRequest("{}", "not-a-hex-digest!!!!")).toEqual({
      ok: false,
      status: 400,
      error: "missing_x_signature",
    });
  });

  it("accepts a non-empty hex signature for HMAC verification", () => {
    const signature = "a".repeat(64);
    expect(inspectLemonSqueezyWebhookRequest('{"meta":{}}', signature)).toEqual({
      ok: true,
      rawBody: '{"meta":{}}',
      signature,
    });
  });

  it("rejects oversized payloads before signature verification", () => {
    const huge = "x".repeat(1_048_577);
    expect(inspectLemonSqueezyWebhookRequest(huge, "ab".repeat(16))).toEqual({
      ok: false,
      status: 400,
      error: "payload_too_large",
    });
  });
});
