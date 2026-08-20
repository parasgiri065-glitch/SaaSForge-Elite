import { describe, expect, it } from "vitest";
import { isolateUnknownError } from "@/lib/errors/isolate-unknown-error";

describe("isolateUnknownError", () => {
  it("reads Error instances", () => {
    expect(isolateUnknownError(new TypeError("boom"), "fallback")).toEqual({
      name: "TypeError",
      message: "boom",
      code: "fallback",
    });
  });

  it("reads plain strings", () => {
    expect(isolateUnknownError("nope", "fallback")).toEqual({
      name: "Error",
      message: "nope",
      code: "fallback",
    });
  });

  it("reads object-shaped errors without assuming Error", () => {
    expect(
      isolateUnknownError({ name: "Stripe", message: "bad sig", code: "sig" }, "x"),
    ).toEqual({
      name: "Stripe",
      message: "bad sig",
      code: "sig",
    });
  });

  it("falls back for null and numbers", () => {
    expect(isolateUnknownError(null, "portal_failed")).toEqual({
      name: "UnknownError",
      message: "portal_failed",
      code: "portal_failed",
    });
    expect(isolateUnknownError(0, "portal_failed").code).toBe("portal_failed");
  });
});
