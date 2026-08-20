import type { Session, User as AuthUser } from "@supabase/supabase-js";
import type { Organization, Profile, Subscription, User } from "@/types/database";

/**
 * Tenant member plus the joined profile, organization, and subscription rows.
 * Field names on the nested objects are the SQL column names.
 */
export type TenantUser = User & {
  profile: Profile | null;
  organization: Organization | null;
  subscription: Subscription | null;
};

export type AuthActionResult = {
  error: string | null;
};

export type AuthContextValue = {
  authUser: AuthUser | null;
  session: Session | null;
  tenantUser: TenantUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signUp: (input: SignUpInput) => Promise<AuthActionResult>;
  signOut: () => Promise<AuthActionResult>;
  refresh: () => Promise<void>;
};

export type SignUpInput = {
  email: string;
  password: string;
  fullName: string;
  organizationName: string;
};

export type SignInInput = {
  email: string;
  password: string;
};
