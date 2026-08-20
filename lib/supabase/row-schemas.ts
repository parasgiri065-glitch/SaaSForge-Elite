import { z } from "zod";
import { assertEqualTypes, type AssertEqual } from "@/lib/types/assert-equal";
import {
  APP_ROLE_VALUES,
  SUBSCRIPTION_STATUS_VALUES,
  type Json,
  type Organization,
  type Profile,
  type StripeWebhookEvent,
  type Subscription,
  type User,
} from "@/types/database";

export const appRoleSchema = z.enum(APP_ROLE_VALUES);
export const subscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUS_VALUES);

/**
 * Coerce unknown jsonb into the `Json` union used on `subscriptions.metadata`.
 *
 * @param value - Raw jsonb from PostgREST.
 * @returns A `Json` value; unrepresentable values collapse to `null`.
 */
export function toJson(value: unknown): Json {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(toJson);
  }
  if (typeof value === "object") {
    const record: { [key: string]: Json | undefined } = {};
    for (const [key, nested] of Object.entries(value)) {
      record[key] = nested === undefined ? undefined : toJson(nested);
    }
    return record;
  }
  return null;
}

/**
 * `public.organizations` row. Field names are the SQL column names.
 */
export const organizationRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  stripe_customer_id: z.string().nullable(),
  billing_email: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * `public.users` row.
 */
export const userRowSchema = z.object({
  id: z.string(),
  email: z.string(),
  organization_id: z.string(),
  role: appRoleSchema,
  is_active: z.boolean(),
  last_seen_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * `public.profiles` row.
 */
export const profileRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  job_title: z.string().nullable(),
  timezone: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * `public.subscriptions` row. `metadata` is jsonb (`Json` on the row type).
 */
export const subscriptionRowSchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  user_id: z.string().nullable(),
  stripe_subscription_id: z.string(),
  stripe_price_id: z.string().nullable(),
  stripe_product_id: z.string().nullable(),
  status: subscriptionStatusSchema,
  current_period_start: z.string().nullable(),
  current_period_end: z.string().nullable(),
  cancel_at_period_end: z.boolean(),
  canceled_at: z.string().nullable(),
  trial_end: z.string().nullable(),
  metadata: z.unknown(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * `public.stripe_webhook_events` row.
 */
export const stripeWebhookEventRowSchema = z.object({
  id: z.string(),
  type: z.string(),
  processed_at: z.string().nullable(),
  error: z.string().nullable(),
  received_at: z.string(),
});

/**
 * PostgREST may embed a relation as an object, an array, or null.
 *
 * @param schema - Row schema for the embedded table.
 * @returns A union schema covering all three wire shapes.
 */
function embeddedRelationSchema<T extends z.ZodType>(schema: T) {
  return z.union([schema, z.array(schema), z.null()]);
}

/**
 * `users` row plus `profiles` / `organizations` embeds from `loadTenantUser`.
 */
export const userJoinRowSchema = userRowSchema.extend({
  profile: embeddedRelationSchema(profileRowSchema),
  organization: embeddedRelationSchema(organizationRowSchema),
});

export type UserJoinRow = z.infer<typeof userJoinRowSchema>;

assertEqualTypes<AssertEqual<z.infer<typeof organizationRowSchema>, Organization>>(true);
assertEqualTypes<AssertEqual<z.infer<typeof userRowSchema>, User>>(true);
assertEqualTypes<AssertEqual<z.infer<typeof profileRowSchema>, Profile>>(true);
assertEqualTypes<
  AssertEqual<z.infer<typeof stripeWebhookEventRowSchema>, StripeWebhookEvent>
>(true);

assertEqualTypes<
  AssertEqual<keyof z.infer<typeof subscriptionRowSchema>, keyof Subscription>
>(true);

/**
 * Parse a `subscriptions` row and coerce jsonb `metadata` to `Json`.
 *
 * @param value - Raw PostgREST row.
 * @returns A typed `Subscription`, or `null` when the shape is wrong.
 */
export function parseSubscriptionRow(value: unknown): Subscription | null {
  const parsed = subscriptionRowSchema.safeParse(value);
  if (!parsed.success) {
    return null;
  }
  return {
    ...parsed.data,
    metadata: toJson(parsed.data.metadata),
  };
}

/**
 * Unwrap a PostgREST embed into a single row or `null`.
 *
 * @param value - Object, array, or null from the embed.
 * @returns The first row, or `null`.
 */
export function firstRelationOrNull<T>(value: T | T[] | null): T | null {
  if (value === null) {
    return null;
  }
  return Array.isArray(value) ? (value[0] ?? null) : value;
}
