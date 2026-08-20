import { NextResponse } from "next/server";
import { getVerifiedTenantUser } from "@/lib/auth/require-user";
import { decidePortalAccess } from "@/lib/billing/portal-access";
import { publicEnv } from "@/lib/env";
import { inspectEmptyJsonBody } from "@/lib/http/empty-json-body";
import { jsonResponse } from "@/lib/http/json-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/portal
 *
 * Opens a Stripe Customer Portal session for the caller's organization.
 * Body must be empty or `{}`. Customer id is never taken from the client.
 *
 * @param request - Authenticated POST with an empty JSON body.
 * @returns 200 `{ url }` on success; 400/401/403/409/500 on denial.
 */
export async function POST(request: Request) {
  try {
    const rawText = await request.text();
    const bodyInspection = inspectEmptyJsonBody(rawText);
    if (!bodyInspection.ok) {
      return jsonResponse(bodyInspection.status, { error: bodyInspection.error });
    }

    const tenantUser = await getVerifiedTenantUser();
    const portalDecision = decidePortalAccess(tenantUser);
    if (!portalDecision.ok) {
      return jsonResponse(portalDecision.status, { error: portalDecision.error });
    }

    const { getStripe } = await import("@/lib/stripe/client");
    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: portalDecision.customerId,
      return_url: `${publicEnv.appUrl}/settings/billing`,
    });

    if (!portalSession.url) {
      return jsonResponse(502, { error: "missing_portal_url" });
    }
    return NextResponse.json({ url: portalSession.url });
  } catch {
    return jsonResponse(500, { error: "portal_failed" });
  }
}

/**
 * GET /api/stripe/portal
 *
 * @returns 405 `{ error: "method_not_allowed" }`.
 */
export function GET() {
  return jsonResponse(405, { error: "method_not_allowed" });
}
