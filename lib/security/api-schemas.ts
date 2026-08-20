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
