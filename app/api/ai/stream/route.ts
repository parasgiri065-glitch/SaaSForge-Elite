import { jsonResponse } from "@/lib/http/json-response";
import { agentStreamBodySchema } from "@/lib/security/api-schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEMO_STREAM_MESSAGE =
  "Welcome to the SaaSForge Elite demo. In production, this workspace is powered by Google Gemini. Add your GEMINI_API_KEY to unlock full inference.";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

/**
 * POST /api/ai/stream
 *
 * Directly calls Google Gemini's streaming REST API using fetch().
 * This avoids any AI SDK compatibility issues.
 * Falls back to a demo message when GEMINI_API_KEY is not set.
 */
export async function POST(request: Request) {
  // ── Parse body ──
  let bodyText: string;
  try {
    bodyText = await request.text();
  } catch {
    return jsonResponse(400, { error: "Failed to read request body" });
  }

  let bodyJson: unknown;
  try {
    bodyJson = JSON.parse(bodyText);
  } catch {
    return jsonResponse(400, { error: "Invalid JSON in request body" });
  }

  const parsedBody = agentStreamBodySchema.safeParse(bodyJson);
  if (!parsedBody.success) {
    return jsonResponse(400, { error: "Invalid prompt payload" });
  }

  // ── Check API key ──
  const geminiApiKey = (process.env.GEMINI_API_KEY ?? "").trim();
  if (geminiApiKey.length === 0 || geminiApiKey.includes("YOUR_")) {
    return demoStreamResponse();
  }

  // ── Models to try ──
  const models = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-pro-latest",
  ];

  // ── Build the request ──
  const history = parsedBody.data.messages ?? [];
  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: parsedBody.data.prompt }] },
  ];

  const requestBody = {
    systemInstruction: {
      parts: [{ text: "You are the SaaSForge Elite workspace agent. Help the operator with this product: Next.js 16 App Router, Supabase RLS tenancy, Stripe billing, and Lemon Squeezy fulfillment. Prefer concise, production-grade answers with short code fences when useful." }],
    },
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  let lastError: string | null = null;

  for (const model of models) {
    try {
      const url = `${GEMINI_API_BASE}/models/${model}:streamGenerateContent?key=${encodeURIComponent(geminiApiKey)}&alt=sse`;
      const geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!geminiRes.ok) {
        const errorBody = await geminiRes.text().catch(() => "Unknown error");
        lastError = `${model}: HTTP ${geminiRes.status} - ${errorBody.slice(0, 200)}`;
        continue;
      }

      return streamGeminiResponse(geminiRes);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      lastError = `${model}: ${msg}`;
    }
  }

  return jsonResponse(500, { error: `Gemini error: ${lastError ?? "unknown"}` });
}

export function GET() {
  return jsonResponse(405, { error: "method_not_allowed" });
}

// ── Stream Gemini SSE response ──

function streamGeminiResponse(geminiRes: Response): Response {
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!geminiRes.body) {
          controller.enqueue(encoder.encode("Gemini returned an empty response."));
          controller.close();
          return;
        }

        const reader = geminiRes.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr || jsonStr === "[DONE]") continue;
              try {
                const parsed = JSON.parse(jsonStr);
                const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) controller.enqueue(encoder.encode(text));
              } catch { /* skip */ }
            }
          }
        }

        if (buffer.startsWith("data: ")) {
          const jsonStr = buffer.slice(6).trim();
          if (jsonStr && jsonStr !== "[DONE]") {
            try {
              const parsed = JSON.parse(jsonStr);
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) controller.enqueue(encoder.encode(text));
            } catch { /* skip */ }
          }
        }

        controller.close();
      } catch (error: unknown) {
        controller.enqueue(encoder.encode(error instanceof Error ? error.message : "Stream error"));
        controller.close();
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

// ── Demo stream ──

function demoStreamResponse(): Response {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(DEMO_STREAM_MESSAGE));
        controller.close();
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    }
  );
}
