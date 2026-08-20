import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requirePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * User-scoped server client (anon key). RLS is enforced on every query.
 * Never use `createAdminClient()` from Server Components or user routes.
 *
 * @returns A typed server Supabase client bound to request cookies.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    requirePublicEnv("supabaseUrl"),
    requirePublicEnv("supabaseAnonKey"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component. proxy.ts refreshes the session.
          }
        },
      },
    },
  );
}
