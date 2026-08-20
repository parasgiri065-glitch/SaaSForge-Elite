import { NextResponse } from "next/server";

/**
 * Build a JSON `NextResponse` with an explicit status.
 * Shared by health, portal, and webhook handlers so status codes stay consistent.
 *
 * @param status - HTTP status code to send.
 * @param body - String-valued JSON object (error codes or status flags).
 * @returns A `NextResponse` with `application/json` body.
 */
export function jsonResponse(status: number, body: Record<string, string>): NextResponse {
  return NextResponse.json(body, { status });
}
