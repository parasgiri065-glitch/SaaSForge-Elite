import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicEnv } from "@/lib/env";
import { isAuthPage, isPublicPath } from "@/lib/auth/public-paths";
import type { Database } from "@/types/database";

/**
 * Refresh the Supabase JWT and perform optimistic redirects.
 * This is NOT the authorization boundary — layouts and route handlers
 * must call getClaims() / getUser() themselves.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabaseUrl = publicEnv.supabaseUrl;
  const supabaseAnonKey = publicEnv.supabaseAnonKey;
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  let hasUser = false;
  try {
    const { data } = await supabase.auth.getClaims();
    hasUser = Boolean(data?.claims?.sub);
  } catch {
    hasUser = false;
  }
  const { pathname } = request.nextUrl;

  if (!hasUser && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (hasUser && isAuthPage(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
