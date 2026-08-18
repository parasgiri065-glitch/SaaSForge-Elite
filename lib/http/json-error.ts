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
