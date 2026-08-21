import { describe, expect, it } from "vitest";
import { agentStreamBodySchema } from "@/lib/security/api-schemas";

describe("agentStreamBodySchema", () => {
  it("accepts a prompt", () => {
    expect(agentStreamBodySchema.parse({ prompt: "Explain RLS" }).prompt).toBe(
      "Explain RLS",
    );
  });

  it("rejects an empty prompt", () => {
    expect(agentStreamBodySchema.safeParse({ prompt: "   " }).success).toBe(false);
  });

  it("accepts prior turns", () => {
    const parsed = agentStreamBodySchema.parse({
      prompt: "And billing?",
      messages: [{ role: "user", content: "What is tenancy?" }],
    });
    expect(parsed.messages?.[0]?.role).toBe("user");
  });
});
