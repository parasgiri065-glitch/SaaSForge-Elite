import { z } from "zod";
import { githubUsernameSchema } from "@/lib/security/api-schemas";

/**
 * Lemon Squeezy webhook envelope after HMAC verification.
 * Extra `custom_data` fields are allowed; only `github_username` is read.
 */
export const lemonSqueezyWebhookPayloadSchema = z.object({
  meta: z.object({
    event_name: z.string().trim().min(1).max(128),
    custom_data: z
      .object({
        github_username: z.string().optional(),
      })
      .catchall(z.unknown())
      .nullable()
      .optional(),
  }),
  data: z.unknown().optional(),
});

export type LemonSqueezyWebhookPayload = z.infer<typeof lemonSqueezyWebhookPayloadSchema>;

export const LEMON_SQUEEZY_ORDER_CREATED = "order_created";

/**
 * Read a GitHub username from Lemon Squeezy `meta.custom_data`.
 * Invalid or empty values are treated as missing so the webhook can 200
 * without retrying a bad checkout forever.
 *
 * @param payload - Verified, Zod-parsed webhook body.
 * @returns A valid GitHub login, or `null`.
 */
export function readGithubUsernameFromPayload(
  payload: LemonSqueezyWebhookPayload,
): string | null {
  const rawUsername = payload.meta.custom_data?.github_username;
  if (rawUsername === undefined) {
    return null;
  }
  const parsed = githubUsernameSchema.safeParse(rawUsername);
  return parsed.success ? parsed.data : null;
}
