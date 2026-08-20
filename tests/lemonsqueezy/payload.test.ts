import { describe, expect, it } from "vitest";
import { githubUsernameSchema } from "@/lib/security/api-schemas";
import {
  LEMON_SQUEEZY_ORDER_CREATED,
  lemonSqueezyWebhookPayloadSchema,
  readGithubUsernameFromPayload,
} from "@/lib/lemonsqueezy/payload";

describe("lemonSqueezyWebhookPayloadSchema", () => {
  it("parses order_created with a github username", () => {
    const parsed = lemonSqueezyWebhookPayloadSchema.parse({
      meta: {
        event_name: LEMON_SQUEEZY_ORDER_CREATED,
        custom_data: { github_username: "octocat", store_id: 1 },
      },
      data: { type: "orders" },
    });
    expect(readGithubUsernameFromPayload(parsed)).toBe("octocat");
  });

  it("returns null when custom_data is missing", () => {
    const parsed = lemonSqueezyWebhookPayloadSchema.parse({
      meta: { event_name: LEMON_SQUEEZY_ORDER_CREATED },
    });
    expect(readGithubUsernameFromPayload(parsed)).toBeNull();
  });

  it("returns null for an invalid GitHub login", () => {
    const parsed = lemonSqueezyWebhookPayloadSchema.parse({
      meta: {
        event_name: LEMON_SQUEEZY_ORDER_CREATED,
        custom_data: { github_username: "-evil-" },
      },
    });
    expect(readGithubUsernameFromPayload(parsed)).toBeNull();
  });
});

describe("githubUsernameSchema", () => {
  it("accepts legal GitHub logins", () => {
    expect(githubUsernameSchema.parse("a")).toBe("a");
    expect(githubUsernameSchema.parse("octocat")).toBe("octocat");
    expect(githubUsernameSchema.parse("Some-User-1")).toBe("Some-User-1");
  });

  it("rejects illegal GitHub logins", () => {
    expect(githubUsernameSchema.safeParse("").success).toBe(false);
    expect(githubUsernameSchema.safeParse("-lead").success).toBe(false);
    expect(githubUsernameSchema.safeParse("trail-").success).toBe(false);
    expect(githubUsernameSchema.safeParse("has space").success).toBe(false);
  });
});
