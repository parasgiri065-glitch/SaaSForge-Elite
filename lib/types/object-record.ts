/**
 * Narrow an unknown value to a string-keyed record (not an array).
 *
 * @param value - Any runtime value.
 * @returns `true` when `value` is a non-null, non-array object.
 */
export function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Same check, returning the record or `null` instead of a boolean.
 *
 * @param value - Any runtime value.
 * @returns The record, or `null`.
 */
export function readObjectRecord(value: unknown): Record<string, unknown> | null {
  return isObjectRecord(value) ? value : null;
}
