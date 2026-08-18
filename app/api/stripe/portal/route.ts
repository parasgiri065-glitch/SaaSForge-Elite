import { NextResponse } from "next/server";
import { getVerifiedTenantUser } from "@/lib/auth/require-user";
import { BILLING_ROLES, hasRole } from "@/types/rbac";
import { publicEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getVerifiedTenantUser();
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    if (!hasRole(user.role, BILLING_ROLES)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const customerId = user.organization?.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json({ error: "no_customer" }, { status: 409 });
    }

    const { getStripe } = await import("@/lib/stripe/client");
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${publicEnv.appUrl}/settings/billing`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "missing_portal_url" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "portal_failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
