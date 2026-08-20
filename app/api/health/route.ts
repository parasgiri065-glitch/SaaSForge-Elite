import { NextResponse } from "next/server";

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

export function POST() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
}
