import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { AGENT_SYSTEM_PROMPT } from "@/lib/agents/system-prompt";
import { isolateUnknownError } from "@/lib/errors/isolate-unknown-error";
import { parseJsonUnknown } from "@/lib/http/parse-json-unknown";
import { jsonResponse } from "@/lib/http/json-response";
import { agentStreamBodySchema } from "@/lib/security/api-schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const GROQ_CHAT_MODEL = "llama-3.1-8b-instant";

/**
 * POST /api/ai/stream
 *
 * Vercel AI SDK + Groq provider. Reads `process.env.GROQ_API_KEY`.
 * Does **not** pass `request.signal` into Groq — on Vercel that abort fires
 * when the body is consumed and kills the stream before any tokens.
 *
 * @param request - JSON `{ prompt, messages? }`.
 * @returns A UTF-8 text stream, or JSON 4xx/5xx on failure.
 */
export async function POST(request: Request) {
  const groqApiKey = process.env.GROQ_API_KEY?.trim() ?? "";
  if (groqApiKey.length === 0 || groqApiKey.includes("YOUR_")) {
    console.error("[ai.stream] GROQ_API_KEY is missing or a placeholder");
    return jsonResponse(503, { error: "groq_not_configured" });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch (error: unknown) {
    const isolated = isolateUnknownError(error, "invalid_body");
    console.error("[ai.stream] failed to read body", isolated);
    return jsonResponse(400, { error: isolated.code });
  }

  let parsedJson: unknown;
  try {
    parsedJson = parseJsonUnknown(rawBody);
  } catch (error: unknown) {
    const isolated = isolateUnknownError(error, "invalid_json");
    console.error("[ai.stream] invalid JSON", isolated);
    return jsonResponse(400, { error: "invalid_json" });
  }

  const parsedBody = agentStreamBodySchema.safeParse(parsedJson);
  if (!parsedBody.success) {
    console.error("[ai.stream] invalid prompt payload", parsedBody.error.issues);
    return jsonResponse(400, { error: "invalid_prompt" });
  }

  try {
    const groq = createGroq({ apiKey: groqApiKey });
    const history = parsedBody.data.messages ?? [];
    const result = streamText({
      model: groq(GROQ_CHAT_MODEL),
      system: AGENT_SYSTEM_PROMPT,
      messages: [
        ...history.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        { role: "user" as const, content: parsedBody.data.prompt },
      ],
      onError({ error }) {
        const isolated = isolateUnknownError(error, "stream_failed");
        console.error("[ai.stream] groq onError", isolated);
      },
    });

    return result.toTextStreamResponse({
      headers: {
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: unknown) {
    const isolated = isolateUnknownError(error, "stream_failed");
    console.error("[ai.stream] groq failed", isolated);
    return jsonResponse(500, { error: isolated.code });
  }
}

/**
 * GET /api/ai/stream
 *
 * @returns 405 `{ error: "method_not_allowed" }`.
 */
export function GET() {
  return jsonResponse(405, { error: "method_not_allowed" });
}
