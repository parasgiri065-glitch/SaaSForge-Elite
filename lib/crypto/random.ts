/**
 * Cryptographically secure random id. Do not use `Math.random()` for IDs.
 *
 * @returns A UUID from `crypto.randomUUID`, or a UUID-shaped hex fallback.
 */
export function randomId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Uniform integer in `[0, maxExclusive)` using rejection sampling.
 *
 * @param maxExclusive - Exclusive upper bound; must be a positive integer.
 * @returns An integer in the requested range.
 * @throws RangeError when `maxExclusive` is not a positive integer.
 */
export function randomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError("maxExclusive must be a positive integer");
  }
  const cap = 0x100000000;
  const limit = cap - (cap % maxExclusive);
  const buffer = new Uint32Array(1);
  let value = 0;
  do {
    globalThis.crypto.getRandomValues(buffer);
    value = buffer[0] ?? 0;
  } while (value >= limit);
  return value % maxExclusive;
}
