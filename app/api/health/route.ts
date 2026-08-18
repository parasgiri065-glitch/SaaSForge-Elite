import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "saasforge-elite",
    timestamp: new Date().toISOString(),
  });
}
