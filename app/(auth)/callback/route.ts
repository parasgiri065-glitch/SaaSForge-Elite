import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { oauthCallbackQuerySchema } from "@/lib/security/api-schemas";
import { isolateUnknownError } from "@/lib/errors/isolate-unknown-error";

/**
 * GET /callback
 *
 * Exchange a PKCE `code` for a session, then redirect to a same-origin `next`.
 *
 * @param request - OAuth callback with `code` and optional `next` query params.
 * @returns A redirect to `next` (default `/dashboard`) or `/login?error=…`.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = oauthCallbackQuerySchema.safeParse({
    code: url.searchParams.get("code") ?? undefined,
    next: url.searchParams.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/login?error=invalid_callback", url.origin));
  }

  const nextPath = parsed.data.next ?? "/dashboard";

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(parsed.data.code);
    if (error) {
      return NextResponse.redirect(new URL("/login?error=auth_callback", url.origin));
    }
    return NextResponse.redirect(new URL(nextPath, url.origin));
  } catch (error: unknown) {
    const isolated = isolateUnknownError(error, "auth_callback");
    console.error("[auth.callback]", isolated.code, isolated.name);
    return NextResponse.redirect(new URL("/login?error=auth_callback", url.origin));
  }
}
