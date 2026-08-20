import { NextResponse } from "next/server";
import { getVerifiedTenantUser } from "@/lib/auth/require-user";
import { decidePortalAccess } from "@/lib/billing/portal-access";
import { publicEnv } from "@/lib/env";
import { emptyJsonBodySchema } from "@/lib/security/api-schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function rejectUnexpectedBody(request: Request): Promise<NextResponse | null> {
  const text = await request.text();
  if (text.trim().length === 0) {
    return null;
  }
  let payload: unknown;
  try {
    payload = JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = emptyJsonBodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "unexpected_body" }, { status: 400 });
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const unexpected = await rejectUnexpectedBody(request);
    if (unexpected) {
      return unexpected;
    }

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
