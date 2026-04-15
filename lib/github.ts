import { cache } from "react";

export type GitHubBranch = {
  name: string;
  commit: {
    sha: string;
  };
};

export type GitHubCommitSummary = {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  parents: Array<{ sha: string }>;
};

export type GitHubCommitDetails = GitHubCommitSummary & {
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  files?: Array<{
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
    status: string;
  }>;
  aiSummary?: {
    status: "ready" | "unavailable";
    text: string;
  };
};

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code:
      | "not_found"
      | "rate_limited"
      | "missing_token"
      | "invalid_request"
      | "github_error",
  ) {
    super(message);
  }
}

type FetchOptions = {
  revalidate?: number;
};

const baseUrl = "https://api.github.com";

async function githubFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new GitHubApiError(
      "GitHub token is not configured. Add GITHUB_TOKEN to your environment.",
      500,
      "missing_token",
    );
  }

  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: {
      revalidate: options.revalidate ?? 60,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError("Repository or commit was not found.", 404, "not_found");
    }

    if (response.status === 403 || response.status === 429) {
      throw new GitHubApiError(
        "GitHub rate limit reached. Try again later.",
        response.status,
        "rate_limited",
      );
    }

    throw new GitHubApiError(
      "GitHub could not complete the request.",
      response.status,
      "github_error",
    );
  }

  return response.json() as Promise<T>;
}

export const getBranches = cache(async (owner: string, repo: string) => {
  const path = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches?per_page=100`;
  return githubFetch<GitHubBranch[]>(path);
});

export const getCommits = cache(
  async (owner: string, repo: string, branch?: string, limit = 25) => {
    const params = new URLSearchParams({
      per_page: String(limit),
    });

    if (branch) {
      params.set("sha", branch);
    }

    const path = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?${params.toString()}`;
    return githubFetch<GitHubCommitSummary[]>(path);
  },
);

export const getCommitDetails = cache(
  async (owner: string, repo: string, sha: string) => {
    const path = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits/${encodeURIComponent(sha)}`;
    return githubFetch<GitHubCommitDetails>(path, { revalidate: 300 });
  },
);

export function toClientError(error: unknown) {
  if (error instanceof GitHubApiError) {
    return {
      error: error.message,
      code: error.code,
      status: error.status,
    };
  }

  return {
    error: "Something went wrong while contacting GitHub.",
    code: "unknown",
    status: 500,
  };
}
