import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { plainTextStreamResponse } from "@/lib/agents/plain-text-stream-response";
import { AGENT_SYSTEM_PROMPT } from "@/lib/agents/system-prompt";
import { isolateUnknownError } from "@/lib/errors/isolate-unknown-error";
import { parseJsonUnknown } from "@/lib/http/parse-json-unknown";
import { jsonResponse } from "@/lib/http/json-response";
import { agentStreamBodySchema } from "@/lib/security/api-schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const GEMINI_CHAT_MODEL = "gemini-1.5-flash";

const DEMO_STREAM_MESSAGE =
  "Welcome to the SaaSForge Elite demo. In production, this workspace is powered by Google Gemini. Add your GEMINI_API_KEY to unlock full inference.";

/**
 * POST /api/ai/stream
 *
 * Vercel AI SDK (`streamText`) + official Google Gemini provider.
 * Reads `process.env.GEMINI_API_KEY`. If the key is missing, returns a
 * clean demo stream instead of crashing.
 *
 * @param request - JSON `{ prompt, messages? }`.
 * @returns A UTF-8 text stream, or JSON 4xx/5xx on failure.
 */
export async function POST(request: Request) {
  const geminiApiKey = (process.env.GEMINI_API_KEY ?? "").trim();

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

  // ── Graceful fallback ──────────────────────────────────────────────
  if (geminiApiKey.length === 0 || geminiApiKey.includes("YOUR_")) {
    console.log("[ai.stream] GEMINI_API_KEY missing — serving demo stream");
    return plainTextStreamResponse(asyncGeneratorFrom(DEMO_STREAM_MESSAGE));
  }

  try {
    const google = createGoogleGenerativeAI({ apiKey: geminiApiKey });
    const history = parsedBody.data.messages ?? [];
    const result = streamText({
      model: google(GEMINI_CHAT_MODEL),
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
        console.error("[ai.stream] gemini onError", isolated);
      },
    });

    return plainTextStreamResponse(result.textStream);
  } catch (error: unknown) {
    const isolated = isolateUnknownError(error, "stream_failed");
    console.error("[ai.stream] gemini failed", isolated);
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

// ── Helper: turn a static string into an async generator for the demo fallback ──

async function* asyncGeneratorFrom(value: string): AsyncGenerator<string> {
  yield value;
}