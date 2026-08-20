import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js 16 request boundary (replaces `middleware.ts`).
 * Refreshes the Supabase session cookie; not an authorization boundary.
 *
 * @param request - Incoming request matching `config.matcher`.
 * @returns The response from `updateSession`.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
