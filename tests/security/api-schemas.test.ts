import { describe, expect, it } from "vitest";
import {
  emptyJsonBodySchema,
  oauthCallbackQuerySchema,
} from "@/lib/security/api-schemas";
import { randomInt } from "@/lib/crypto/random";

describe("oauthCallbackQuerySchema", () => {
  it("rejects open redirects", () => {
    expect(
      oauthCallbackQuerySchema.safeParse({
        code: "pkce_code_value",
        next: "https://evil.example",
      }).success,
    ).toBe(false);
    expect(
      oauthCallbackQuerySchema.safeParse({
        code: "pkce_code_value",
        next: "//evil.example",
      }).success,
    ).toBe(false);
    expect(
      oauthCallbackQuerySchema.safeParse({
        code: "pkce_code_value",
        next: "/\\n/evil",
      }).success,
    ).toBe(false);
  });

  it("allows same-origin relative paths", () => {
    const parsed = oauthCallbackQuerySchema.parse({
      code: "pkce_code_value",
      next: "/dashboard",
    });
    expect(parsed.next).toBe("/dashboard");
  });
});

describe("emptyJsonBodySchema", () => {
  it("rejects unexpected client fields", () => {
    expect(emptyJsonBodySchema.safeParse({ customerId: "cus_hack" }).success).toBe(false);
    expect(emptyJsonBodySchema.safeParse({}).success).toBe(true);
  });
});

describe("randomInt", () => {
  it("stays in range without Math.random", () => {
    for (let index = 0; index < 32; index += 1) {
      const value = randomInt(10);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(10);
    }
  });
});
