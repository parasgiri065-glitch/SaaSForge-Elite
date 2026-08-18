const PUBLIC_EXACT = new Set([
  "/",
  "/login",
  "/signup",
  "/callback",
  "/api/health",
  "/api/stripe/webhook",
]);

const PUBLIC_PREFIXES = ["/callback", "/api/webhooks", "/api/health", "/demo"] as const;

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) {
    return true;
  }
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isAuthPage(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup";
}
