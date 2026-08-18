import { describe, expect, it, vi } from "vitest";
import {
  isUsableTenantUser,
  readSubjectFromClaims,
  resolveVerifiedTenantUser,
} from "@/lib/auth/guards";
import { isAuthPage, isPublicPath } from "@/lib/auth/public-paths";
import { makeTenantUser } from "@/tests/helpers/tenant";

describe("readSubjectFromClaims", () => {
  it("returns null when getClaims reports an error (expired / invalid token)", () => {
    expect(
      readSubjectFromClaims({
        data: { claims: { sub: "user_1" } },
        error: { message: "token is expired" },
      }),
    ).toBeNull();
  });

  it("returns null when claims are missing", () => {
    expect(readSubjectFromClaims({ data: null, error: null })).toBeNull();
    expect(readSubjectFromClaims({ data: { claims: null }, error: null })).toBeNull();
  });

  it("returns null for empty or non-string subjects", () => {
    expect(
      readSubjectFromClaims({ data: { claims: { sub: "" } }, error: null }),
    ).toBeNull();
    expect(
      readSubjectFromClaims({ data: { claims: { sub: "   " } }, error: null }),
    ).toBeNull();
    expect(
      readSubjectFromClaims({ data: { claims: { sub: 123 } }, error: null }),
    ).toBeNull();
  });

  it("returns the subject for a verified token", () => {
    expect(
      readSubjectFromClaims({ data: { claims: { sub: "user_1" } }, error: null }),
    ).toBe("user_1");
  });
});

describe("isUsableTenantUser", () => {
  it("rejects null and deactivated members", () => {
    expect(isUsableTenantUser(null)).toBe(false);
    expect(isUsableTenantUser(makeTenantUser({ is_active: false }))).toBe(false);
  });

  it("accepts an active tenant member", () => {
    expect(isUsableTenantUser(makeTenantUser())).toBe(true);
  });
});

describe("resolveVerifiedTenantUser", () => {
  it("does not load a user when the token is expired", async () => {
    const loadUser = vi.fn();
    const user = await resolveVerifiedTenantUser({
      getClaims: async () => ({
        data: { claims: { sub: "user_1" } },
        error: { message: "exp" },
      }),
      loadUser,
    });
    expect(user).toBeNull();
    expect(loadUser).not.toHaveBeenCalled();
  });

  it("does not load a user for an empty request (no claims)", async () => {
    const loadUser = vi.fn();
    const user = await resolveVerifiedTenantUser({
      getClaims: async () => ({ data: null, error: null }),
      loadUser,
    });
    expect(user).toBeNull();
    expect(loadUser).not.toHaveBeenCalled();
  });

  it("returns null when the tenant row is missing", async () => {
    const user = await resolveVerifiedTenantUser({
      getClaims: async () => ({ data: { claims: { sub: "user_ghost" } }, error: null }),
      loadUser: async () => null,
    });
    expect(user).toBeNull();
  });

  it("returns the tenant user for a valid session", async () => {
    const tenant = makeTenantUser();
    const user = await resolveVerifiedTenantUser({
      getClaims: async () => ({ data: { claims: { sub: tenant.id } }, error: null }),
      loadUser: async (id) => (id === tenant.id ? tenant : null),
    });
    expect(user?.email).toBe("owner@acme.test");
  });
});

describe("public path guards", () => {
  it("allows marketing, auth, health, and Stripe webhooks", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/signup")).toBe(true);
    expect(isPublicPath("/api/health")).toBe(true);
    expect(isPublicPath("/api/webhooks/stripe")).toBe(true);
    expect(isPublicPath("/api/stripe/webhook")).toBe(true);
  });

  it("protects the dashboard and billing portal", () => {
    expect(isPublicPath("/dashboard")).toBe(false);
    expect(isPublicPath("/settings/billing")).toBe(false);
    expect(isPublicPath("/api/stripe/portal")).toBe(false);
  });

  it("identifies auth pages for bounce-away redirects", () => {
    expect(isAuthPage("/login")).toBe(true);
    expect(isAuthPage("/signup")).toBe(true);
    expect(isAuthPage("/dashboard")).toBe(false);
  });
});
