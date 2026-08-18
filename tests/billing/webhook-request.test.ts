import { describe, expect, it } from "vitest";
import { inspectWebhookRequest } from "@/lib/stripe/webhook-request";

describe("inspectWebhookRequest", () => {
  it("rejects an empty body before any crypto runs", () => {
    expect(inspectWebhookRequest("", "t=1,v1=abc")).toEqual({
      ok: false,
      status: 400,
      error: "empty_body",
    });
  });

  it("rejects a missing or blank Stripe-Signature", () => {
    expect(inspectWebhookRequest("{}", null)).toEqual({
      ok: false,
      status: 400,
      error: "missing_stripe_signature",
    });
    expect(inspectWebhookRequest("{}", "   ")).toEqual({
      ok: false,
      status: 400,
      error: "missing_stripe_signature",
    });
  });

  it("accepts a non-empty signed payload for constructEvent", () => {
    expect(inspectWebhookRequest('{"id":"evt_1"}', "t=1,v1=abc")).toEqual({
      ok: true,
      rawBody: '{"id":"evt_1"}',
      signature: "t=1,v1=abc",
    });
  });
});
