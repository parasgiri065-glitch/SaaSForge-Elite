import { describe, expect, it } from "vitest";
import { plainTextStreamResponse } from "@/lib/agents/plain-text-stream-response";

async function* deltasOf(...parts: string[]): AsyncIterable<string> {
  for (const part of parts) {
    yield part;
  }
}

describe("plainTextStreamResponse", () => {
  it("concatenates text deltas into a UTF-8 body", async () => {
    const response = plainTextStreamResponse(deltasOf("Hello", " ", "world"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    await expect(response.text()).resolves.toBe("Hello world");
  });

  it("errors when the model emits no text", async () => {
    const response = plainTextStreamResponse(deltasOf());
    await expect(response.text()).rejects.toThrow(/no text/i);
  });
});
