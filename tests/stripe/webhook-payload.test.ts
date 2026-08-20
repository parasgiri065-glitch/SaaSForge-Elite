import { describe, expect, it } from "vitest";
import {
  readFirstSubscriptionItemIds,
  readInvoiceSubscriptionId,
  readObjectRecord,
  readStripeCustomerId,
  readSubscriptionBillingPeriod,
  readUnixTimestampField,
} from "@/lib/stripe/webhook-payload";

describe("readObjectRecord", () => {
  it("returns null for primitives", () => {
    expect(readObjectRecord(null)).toBeNull();
    expect(readObjectRecord("cus_1")).toBeNull();
  });

  it("returns the object as a record", () => {
    expect(readObjectRecord({ id: "cus_1" })).toEqual({ id: "cus_1" });
  });
});

describe("readUnixTimestampField", () => {
  it("reads numbers and ignores other types", () => {
    expect(
      readUnixTimestampField({ current_period_end: 1_700_000_000 }, "current_period_end"),
    ).toBe(1_700_000_000);
    expect(
      readUnixTimestampField({ current_period_end: "nope" }, "current_period_end"),
    ).toBeNull();
  });
});

describe("readStripeCustomerId", () => {
  it("normalizes string and object customers", () => {
    expect(readStripeCustomerId(null)).toBeNull();
    expect(readStripeCustomerId("cus_abc")).toBe("cus_abc");
    expect(readStripeCustomerId({ id: "cus_obj" })).toBe("cus_obj");
  });
});

describe("readInvoiceSubscriptionId", () => {
  it("reads a top-level string subscription", () => {
    expect(readInvoiceSubscriptionId({ subscription: "sub_direct" })).toBe("sub_direct");
  });

  it("reads nested parent.subscription_details.subscription", () => {
    expect(
      readInvoiceSubscriptionId({
        parent: { subscription_details: { subscription: "sub_nested" } },
      }),
    ).toBe("sub_nested");
  });

  it("returns null when the invoice is not subscription-backed", () => {
    expect(readInvoiceSubscriptionId({})).toBeNull();
  });
});

describe("readSubscriptionBillingPeriod", () => {
  it("prefers item timestamps over the parent", () => {
    expect(
      readSubscriptionBillingPeriod({
        items: {
          data: [{ current_period_start: 100, current_period_end: 200 }],
        },
        current_period_start: 1,
        current_period_end: 2,
      }),
    ).toEqual({
      periodStartIso: new Date(100_000).toISOString(),
      periodEndIso: new Date(200_000).toISOString(),
    });
  });
});

describe("readFirstSubscriptionItemIds", () => {
  it("returns nulls when there is no price", () => {
    expect(readFirstSubscriptionItemIds({ items: { data: [] } })).toEqual({
      stripePriceId: null,
      stripeProductId: null,
    });
  });

  it("reads price and product ids from the first item", () => {
    expect(
      readFirstSubscriptionItemIds({
        items: {
          data: [{ price: { id: "price_1", product: "prod_1" } }],
        },
      }),
    ).toEqual({
      stripePriceId: "price_1",
      stripeProductId: "prod_1",
    });
  });
});
