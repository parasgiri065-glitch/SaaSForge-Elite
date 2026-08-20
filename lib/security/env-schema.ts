import { z } from "zod";

const nonEmpty = z.string().trim();

function optionalUrl(value: string): boolean {
  if (value.length === 0) {
    return true;
  }
  return z.string().url().safeParse(value).success;
}

const noPlaceholder = (value: string) => !value.includes("YOUR_");

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    nonEmpty.url().max(2048).default("http://localhost:3000"),
  ),
  NEXT_PUBLIC_APP_NAME: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    nonEmpty.min(1).max(80).default("SaaSForge Elite"),
  ),
  NEXT_PUBLIC_SUPABASE_URL: nonEmpty.max(2048).refine(optionalUrl, {
    message: "NEXT_PUBLIC_SUPABASE_URL must be a valid URL",
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: nonEmpty.max(4096),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: nonEmpty.max(4096).optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: nonEmpty.max(256),
  NEXT_PUBLIC_DEMO_MODE: z.string().max(16).optional(),
});

export const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: nonEmpty
    .min(8)
    .max(4096)
    .refine(noPlaceholder, { message: "placeholder secret" }),
  STRIPE_SECRET_KEY: nonEmpty
    .min(8)
    .max(256)
    .refine(noPlaceholder, { message: "placeholder secret" }),
  STRIPE_WEBHOOK_SECRET: nonEmpty
    .min(8)
    .max(256)
    .refine(noPlaceholder, { message: "placeholder secret" }),
  STRIPE_PRICE_STARTER: nonEmpty.max(128),
  STRIPE_PRICE_GROWTH: nonEmpty.max(128),
  STRIPE_PRICE_ENTERPRISE: nonEmpty.max(128),
  OPENAI_API_KEY: nonEmpty.max(256),
});

export type PublicEnvInput = z.input<typeof publicEnvSchema>;
