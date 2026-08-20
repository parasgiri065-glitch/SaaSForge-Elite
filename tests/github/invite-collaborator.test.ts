import { describe, expect, it, vi } from "vitest";
import { inviteGithubCollaborator } from "@/lib/github/invite-collaborator";

describe("inviteGithubCollaborator", () => {
  it("PUTs pull permission and treats 201 as invited", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe(
        "https://api.github.com/repos/acme/kit/collaborators/octocat",
      );
      expect(init?.method).toBe("PUT");
      expect(init?.headers).toMatchObject({
        Authorization: "Bearer ghp_test",
      });
      expect(init?.body).toBe(JSON.stringify({ permission: "pull" }));
      return new Response(null, { status: 201 });
    });

    const result = await inviteGithubCollaborator({
      owner: "acme",
      repo: "kit",
      username: "octocat",
      token: "ghp_test",
      permission: "pull",
      fetchImpl,
    });
    expect(result).toEqual({ ok: true, status: 201 });
  });

  it("treats 204 as already a collaborator", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 204 }));
    const result = await inviteGithubCollaborator({
      owner: "acme",
      repo: "kit",
      username: "octocat",
      token: "ghp_test",
      permission: "pull",
      fetchImpl,
    });
    expect(result).toEqual({ ok: true, status: 204 });
  });

  it("returns a typed failure on GitHub errors", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 404 }));
    const result = await inviteGithubCollaborator({
      owner: "acme",
      repo: "kit",
      username: "missing-user",
      token: "ghp_test",
      permission: "pull",
      fetchImpl,
    });
    expect(result).toEqual({ ok: false, status: 404, error: "github_invite_failed" });
  });
});
