import { NextResponse } from "next/server";
import { getVerifiedTenantUser } from "@/lib/auth/require-user";
import { decidePortalAccess } from "@/lib/billing/portal-access";
import { publicEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getVerifiedTenantUser();
    const decision = decidePortalAccess(user);
    if (!decision.ok) {
      return NextResponse.json({ error: decision.error }, { status: decision.status });
    }

    const { getStripe } = await import("@/lib/stripe/client");
    const session = await getStripe().billingPortal.sessions.create({
      customer: decision.customerId,
      return_url: `${publicEnv.appUrl}/settings/billing`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "missing_portal_url" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "portal_failed" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
}
