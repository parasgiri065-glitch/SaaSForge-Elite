"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requirePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Browser client (anon / publishable key only). RLS applies.
 * The service-role key must never enter this bundle.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    requirePublicEnv("supabaseUrl"),
    requirePublicEnv("supabaseAnonKey"),
  );
}
