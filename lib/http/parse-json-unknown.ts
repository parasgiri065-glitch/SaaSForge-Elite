/**
 * Parse JSON without leaking `JSON.parse`'s `any` return type.
 *
 * @param rawText - Raw request/response text.
 * @returns The parsed value as `unknown` (caller must narrow or Zod-parse).
 * @throws SyntaxError when `rawText` is not valid JSON.
 */
export function parseJsonUnknown(rawText: string): unknown {
  const parsed: unknown = JSON.parse(rawText);
  return parsed;
}
