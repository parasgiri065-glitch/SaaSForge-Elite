import { describe, expect, it } from "vitest";
import { readSafeInternalPath } from "@/lib/auth/safe-next-path";

describe("readSafeInternalPath", () => {
  it("returns the fallback when the candidate is missing", () => {
    expect(readSafeInternalPath(null, "/dashboard")).toBe("/dashboard");
    expect(readSafeInternalPath("   ", "/dashboard")).toBe("/dashboard");
  });

  it("rejects open redirects", () => {
    expect(readSafeInternalPath("//evil.example", "/dashboard")).toBe("/dashboard");
    expect(readSafeInternalPath("https://evil.example", "/dashboard")).toBe("/dashboard");
    expect(readSafeInternalPath("/\\\\evil", "/dashboard")).toBe("/dashboard");
  });

  it("keeps same-origin relative paths", () => {
    expect(readSafeInternalPath("/settings/billing", "/dashboard")).toBe(
      "/settings/billing",
    );
  });
});
