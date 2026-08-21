const PUBLIC_EXACT = new Set([
  "/",
  "/login",
  "/signup",
  "/callback",
  "/api/health",
  "/api/stripe/webhook",
]);

const PUBLIC_PREFIXES = [
  "/callback",
  "/api/webhooks",
  "/api/health",
  "/api/ai",
  "/demo",
] as const;

/**
 * Whether `proxy.ts` should skip the login redirect for this path.
 * This is NOT the authorization boundary — layouts still call `requireUser()`.
 *
 * @param pathname - Request pathname (no origin).
 * @returns `true` for marketing, auth, health, webhooks, and `/demo/*`.
 */
export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) {
    return true;
  }
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Whether the path is an auth page that signed-in users should bounce away from.
 *
 * @param pathname - Request pathname.
 * @returns `true` for `/login` and `/signup`.
 */
export function isAuthPage(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup";
}
