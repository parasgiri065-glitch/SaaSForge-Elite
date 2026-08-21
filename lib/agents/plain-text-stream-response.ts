/**
 * Pull an async iterable of UTF-8 text deltas into a byte `Response`.
 *
 * `streamText().toTextStreamResponse()` is lazy in AI SDK 7 and can close
 * with zero bytes on Vercel if nothing subscribes. Iterating `textStream`
 * forces the Groq request to run and encodes chunks for the browser.
 *
 * @param textDeltas - `result.textStream` from `streamText`.
 * @returns `text/plain` streaming HTTP response.
 */
export function plainTextStreamResponse(textDeltas: AsyncIterable<string>): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let emittedChars = 0;
        for await (const delta of textDeltas) {
          if (delta.length === 0) {
            continue;
          }
          emittedChars += delta.length;
          controller.enqueue(encoder.encode(delta));
        }
        if (emittedChars === 0) {
          controller.error(new Error("The model returned no text"));
          return;
        }
        controller.close();
      } catch (error: unknown) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
