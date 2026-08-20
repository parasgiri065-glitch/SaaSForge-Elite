import { jsonResponse } from "@/lib/http/json-response";
import { parseJsonUnknown } from "@/lib/http/parse-json-unknown";
import { isolateUnknownError } from "@/lib/errors/isolate-unknown-error";
import { serverEnv } from "@/lib/env.server";
import { inspectLemonSqueezyWebhookRequest } from "@/lib/lemonsqueezy/webhook-request";
import { verifyLemonSqueezySignature } from "@/lib/lemonsqueezy/verify-signature";
import {
  LEMON_SQUEEZY_ORDER_CREATED,
  lemonSqueezyWebhookPayloadSchema,
  readGithubUsernameFromPayload,
} from "@/lib/lemonsqueezy/payload";
import { inviteGithubCollaborator } from "@/lib/github/invite-collaborator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/lemonsqueezy
 *
 * Trust order:
 * 1. Require `X-Signature`
 * 2. HMAC-SHA256 the raw body with `LEMONSQUEEZY_WEBHOOK_SECRET` (never JSON.parse first)
 * 3. On `order_created`, read `meta.custom_data.github_username`
 * 4. Invite that login as a `pull` collaborator on `GITHUB_OWNER/GITHUB_REPO`
 *
 * @param request - Incoming Lemon Squeezy webhook with a raw body.
 * @returns 200 `{ status }` on success/ignored, 400 on inspect/signature
 *   failure, 500 when GitHub or unexpected processing throws.
 */
export async function POST(request: Request) {
  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch (error: unknown) {
    const isolated = isolateUnknownError(error, "invalid_body");
    console.error("[lemonsqueezy.webhook] failed to read body", isolated);
    return jsonResponse(400, { error: isolated.code });
  }

  const inspected = inspectLemonSqueezyWebhookRequest(
    rawBody,
    request.headers.get("x-signature"),
  );
  if (!inspected.ok) {
    return jsonResponse(inspected.status, { error: inspected.error });
  }

  try {
    const signatureMatches = verifyLemonSqueezySignature(
      inspected.rawBody,
      inspected.signature,
      serverEnv.lemonSqueezyWebhookSecret,
    );
    if (!signatureMatches) {
      return jsonResponse(400, { error: "invalid_signature" });
    }

    const parsedJson = parseJsonUnknown(inspected.rawBody);
    const parsedPayload = lemonSqueezyWebhookPayloadSchema.safeParse(parsedJson);
    if (!parsedPayload.success) {
      return jsonResponse(400, { error: "invalid_event" });
    }

    const payload = parsedPayload.data;
    if (payload.meta.event_name !== LEMON_SQUEEZY_ORDER_CREATED) {
      return jsonResponse(200, { status: "ignored", event: payload.meta.event_name });
    }

    const githubUsername = readGithubUsernameFromPayload(payload);
    if (!githubUsername) {
      return jsonResponse(200, { status: "skipped", reason: "missing_github_username" });
    }

    const invite = await inviteGithubCollaborator({
      owner: serverEnv.githubOwner,
      repo: serverEnv.githubRepo,
      username: githubUsername,
      token: serverEnv.githubPatToken,
      permission: "pull",
    });

    if (!invite.ok) {
      console.error("[lemonsqueezy.webhook] github invite failed", invite.status);
      return jsonResponse(500, { error: invite.error });
    }

    return jsonResponse(200, { status: "invited", username: githubUsername });
  } catch (error: unknown) {
    const isolated = isolateUnknownError(error, "processing_failed");
    console.error("[lemonsqueezy.webhook] processing failed", isolated);
    return jsonResponse(500, { error: isolated.code });
  }
}

/**
 * GET /api/webhooks/lemonsqueezy
 *
 * @returns 405 `{ error: "method_not_allowed" }`.
 */
export function GET() {
  return jsonResponse(405, { error: "method_not_allowed" });
}
