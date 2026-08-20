import type { AssertKeysSubset } from "@/lib/types/assert-equal";

export type Json =
  string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Postgres `public.app_role`. Source of truth for RBAC unions.
 */
export const APP_ROLE_VALUES = ["owner", "admin", "member", "billing", "viewer"] as const;

export type AppRole = (typeof APP_ROLE_VALUES)[number];

/**
 * Postgres `public.subscription_status`. Source of truth for billing unions.
 */
export const SUBSCRIPTION_STATUS_VALUES = [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS_VALUES)[number];

/**
 * `public.organizations` row. Keys match the SQL columns exactly.
 */
export type Organization = {
  id: string;
  name: string;
  slug: string;
  stripe_customer_id: string | null;
  billing_email: string | null;
  created_at: string;
  updated_at: string;
};

export type OrganizationInsert = Pick<Organization, "name" | "slug"> &
  Partial<
    Pick<
      Organization,
      "id" | "stripe_customer_id" | "billing_email" | "created_at" | "updated_at"
    >
  >;

export type OrganizationUpdate = Partial<
  Pick<Organization, "name" | "slug" | "stripe_customer_id" | "billing_email">
>;

/**
 * `public.users` row. `id` equals `auth.users.id`.
 */
export type User = {
  id: string;
  email: string;
  organization_id: string;
  role: AppRole;
  is_active: boolean;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserInsert = Pick<User, "id" | "email" | "organization_id"> &
  Partial<
    Pick<User, "role" | "is_active" | "last_seen_at" | "created_at" | "updated_at">
  >;

export type UserUpdate = Partial<
  Pick<User, "email" | "organization_id" | "role" | "is_active" | "last_seen_at">
>;

/**
 * `public.profiles` row. 1:1 with `users`.
 */
export type Profile = {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  job_title: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type ProfileInsert = Pick<Profile, "user_id"> &
  Partial<
    Pick<
      Profile,
      | "id"
      | "full_name"
      | "avatar_url"
      | "job_title"
      | "timezone"
      | "created_at"
      | "updated_at"
    >
  >;

export type ProfileUpdate = Partial<
  Pick<Profile, "full_name" | "avatar_url" | "job_title" | "timezone">
>;

/**
 * `public.subscriptions` row. One per organization.
 */
export type Subscription = {
  id: string;
  organization_id: string;
  user_id: string | null;
  stripe_subscription_id: string;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_end: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
};

export type SubscriptionInsert = Pick<
  Subscription,
  "organization_id" | "stripe_subscription_id"
> &
  Partial<
    Pick<
      Subscription,
      | "id"
      | "user_id"
      | "stripe_price_id"
      | "stripe_product_id"
      | "status"
      | "current_period_start"
      | "current_period_end"
      | "cancel_at_period_end"
      | "canceled_at"
      | "trial_end"
      | "metadata"
      | "created_at"
      | "updated_at"
    >
  >;

export type SubscriptionUpdate = Partial<
  Pick<
    Subscription,
    | "organization_id"
    | "user_id"
    | "stripe_subscription_id"
    | "stripe_price_id"
    | "stripe_product_id"
    | "status"
    | "current_period_start"
    | "current_period_end"
    | "cancel_at_period_end"
    | "canceled_at"
    | "trial_end"
    | "metadata"
  >
>;

/**
 * `public.stripe_webhook_events` row. Keyed by Stripe `event.id`.
 */
export type StripeWebhookEvent = {
  id: string;
  type: string;
  processed_at: string | null;
  error: string | null;
  received_at: string;
};

export type StripeWebhookEventInsert = Pick<StripeWebhookEvent, "id" | "type"> &
  Partial<Pick<StripeWebhookEvent, "processed_at" | "error" | "received_at">>;

export type StripeWebhookEventUpdate = Partial<
  Pick<StripeWebhookEvent, "processed_at" | "error">
>;

type _OrganizationInsertKeys = AssertKeysSubset<OrganizationInsert, Organization>;
type _OrganizationUpdateKeys = AssertKeysSubset<OrganizationUpdate, Organization>;
type _UserInsertKeys = AssertKeysSubset<UserInsert, User>;
type _UserUpdateKeys = AssertKeysSubset<UserUpdate, User>;
type _ProfileInsertKeys = AssertKeysSubset<ProfileInsert, Profile>;
type _ProfileUpdateKeys = AssertKeysSubset<ProfileUpdate, Profile>;
type _SubscriptionInsertKeys = AssertKeysSubset<SubscriptionInsert, Subscription>;
type _SubscriptionUpdateKeys = AssertKeysSubset<SubscriptionUpdate, Subscription>;
type _WebhookInsertKeys = AssertKeysSubset<StripeWebhookEventInsert, StripeWebhookEvent>;
type _WebhookUpdateKeys = AssertKeysSubset<StripeWebhookEventUpdate, StripeWebhookEvent>;

const _insertUpdateKeysAlign: [
  _OrganizationInsertKeys,
  _OrganizationUpdateKeys,
  _UserInsertKeys,
  _UserUpdateKeys,
  _ProfileInsertKeys,
  _ProfileUpdateKeys,
  _SubscriptionInsertKeys,
  _SubscriptionUpdateKeys,
  _WebhookInsertKeys,
  _WebhookUpdateKeys,
] = [true, true, true, true, true, true, true, true, true, true];

void _insertUpdateKeysAlign;

type TableDefinition<Row, Insert, Update, Relationships extends readonly unknown[]> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

/**
 * Typed schema consumed by `@supabase/supabase-js`.
 * Declared as a `type` (not an `interface`) so row objects satisfy
 * `Record<string, unknown>` where the client requires it.
 */
export type Database = {
  public: {
    Tables: {
      organizations: TableDefinition<
        Organization,
        OrganizationInsert,
        OrganizationUpdate,
        []
      >;
      users: TableDefinition<
        User,
        UserInsert,
        UserUpdate,
        [
          {
            foreignKeyName: "users_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ]
      >;
      profiles: TableDefinition<
        Profile,
        ProfileInsert,
        ProfileUpdate,
        [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ]
      >;
      subscriptions: TableDefinition<
        Subscription,
        SubscriptionInsert,
        SubscriptionUpdate,
        [
          {
            foreignKeyName: "subscriptions_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: true;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ]
      >;
      stripe_webhook_events: TableDefinition<
        StripeWebhookEvent,
        StripeWebhookEventInsert,
        StripeWebhookEventUpdate,
        []
      >;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      user_organization_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      user_has_role: {
        Args: { target_roles: AppRole[] };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
      subscription_status: SubscriptionStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type PublicTableName = keyof Database["public"]["Tables"];

export type TableRow<Name extends PublicTableName> =
  Database["public"]["Tables"][Name]["Row"];

export type TableInsert<Name extends PublicTableName> =
  Database["public"]["Tables"][Name]["Insert"];

export type TableUpdate<Name extends PublicTableName> =
  Database["public"]["Tables"][Name]["Update"];
