import { describe, expect, it } from "vitest";
import {
  firstRelationOrNull,
  organizationRowSchema,
  userJoinRowSchema,
  userRowSchema,
} from "@/lib/supabase/row-schemas";

const organization = {
  id: "org_1",
  name: "Acme Labs",
  slug: "acme-labs",
  stripe_customer_id: "cus_123",
  billing_email: "billing@acme.test",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const user = {
  id: "user_1",
  email: "owner@acme.test",
  organization_id: "org_1",
  role: "owner" as const,
  is_active: true,
  last_seen_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("row schemas", () => {
  it("accepts SQL-shaped organization and user rows", () => {
    expect(organizationRowSchema.parse(organization).slug).toBe("acme-labs");
    expect(userRowSchema.parse(user).organization_id).toBe("org_1");
  });

  it("strips unknown columns and rejects invalid roles", () => {
    expect(userRowSchema.parse({ ...user, extra: true })).toEqual(user);
    expect(userRowSchema.safeParse({ ...user, role: "superadmin" }).success).toBe(false);
  });

  it("unwraps PostgREST embeds that arrive as arrays", () => {
    const joined = userJoinRowSchema.parse({
      ...user,
      profile: null,
      organization: [organization],
    });
    expect(firstRelationOrNull(joined.organization)?.id).toBe("org_1");
  });
});
