"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requirePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    requirePublicEnv("supabaseUrl"),
    requirePublicEnv("supabaseAnonKey"),
  );
}
