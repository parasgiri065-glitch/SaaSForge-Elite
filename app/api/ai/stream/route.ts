import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { AGENT_SYSTEM_PROMPT } from "@/lib/agents/system-prompt";
import { isolateUnknownError } from "@/lib/errors/isolate-unknown-error";
import { serverEnv } from "@/lib/env.server";
import { parseJsonUnknown } from "@/lib/http/parse-json-unknown";
import { jsonResponse } from "@/lib/http/json-response";
import { agentStreamBodySchema } from "@/lib/security/api-schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const GROQ_CHAT_MODEL = "llama-3.3-70b-versatile";

/**
 * POST /api/ai/stream
 *
 * Streams a Groq completion (Vercel AI SDK) as a plain text body.
 * Requires `GROQ_API_KEY`. There is no mock fallback.
 *
 * @param request - JSON `{ prompt, messages? }`.
 * @returns A text stream, 400 on bad input, 503 if Groq is not configured, 500 on failure.
 */
export async function POST(request: Request) {
  const groqApiKey = serverEnv.groqApiKey;
  if (!groqApiKey) {
    return jsonResponse(503, { error: "groq_not_configured" });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch (error: unknown) {
    const isolated = isolateUnknownError(error, "invalid_body");
    return jsonResponse(400, { error: isolated.code });
  }

  let parsedJson: unknown;
  try {
    parsedJson = parseJsonUnknown(rawBody);
  } catch (error: unknown) {
    void isolateUnknownError(error, "invalid_json");
    return jsonResponse(400, { error: "invalid_json" });
  }

  const parsedBody = agentStreamBodySchema.safeParse(parsedJson);
  if (!parsedBody.success) {
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
      abortSignal: request.signal,
    });
    return result.toTextStreamResponse();
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
