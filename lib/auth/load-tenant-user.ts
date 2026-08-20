import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { TenantUser } from "@/types/auth";
import {
  firstRelationOrNull,
  parseSubscriptionRow,
  userJoinRowSchema,
} from "@/lib/supabase/row-schemas";

type TypedClient = SupabaseClient<Database>;

/**
 * Load the tenant-scoped user graph (profile, organization, subscription).
 * Query results are parsed through Zod row schemas so embed shapes cannot
 * leak untyped fields into the frontend.
 *
 * @param supabaseClient - Typed Supabase client (browser, server, or admin).
 * @param userId - Verified Auth user id (`sub`).
 * @returns The tenant user, or `null` when the row is missing / invalid.
 */
export async function loadTenantUser(
  supabaseClient: TypedClient,
  userId: string,
): Promise<TenantUser | null> {
  const { data, error } = await supabaseClient
    .from("users")
    .select(
      `
      id,
      email,
      organization_id,
      role,
      is_active,
      last_seen_at,
      created_at,
      updated_at,
      profile:profiles (*),
      organization:organizations (*)
    `,
    )
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const parsedJoin = userJoinRowSchema.safeParse(data);
  if (!parsedJoin.success) {
    return null;
  }

  const userRow = parsedJoin.data;
  const organization = firstRelationOrNull(userRow.organization);

  let subscriptionRecord: TenantUser["subscription"] = null;
  if (organization) {
    const { data: subscriptionRow, error: subscriptionError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("organization_id", organization.id)
      .maybeSingle();
    if (subscriptionError) {
      return null;
    }
    if (subscriptionRow) {
      const parsedSubscription = parseSubscriptionRow(subscriptionRow);
      if (!parsedSubscription) {
        return null;
      }
      subscriptionRecord = parsedSubscription;
    }
  }

  return {
    id: userRow.id,
    email: userRow.email,
    organization_id: userRow.organization_id,
    role: userRow.role,
    is_active: userRow.is_active,
    last_seen_at: userRow.last_seen_at,
    created_at: userRow.created_at,
    updated_at: userRow.updated_at,
    profile: firstRelationOrNull(userRow.profile),
    organization,
    subscription: subscriptionRecord,
  };
}
