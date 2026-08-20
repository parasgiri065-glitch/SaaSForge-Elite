import "server-only";

import { createClient } from "@supabase/supabase-js";
import { requirePublicEnv } from "@/lib/env";
import { serverEnv } from "@/lib/env.server";
import type { Database } from "@/types/database";

/**
 * Service-role Supabase client. Bypasses RLS.
 * Call only after an independent trust check (verified Stripe signature).
 * Never import this module from Client Components — `server-only` will throw.
 *
 * @returns A typed Supabase JS client using the service-role key.
 */
export function createAdminClient() {
  return createClient<Database>(
    requirePublicEnv("supabaseUrl"),
    serverEnv.supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}

export type SupabaseAdminClient = ReturnType<typeof createAdminClient>;
