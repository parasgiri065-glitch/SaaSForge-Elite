import "server-only";

import { serverEnvSchema } from "@/lib/security/env-schema";

type RequiredSecret =
  "SUPABASE_SERVICE_ROLE_KEY" | "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET";

/**
 * Parse a required server secret through Zod (rejects `YOUR_` placeholders).
 *
 * @param name - Env key that must be present and well-formed.
 * @returns The trimmed secret string.
 * @throws When missing, empty, or a documented placeholder.
 */
function requiredSecret(name: RequiredSecret): string {
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
 * so the public demo can boot without real Stripe/Supabase keys.
 */
export const serverEnv = {
  get supabaseServiceRoleKey(): string {
    return requiredSecret("SUPABASE_SERVICE_ROLE_KEY");
  },
  get stripeSecretKey(): string {
    return requiredSecret("STRIPE_SECRET_KEY");
  },
  get stripeWebhookSecret(): string {
    return requiredSecret("STRIPE_WEBHOOK_SECRET");
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
} as const;
