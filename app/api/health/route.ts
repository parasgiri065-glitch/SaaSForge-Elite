import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Liveness probe. Does not touch Supabase or Stripe.
 *
 * @returns 200 `{ ok: true, service: "saasforge-elite" }` with `Cache-Control: no-store`.
 */
export function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "saasforge-elite",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

/**
 * POST /api/health
 *
 * @returns 405 `{ error: "method_not_allowed" }`.
 */
export function POST() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
}
