"use client";

import type { GitHubBranch } from "@/lib/github";

const commitLimits = [10, 25, 50, 100];

type ControlsProps = {
  branches: GitHubBranch[];
  selectedBranch: string;
  limit: number;
  isLoading: boolean;
  onBranchChange: (branch: string) => void;
  onLimitChange: (limit: number) => void;
};

export default function Controls({
  branches,
  selectedBranch,
  limit,
  isLoading,
  onBranchChange,
  onLimitChange,
}: ControlsProps) {
  return (
    <div className="flex w-full flex-col gap-3 border-b border-white/10 bg-black/85 px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">GitAtlas</p>
        <h1 className="mt-1 text-lg font-medium text-white">Commit checkpoint flow</h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-neutral-500">
          Branch
          <select
            value={selectedBranch}
            onChange={(event) => onBranchChange(event.target.value)}
            disabled={isLoading}
            className="h-10 min-w-44 rounded-lg border border-white/15 bg-black px-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-white/60 disabled:opacity-50"
          >
            {branches.map((branch) => (
              <option key={branch.name} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-neutral-500">
          Limit
          <select
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            disabled={isLoading}
            className="h-10 min-w-28 rounded-lg border border-white/15 bg-black px-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-white/60 disabled:opacity-50"
          >
            {commitLimits.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
