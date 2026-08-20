import { describe, expect, it } from "vitest";
import { cn } from "@/lib/ui/cn";
import {
  chatBubbleClassName,
  navLinkClassName,
  subscriptionStatusClassName,
} from "@/lib/ui/layout-classes";
import { inspectEmptyJsonBody } from "@/lib/http/empty-json-body";

describe("cn", () => {
  it("joins truthy fragments and drops falsy ones", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns an empty string when nothing remains", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});

describe("layout variants", () => {
  it("marks the current nav link as active", () => {
    expect(navLinkClassName(true)).toContain("bg-white/10");
    expect(navLinkClassName(false)).toContain("text-white/55");
  });

  it("uses the user bubble fill for human turns", () => {
    expect(chatBubbleClassName(true)).toContain("bg-violet-500");
    expect(chatBubbleClassName(false)).toContain("bg-white/10");
  });

  it("uses emerald for an active subscription chip", () => {
    expect(subscriptionStatusClassName(true)).toContain("emerald");
    expect(subscriptionStatusClassName(false)).toContain("white/60");
  });
});

describe("inspectEmptyJsonBody", () => {
  it("accepts an empty body and a strict empty object", () => {
    expect(inspectEmptyJsonBody("")).toEqual({ ok: true });
    expect(inspectEmptyJsonBody("{}")).toEqual({ ok: true });
  });

  it("rejects invalid JSON and unexpected fields", () => {
    expect(inspectEmptyJsonBody("{")).toEqual({
      ok: false,
      status: 400,
      error: "invalid_json",
    });
    expect(inspectEmptyJsonBody('{"customerId":"cus_hack"}')).toEqual({
      ok: false,
      status: 400,
      error: "unexpected_body",
    });
  });
});
