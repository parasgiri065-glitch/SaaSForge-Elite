import { emptyJsonBodySchema } from "@/lib/security/api-schemas";

export type EmptyJsonBodyInspection =
  { ok: true } | { ok: false; status: 400; error: "invalid_json" | "unexpected_body" };

/**
 * Inspect a raw request body that must be empty or a strict `{}`.
 * Used by POST /api/stripe/portal so clients cannot smuggle a customer id.
 *
 * @param rawText - The unread request body as text (may be empty).
 * @returns `{ ok: true }` when the body is empty/`{}`, otherwise a 400 denial.
 */
export function inspectEmptyJsonBody(rawText: string): EmptyJsonBodyInspection {
  if (rawText.trim().length === 0) {
    return { ok: true };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawText) as unknown;
  } catch {
    return { ok: false, status: 400, error: "invalid_json" };
  }

  const parsed = emptyJsonBodySchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "unexpected_body" };
  }

  return { ok: true };
}
