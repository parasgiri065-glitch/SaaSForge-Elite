import { DEMO_AGENT_REPLY } from "@/lib/agents/demo-reply";
import { randomInt } from "@/lib/crypto/random";

/**
 * Yield the demo reply in small chunks so the chat UI can exercise streaming.
 *
 * @param onTokenChunk - Called with each incremental substring.
 * @param abortSignal - Aborts the loop when the user hits Stop.
 * @returns Resolves when the full reply has been emitted.
 * @throws DOMException `AbortError` when `abortSignal` fires.
 */
export async function simulateAgentTokenStream(
  onTokenChunk: (chunk: string) => void,
  abortSignal: AbortSignal,
): Promise<void> {
  let offset = 0;
  while (offset < DEMO_AGENT_REPLY.length) {
    if (abortSignal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    const chunkSize = offset < 24 ? 2 : 1 + randomInt(4);
    const nextChunk = DEMO_AGENT_REPLY.slice(offset, offset + chunkSize);
    offset += chunkSize;
    onTokenChunk(nextChunk);
    await new Promise((resolve) => {
      window.setTimeout(resolve, 16 + randomInt(22));
    });
  }
}
