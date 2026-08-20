import "server-only";

import { serverEnvSchema } from "@/lib/security/env-schema";

type RequiredSecret = "SUPABASE_SERVICE_ROLE_KEY" | "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET";

function requiredSecret(name: RequiredSecret): string {
  const result = serverEnvSchema.shape[name].safeParse(process.env[name] ?? "");
  if (!result.success) {
    throw new Error(
      `[SaaSForge] Invalid or missing server secret "${name}". Copy .env.example to .env.local.`,
    );
  }
  return result.data;
}

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
