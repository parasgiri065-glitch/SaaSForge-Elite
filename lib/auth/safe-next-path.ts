/**
 * Accept only same-origin relative paths after login.
 * Blocks protocol-relative (`//evil`) and absolute URLs that would open-redirect.
 *
 * @param candidate - The `next` query value from the login page, or `null`.
 * @param fallbackPath - Path to use when the candidate is missing or unsafe.
 * @returns A path that always starts with a single `/`.
 */
export function readSafeInternalPath(
  candidate: string | null | undefined,
  fallbackPath: string,
): string {
  if (!candidate) {
    return fallbackPath;
  }
  const trimmedPath = candidate.trim();
  if (!trimmedPath.startsWith("/") || trimmedPath.startsWith("//")) {
    return fallbackPath;
  }
  if (trimmedPath.includes("://") || trimmedPath.includes("\\")) {
    return fallbackPath;
  }
  return trimmedPath;
}
