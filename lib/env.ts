/**
 * Public environment. Safe to import from Client Components.
 * Server secrets live in `lib/env.server.ts` (blocked from the client bundle).
 */
export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "SaaSForge Elite",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "",
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
} as const;

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export function requirePublicEnv(name: keyof typeof publicEnv): string {
  const value = publicEnv[name];
  if (!value) {
    throw new Error(
      `[SaaSForge] Missing public environment variable for "${name}". Copy .env.example to .env.local.`,
    );
  }
  return value;
}
