import "server-only";

import { serverEnvSchema } from "@/lib/security/env-schema";

type ServerEnvKey = keyof typeof serverEnvSchema.shape;

/**
 * Parse a required server env value through Zod (rejects `YOUR_` placeholders).
 *
 * @param name - Env key that must be present and well-formed.
 * @returns The trimmed string value.
 * @throws When missing, empty, or a documented placeholder.
 */
function requiredEnv(name: ServerEnvKey): string {
  const result = serverEnvSchema.shape[name].safeParse(process.env[name] ?? "");
  if (!result.success) {
    throw new Error(
      `[SaaSForge] Invalid or missing server secret "${name}". Copy .env.example to .env.local.`,
    );
  }
  return result.data;
}

/**
 * Lazy server secrets. Getters throw only when a secret is actually read,
 * so the public demo can boot without real Stripe/Supabase/Lemon keys.
 */
export const serverEnv = {
  get supabaseServiceRoleKey(): string {
    return requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
  get stripeSecretKey(): string {
    return requiredEnv("STRIPE_SECRET_KEY");
  },
  get stripeWebhookSecret(): string {
    return requiredEnv("STRIPE_WEBHOOK_SECRET");
  },
  get stripePriceStarter(): string {
    return process.env.STRIPE_PRICE_STARTER?.trim() ?? "";
  },
  get stripePriceGrowth(): string {
    return process.env.STRIPE_PRICE_GROWTH?.trim() ?? "";
  },
  get stripePriceEnterprise(): string {
    return process.env.STRIPE_PRICE_ENTERPRISE?.trim() ?? "";
  },
  get openaiApiKey(): string {
    return process.env.OPENAI_API_KEY?.trim() ?? "";
  },
  get geminiApiKey(): string {
    const value = process.env.GEMINI_API_KEY?.trim() ?? "";
    if (value.length === 0 || value.includes("YOUR_")) {
      return "";
    }
    return value;
  },
  get lemonSqueezyWebhookSecret(): string {
    return requiredEnv("LEMONSQUEEZY_WEBHOOK_SECRET");
  },
  get githubPatToken(): string {
    return requiredEnv("GITHUB_PAT_TOKEN");
  },
  get githubOwner(): string {
    return requiredEnv("GITHUB_OWNER");
  },
  get githubRepo(): string {
    return requiredEnv("GITHUB_REPO");
  },
} as const;
