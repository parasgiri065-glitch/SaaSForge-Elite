import { describe, expect, it } from "vitest";
import { readGroqApiKey } from "@/lib/agents/read-groq-api-key";

describe("readGroqApiKey", () => {
  it("returns null when the key is missing", () => {
    expect(readGroqApiKey(undefined)).toBeNull();
  });

  it("returns null for empty or placeholder values", () => {
    expect(readGroqApiKey("")).toBeNull();
    expect(readGroqApiKey("   ")).toBeNull();
    expect(readGroqApiKey("gsk_YOUR_GROQ_API_KEY")).toBeNull();
  });

  it("returns the trimmed key when it is set", () => {
    expect(readGroqApiKey(" gsk_live_abc123 ")).toBe("gsk_live_abc123");
  });
});
