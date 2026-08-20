export type GithubCollaboratorPermission = "pull";

export type GithubInviteSuccess = {
  ok: true;
  status: 201 | 204;
};

export type GithubInviteFailure = {
  ok: false;
  status: number;
  error: string;
};

export type GithubInviteResult = GithubInviteSuccess | GithubInviteFailure;

export type InviteGithubCollaboratorInput = {
  owner: string;
  repo: string;
  username: string;
  token: string;
  permission: GithubCollaboratorPermission;
  fetchImpl?: typeof fetch;
};

/**
 * Invite a GitHub user as a read-only collaborator (`permission: "pull"`).
 * `201` = invitation created, `204` = already a collaborator.
 *
 * @param input.owner - GitHub org or user that owns the repo (`GITHUB_OWNER`).
 * @param input.repo - Repository name (`GITHUB_REPO`).
 * @param input.username - Collaborator login from Lemon Squeezy custom data.
 * @param input.token - Fine-grained or classic PAT (`GITHUB_PAT_TOKEN`).
 * @param input.permission - Must be `"pull"` for store fulfillment.
 * @param input.fetchImpl - Optional fetch (inject in tests).
 * @returns Success with the GitHub status, or a typed failure.
 */
export async function inviteGithubCollaborator(
  input: InviteGithubCollaboratorInput,
): Promise<GithubInviteResult> {
  const encodedOwner = encodeURIComponent(input.owner);
  const encodedRepo = encodeURIComponent(input.repo);
  const encodedUsername = encodeURIComponent(input.username);
  const endpoint = `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/collaborators/${encodedUsername}`;
  const fetchImpl = input.fetchImpl ?? fetch;

  const response = await fetchImpl(endpoint, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${input.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ permission: input.permission }),
  });

  if (response.status === 201 || response.status === 204) {
    return { ok: true, status: response.status };
  }

  return {
    ok: false,
    status: response.status,
    error: "github_invite_failed",
  };
}
