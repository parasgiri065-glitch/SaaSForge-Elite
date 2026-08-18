export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = "owner" | "admin" | "member" | "billing" | "viewer";

export type SubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  stripe_customer_id: string | null;
  billing_email: string | null;
  created_at: string;
  updated_at: string;
};

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

export type StripeWebhookEvent = {
  id: string;
  type: string;
  processed_at: string | null;
  error: string | null;
  received_at: string;
};

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          stripe_customer_id?: string | null;
          billing_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          stripe_customer_id?: string | null;
          billing_email?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: User;
        Insert: {
          id: string;
          email: string;
          organization_id: string;
          role?: AppRole;
          is_active?: boolean;
          last_seen_at?: string | null;
        };
        Update: {
          email?: string;
          organization_id?: string;
          role?: AppRole;
          is_active?: boolean;
          last_seen_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: Profile;
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          job_title?: string | null;
          timezone?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          job_title?: string | null;
          timezone?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: Subscription;
        Insert: {
          id?: string;
          organization_id: string;
          user_id?: string | null;
          stripe_subscription_id: string;
          stripe_price_id?: string | null;
          stripe_product_id?: string | null;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          trial_end?: string | null;
          metadata?: Json;
        };
        Update: {
          organization_id?: string;
          user_id?: string | null;
          stripe_subscription_id?: string;
          stripe_price_id?: string | null;
          stripe_product_id?: string | null;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          trial_end?: string | null;
          metadata?: Json;
        };
        Relationships: [
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
        ];
      };
      stripe_webhook_events: {
        Row: StripeWebhookEvent;
        Insert: {
          id: string;
          type: string;
          processed_at?: string | null;
          error?: string | null;
          received_at?: string;
        };
        Update: {
          processed_at?: string | null;
          error?: string | null;
        };
        Relationships: [];
      };
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
}
