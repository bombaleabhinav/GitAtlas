export type RepoRef = {
  owner: string;
  repo: string;
};

const githubRepoUrlPattern =
  /^https:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/?$/;

export function parseGitHubRepoUrl(value: string): RepoRef | null {
  const trimmed = value.trim();
  const match = trimmed.match(githubRepoUrlPattern);

  if (!match) {
    return null;
  }

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ""),
  };
}

export function isValidRepoPart(value: string) {
  return /^[A-Za-z0-9_.-]+$/.test(value);
}
