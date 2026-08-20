/**
 * Read an `error` string from an unknown JSON body.
 *
 * @param body - Parsed JSON, or `null` when parsing failed.
 * @param fallback - Returned when `error` is missing or empty.
 * @returns A non-empty error message.
 */
export function readJsonError(body: unknown, fallback: string): string {
  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string" &&
    body.error.length > 0
  ) {
    return body.error;
  }
  return fallback;
}

/**
 * Read a `url` string from an unknown JSON body (Stripe portal response).
 *
 * @param body - Parsed JSON, or `null` when parsing failed.
 * @returns The URL, or `null` when missing.
 */
export function readJsonUrl(body: unknown): string | null {
  if (
    typeof body === "object" &&
    body !== null &&
    "url" in body &&
    typeof body.url === "string" &&
    body.url.length > 0
  ) {
    return body.url;
  }
  return null;
}
