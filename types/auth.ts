import type { Session, User as AuthUser } from "@supabase/supabase-js";
import type { Organization, Profile, Subscription, User } from "@/types/database";

export interface TenantUser extends User {
  profile: Profile | null;
  organization: Organization | null;
  subscription: Subscription | null;
}

export interface AuthContextValue {
  authUser: AuthUser | null;
  session: Session | null;
  tenantUser: TenantUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (input: SignUpInput) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  refresh: () => Promise<void>;
}

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  organizationName: string;
}

export interface SignInInput {
  email: string;
  password: string;
}
