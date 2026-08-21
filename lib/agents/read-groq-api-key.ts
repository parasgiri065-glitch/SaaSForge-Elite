/**
 * Read and validate a Groq API key without throwing.
 *
 * @param rawKey - `process.env.GROQ_API_KEY` (injectable in tests).
 * @returns The trimmed key, or `null` when missing / placeholder.
 */
export function readGroqApiKey(
  rawKey: string | undefined = process.env.GROQ_API_KEY,
): string | null {
  if (typeof rawKey !== "string") {
    return null;
  }
  const trimmed = rawKey.trim();
  if (trimmed.length === 0 || trimmed.includes("YOUR_")) {
    return null;
  }
  return trimmed;
}
