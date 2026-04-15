import { NextRequest, NextResponse } from "next/server";
import {
  getBranches,
  getCommitDetails,
  getCommits,
  toClientError,
} from "@/lib/github";
import { summarizeCommit } from "@/lib/ai-summary";
import { isValidRepoPart } from "@/lib/repo";

const allowedLimits = new Set([10, 25, 50, 100]);

type RouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { owner, repo } = await context.params;
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource") ?? "commits";
  const branch = searchParams.get("branch") ?? undefined;
  const limitParam = Number(searchParams.get("limit") ?? 25);
  const limit = allowedLimits.has(limitParam) ? limitParam : 25;
  const sha = searchParams.get("sha");

  if (!isValidRepoPart(owner) || !isValidRepoPart(repo)) {
    return NextResponse.json(
      {
        error: "Invalid repository path.",
        code: "invalid_request",
      },
      { status: 400 },
    );
  }

  try {
    if (resource === "branches") {
      const branches = await getBranches(owner, repo);
      return NextResponse.json({ branches });
    }

    if (resource === "commit") {
      if (!sha) {
        return NextResponse.json(
          {
            error: "Commit SHA is required.",
            code: "invalid_request",
          },
          { status: 400 },
        );
      }

      const commit = await getCommitDetails(owner, repo, sha);
      const aiSummary = await summarizeCommit(commit);
      return NextResponse.json({ commit: { ...commit, aiSummary } });
    }

    const commits = await getCommits(owner, repo, branch, limit);
    return NextResponse.json({ commits });
  } catch (error) {
    const clientError = toClientError(error);
    return NextResponse.json(clientError, { status: clientError.status });
  }
}
