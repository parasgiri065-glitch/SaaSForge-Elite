import { NextResponse } from "next/server";

export type JsonErrorBody = {
  error: string;
};

export type JsonStatusBody = {
  status: string;
  type?: string;
};

/**
 * Build a JSON `NextResponse` with an explicit status.
 * Shared by health, portal, and webhook handlers so status codes stay consistent.
 *
 * @param status - HTTP status code to send.
 * @param body - String-valued JSON object (error codes or status flags).
 * @returns A `NextResponse` with `application/json` body.
 */
export function jsonResponse<T extends Record<string, string>>(
  status: number,
  body: T,
): NextResponse<T> {
  return NextResponse.json(body, { status });
}
