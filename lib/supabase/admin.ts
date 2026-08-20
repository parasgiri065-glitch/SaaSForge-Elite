import "server-only";

import { createClient } from "@supabase/supabase-js";
import { requirePublicEnv } from "@/lib/env";
import { serverEnv } from "@/lib/env.server";
import type { Database } from "@/types/database";

/**
 * Service-role client. Bypasses RLS.
 * Call only after an independent trust check (verified Stripe signature).
 * Never import this module from Client Components — `server-only` will throw.
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
