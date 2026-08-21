/**
 * Read a UTF-8 byte stream into string chunks (Vercel AI SDK text stream).
 *
 * @param body - `response.body` from POST /api/ai/stream.
 * @param onTokenChunk - Called with each decoded substring.
 * @param abortSignal - Aborts the reader when the user hits Stop.
 * @returns Resolves when the stream ends.
 * @throws DOMException `AbortError` when aborted.
 */
export async function consumeTextStream(
  body: ReadableStream<Uint8Array>,
  onTokenChunk: (chunk: string) => void,
  abortSignal: AbortSignal,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      if (abortSignal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      const { done, value } = await reader.read();
      if (done) {
        const tail = decoder.decode();
        if (tail.length > 0) {
          onTokenChunk(tail);
        }
        return;
      }
      const chunk = decoder.decode(value, { stream: true });
      if (chunk.length > 0) {
        onTokenChunk(chunk);
      }
    }
  } finally {
    reader.releaseLock();
  }
}
