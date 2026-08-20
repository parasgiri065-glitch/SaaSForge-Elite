import { isObjectRecord } from "@/lib/types/object-record";

/**
 * Read an `error` string from an unknown JSON body.
 *
 * @param body - Parsed JSON, or `null` when parsing failed.
 * @param fallback - Returned when `error` is missing or empty.
 * @returns A non-empty error message.
 */
export function readJsonError(body: unknown, fallback: string): string {
  if (!isObjectRecord(body)) {
    return fallback;
  }
  const errorValue = body["error"];
  return typeof errorValue === "string" && errorValue.length > 0 ? errorValue : fallback;
}

/**
 * Read a `url` string from an unknown JSON body (Stripe portal response).
 *
 * @param body - Parsed JSON, or `null` when parsing failed.
 * @returns The URL, or `null` when missing.
 */
export function readJsonUrl(body: unknown): string | null {
  if (!isObjectRecord(body)) {
    return null;
  }
  const urlValue = body["url"];
  return typeof urlValue === "string" && urlValue.length > 0 ? urlValue : null;
}
