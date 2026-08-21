import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { plainTextStreamResponse } from "@/lib/agents/plain-text-stream-response";
import { readGroqApiKey } from "@/lib/agents/read-groq-api-key";
import { AGENT_SYSTEM_PROMPT } from "@/lib/agents/system-prompt";
import { isolateUnknownError } from "@/lib/errors/isolate-unknown-error";
import { parseJsonUnknown } from "@/lib/http/parse-json-unknown";
import { jsonResponse } from "@/lib/http/json-response";
import { agentStreamBodySchema } from "@/lib/security/api-schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const GROQ_CHAT_MODEL = "llama-3.1-8b-instant";

const MISSING_KEY_MESSAGE = "API Key missing in environment";

/**
 * POST /api/ai/stream
 *
 * Vercel AI SDK (`streamText`) + official Groq provider.
 * Reads `process.env.GROQ_API_KEY`. Does **not** bind Groq to
 * `request.signal` — on Vercel that abort fires when the POST body is
 * consumed and kills the model before any tokens.
 *
 * @param request - JSON `{ prompt, messages? }`.
 * @returns A UTF-8 text stream, or JSON 4xx/5xx on failure.
 */
export async function POST(request: Request) {
  const groqApiKey = readGroqApiKey(process.env.GROQ_API_KEY);
  if (groqApiKey === null) {
    console.error("[ai.stream] GROQ_API_KEY is undefined or a placeholder");
    return jsonResponse(500, { error: MISSING_KEY_MESSAGE });
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

    return plainTextStreamResponse(result.textStream);
  } catch (error: unknown) {
    const isolated = isolateUnknownError(error, "stream_failed");
    console.error("[ai.stream] groq failed", isolated);
    return jsonResponse(500, { error: isolated.message });
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
