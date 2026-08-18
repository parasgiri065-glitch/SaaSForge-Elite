import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[SaaSForge] Missing required server secret "${name}". Copy .env.example to .env.local.`,
    );
  }
  return value;
}

export const serverEnv = {
  get supabaseServiceRoleKey(): string {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get stripeSecretKey(): string {
    return required("STRIPE_SECRET_KEY");
  },
  get stripeWebhookSecret(): string {
    return required("STRIPE_WEBHOOK_SECRET");
  },
  stripePriceStarter: process.env.STRIPE_PRICE_STARTER ?? "",
  stripePriceGrowth: process.env.STRIPE_PRICE_GROWTH ?? "",
  stripePriceEnterprise: process.env.STRIPE_PRICE_ENTERPRISE ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
} as const;
