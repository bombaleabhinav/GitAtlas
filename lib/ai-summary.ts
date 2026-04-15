import { cache } from "react";
import type { GitHubCommitDetails } from "@/lib/github";

type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AiResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export type CommitAiSummary = {
  status: "ready" | "unavailable";
  text: string;
};

function buildCommitPrompt(commit: GitHubCommitDetails) {
  const files = commit.files?.slice(0, 30).map((file) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
  }));

  return JSON.stringify(
    {
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      stats: commit.stats,
      files,
    },
    null,
    2,
  );
}

async function requestAiSummary(messages: AiMessage[]) {
  const apiKey = process.env.AI_API_KEY;
  const endpoint = process.env.AI_API_ENDPOINT;

  if (!apiKey || !endpoint) {
    return {
      status: "unavailable",
      text: "Add AI_API_KEY and AI_API_ENDPOINT to enable commit summaries.",
    } satisfies CommitAiSummary;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "GitAtlas",
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL ?? "meta-llama/llama-3.1-8b-instruct:free",
      messages,
      max_tokens: 90,
      temperature: 0.2,
    }),
    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) {
    return {
      status: "unavailable",
      text: "AI summary is unavailable right now.",
    } satisfies CommitAiSummary;
  }

  const payload = (await response.json()) as AiResponse;
  const summary = payload.choices?.[0]?.message?.content?.trim();

  if (!summary) {
    return {
      status: "unavailable",
      text: "AI summary is unavailable right now.",
    } satisfies CommitAiSummary;
  }

  return {
    status: "ready",
    text: summary.replace(/^["']|["']$/g, ""),
  } satisfies CommitAiSummary;
}

export const summarizeCommit = cache(async (commit: GitHubCommitDetails) => {
  return requestAiSummary([
    {
      role: "system",
      content:
        "You summarize individual Git commits for developers. Write one concise paragraph, 1-2 sentences, plain text only. Focus on what changed and why it likely matters. Do not invent details beyond the commit metadata.",
    },
    {
      role: "user",
      content: `Summarize this GitHub commit:\n${buildCommitPrompt(commit)}`,
    },
  ]);
});
