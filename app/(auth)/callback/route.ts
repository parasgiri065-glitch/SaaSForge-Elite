import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { oauthCallbackQuerySchema } from "@/lib/security/api-schemas";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = oauthCallbackQuerySchema.safeParse({
    code: url.searchParams.get("code") ?? undefined,
    next: url.searchParams.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/login?error=invalid_callback", url.origin));
  }

  const next = parsed.data.next ?? "/dashboard";

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(parsed.data.code);
    if (error) {
      return NextResponse.redirect(new URL("/login?error=auth_callback", url.origin));
    }
    return NextResponse.redirect(new URL(next, url.origin));
  } catch {
    return NextResponse.redirect(new URL("/login?error=auth_callback", url.origin));
  }
}
