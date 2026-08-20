/**
 * Explicit, UI-safe view of an unknown catch value.
 * Never assign `error` from a catch clause straight to a string or JSON body.
 */
export type IsolatedRuntimeError = {
  name: string;
  message: string;
  code: string;
};

/**
 * Whether a value is a non-null object we can read named fields from.
 *
 * @param value - Catch value or JSON body.
 * @returns `true` when `value` is a plain object (not an array).
 */
function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Read a string field off an unknown object.
 *
 * @param record - Narrowed object.
 * @param fieldName - Property to read.
 * @returns The string, or `null` when missing / wrong type.
 */
function readStringField(
  record: Record<string, unknown>,
  fieldName: string,
): string | null {
  const fieldValue = record[fieldName];
  return typeof fieldValue === "string" && fieldValue.length > 0 ? fieldValue : null;
}

/**
 * Isolate an unknown runtime error into a typed structure before any UI/API
 * alert is built. `code` is a stable machine token; `message` is human-readable.
 *
 * @param error - The `catch` binding (`unknown` under `useUnknownInCatchVariables`).
 * @param fallbackCode - Machine code used when the value has no identity.
 * @returns `{ name, message, code }` safe to log or map onto a JSON error body.
 */
export function isolateUnknownError(
  error: unknown,
  fallbackCode: string,
): IsolatedRuntimeError {
  if (error instanceof Error) {
    return {
      name: error.name || "Error",
      message: error.message || fallbackCode,
      code: fallbackCode,
    };
  }

  if (typeof error === "string" && error.length > 0) {
    return {
      name: "Error",
      message: error,
      code: fallbackCode,
    };
  }

  if (isObjectRecord(error)) {
    const message = readStringField(error, "message") ?? fallbackCode;
    const name = readStringField(error, "name") ?? "Error";
    const code = readStringField(error, "code") ?? fallbackCode;
    return { name, message, code };
  }

  return {
    name: "UnknownError",
    message: fallbackCode,
    code: fallbackCode,
  };
}
