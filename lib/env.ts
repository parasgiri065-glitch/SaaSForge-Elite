/**
 * Public environment. Safe to import from Client Components.
 * Parsed through Zod — never trust raw process.env in feature code.
 */
import { publicEnvSchema } from "@/lib/security/env-schema";

const parsed = publicEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
});

export const publicEnv = {
  appUrl: parsed.NEXT_PUBLIC_APP_URL,
  appName: parsed.NEXT_PUBLIC_APP_NAME,
  supabaseUrl: parsed.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  stripePublishableKey: parsed.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
} as const;

export const isDemoMode = parsed.NEXT_PUBLIC_DEMO_MODE === "true";

/**
 * Read a required public env value or throw a boot-time error.
 *
 * @param name - Key on `publicEnv`.
 * @returns The non-empty string value.
 * @throws When the value is empty (misconfigured `.env.local`).
 */
export function requirePublicEnv(name: keyof typeof publicEnv): string {
  const value = publicEnv[name];
  if (!value) {
    throw new Error(
      `[SaaSForge] Missing public environment variable for "${name}". Copy .env.example to .env.local.`,
    );
  }
  return value;
}
