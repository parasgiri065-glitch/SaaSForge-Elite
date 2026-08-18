import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Organization, Profile, Subscription } from "@/types/database";
import type { TenantUser } from "@/types/auth";

type TypedClient = SupabaseClient<Database>;

interface UserJoinRow {
  id: string;
  email: string;
  organization_id: string;
  role: TenantUser["role"];
  is_active: boolean;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
  profile: Profile | Profile[] | null;
  organization: Organization | Organization[] | null;
}

function firstOrNull<T>(value: T | T[] | null): T | null {
  if (value === null) {
    return null;
  }
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function loadTenantUser(
  supabase: TypedClient,
  userId: string,
): Promise<TenantUser | null> {
  const { data, error } = await supabase
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

  const row = data as UserJoinRow;
  const organization = firstOrNull(row.organization);

  let subscription: Subscription | null = null;
  if (organization) {
    const { data: sub, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("organization_id", organization.id)
      .maybeSingle();
    if (subError) {
      return null;
    }
    subscription = sub ?? null;
  }

  return {
    id: row.id,
    email: row.email,
    organization_id: row.organization_id,
    role: row.role,
    is_active: row.is_active,
    last_seen_at: row.last_seen_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    profile: firstOrNull(row.profile),
    organization,
    subscription,
  };
}
