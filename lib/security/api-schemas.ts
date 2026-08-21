import { z } from "zod";

/** Strict empty object — portal POST must not smuggle a customer id. */
export const emptyJsonBodySchema = z.object({}).strict();

/** Stripe-Signature header: non-empty, bounded. */
export const stripeSignatureSchema = z
  .string()
  .trim()
  .min(8, "missing_stripe_signature")
  .max(8192, "invalid_signature");

/** Stripe event id + type after constructEvent. */
export const stripeEventMetaSchema = z.object({
  id: z.string().trim().min(1).max(255),
  type: z.string().trim().min(1).max(255),
});

/**
 * OAuth callback query. `next` must be a same-origin relative path
 * (`^\/(?!\/)[A-Za-z0-9/_-]*$`) — blocks `https://evil` and `//evil`.
 */
export const oauthCallbackQuerySchema = z.object({
  code: z.string().trim().min(8).max(2048),
  next: z
    .string()
    .trim()
    .max(512)
    .regex(/^\/(?!\/)[A-Za-z0-9/_-]*$/, "invalid_next")
    .optional(),
});

/** Agent composer prompt. */
export const agentPromptSchema = z
  .string()
  .trim()
  .min(1, "empty_prompt")
  .max(8000, "prompt_too_long");

/** POST /api/ai/stream body. History is prior complete turns only. */
export const agentStreamBodySchema = z.object({
  prompt: agentPromptSchema,
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(8000),
      }),
    )
    .max(20)
    .optional(),
});

/** Lemon Squeezy `X-Signature` header: HMAC-SHA256 hex digest. */
export const lemonSqueezySignatureSchema = z
  .string()
  .trim()
  .min(16, "missing_x_signature")
  .max(256, "invalid_signature")
  .regex(/^[A-Fa-f0-9]+$/, "invalid_signature");

/**
 * GitHub login: 1–39 chars, alphanumeric, single hyphens in the middle.
 * Used for Lemon Squeezy `meta.custom_data.github_username`.
 */
export const githubUsernameSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/, "invalid_github_username");
