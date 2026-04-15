"use client";

import Image from "next/image";
import type { GitHubCommitDetails } from "@/lib/github";

type CommitDetailsProps = {
  commit: GitHubCommitDetails | null;
  isLoading: boolean;
  error: string;
  onClose: () => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function CommitDetails({
  commit,
  isLoading,
  error,
  onClose,
}: CommitDetailsProps) {
  return (
    <aside className="absolute inset-x-3 bottom-3 z-20 max-h-[46vh] overflow-hidden rounded-lg border border-white/10 bg-black/90 shadow-2xl backdrop-blur md:inset-x-auto md:right-6 md:top-24 md:h-[calc(100vh-7rem)] md:max-h-none md:w-[390px]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Details</p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-lg leading-none text-white transition hover:border-white/40 hover:bg-white/10"
          aria-label="Close commit details"
        >
          x
        </button>
      </div>

      <div className="h-full overflow-y-auto px-5 py-5">
        {isLoading ? (
          <div className="space-y-4">
            <div className="skeleton h-5 w-2/3 rounded bg-neutral-800" />
            <div className="skeleton h-16 rounded bg-neutral-900" />
            <div className="skeleton h-32 rounded bg-neutral-900" />
          </div>
        ) : null}

        {!isLoading && error ? (
          <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-neutral-300">
            {error}
          </p>
        ) : null}

        {!isLoading && commit ? (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-neutral-500">
                {commit.sha.slice(0, 7)}
              </p>
              <h2 className="text-xl font-medium leading-snug text-white">
                {commit.commit.message.split("\n")[0]}
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
              {commit.author?.avatar_url ? (
                <Image
                  src={commit.author.avatar_url}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full grayscale"
                />
              ) : (
                <div className="h-10 w-10 rounded-full border border-white/20 bg-neutral-900" />
              )}
              <div>
                <p className="text-sm font-medium text-white">{commit.commit.author.name}</p>
                <p className="text-xs text-neutral-500">{formatDate(commit.commit.author.date)}</p>
              </div>
            </div>

            <section className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium text-white">AI summary</h3>
                <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                  Generated
                </p>
              </div>
              <p
                className={`text-sm leading-6 ${
                  commit.aiSummary?.status === "ready" ? "text-neutral-200" : "text-neutral-500"
                }`}
              >
                {commit.aiSummary?.text ?? "AI summary is unavailable right now."}
              </p>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Files changed</h3>
                {commit.stats ? (
                  <p className="text-xs text-neutral-500">
                    +{commit.stats.additions} / -{commit.stats.deletions}
                  </p>
                ) : null}
              </div>

              {commit.files?.length ? (
                <ul className="space-y-2">
                  {commit.files.map((file) => (
                    <li
                      key={file.filename}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                    >
                      <p className="break-words text-sm text-white">{file.filename}</p>
                      <p className="mt-2 text-xs text-neutral-500">
                        +{file.additions} / -{file.deletions}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-neutral-400">
                  No file list was returned for this commit.
                </p>
              )}
            </section>
          </div>
        ) : null}

        {!isLoading && !error && !commit ? (
          <p className="text-sm text-neutral-500">Select a checkpoint to inspect the commit.</p>
        ) : null}
      </div>
    </aside>
  );
}
