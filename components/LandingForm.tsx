"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { parseGitHubRepoUrl } from "@/lib/repo";

export default function LandingForm() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const repo = parseGitHubRepoUrl(repoUrl);

    if (!repo) {
      setError("Enter a valid GitHub repository URL, like https://github.com/vercel/next.js.");
      return;
    }

    router.push(`/repo/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
    >
      <div className="flex-1">
        <label htmlFor="repo-url" className="sr-only">
          GitHub repository URL
        </label>
        <input
          id="repo-url"
          value={repoUrl}
          onChange={(event) => setRepoUrl(event.target.value)}
          placeholder="Enter GitHub repository URL"
          className="h-14 w-full rounded-lg border border-white/15 bg-black/60 px-5 text-base text-white outline-none backdrop-blur transition placeholder:text-neutral-500 focus:border-white/55 focus:shadow-glow"
        />
        {error ? (
          <p className="mt-3 text-sm text-neutral-300" role="status">
            {error}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        className="h-14 rounded-lg border border-white bg-white px-6 text-sm font-medium uppercase tracking-[0.18em] text-black transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
      >
        Visualize
      </button>
    </form>
  );
}
