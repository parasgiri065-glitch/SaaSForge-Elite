import { z } from "zod";

export const emptyJsonBodySchema = z.object({}).strict();

export const stripeSignatureSchema = z
  .string()
  .trim()
  .min(8, "missing_stripe_signature")
  .max(8192, "invalid_signature");

export const stripeEventMetaSchema = z.object({
  id: z.string().trim().min(1).max(255),
  type: z.string().trim().min(1).max(255),
});

export const oauthCallbackQuerySchema = z.object({
  code: z.string().trim().min(8).max(2048),
  next: z
    .string()
    .trim()
    .max(512)
    .regex(/^\/(?!\/)[A-Za-z0-9/_-]*$/, "invalid_next")
    .optional(),
});

export const agentPromptSchema = z
  .string()
  .trim()
  .min(1, "empty_prompt")
  .max(8000, "prompt_too_long");
