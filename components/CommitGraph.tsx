"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import {
  Background,
  BackgroundVariant,
  Controls as FlowControls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import type {
  GitHubBranch,
  GitHubCommitDetails,
  GitHubCommitSummary,
} from "@/lib/github";
import CommitDetails from "@/components/CommitDetails";
import CommitNode, { CommitNodeData } from "@/components/CommitNode";
import Controls from "@/components/Controls";

type CommitGraphProps = {
  owner: string;
  repo: string;
  initialBranches: GitHubBranch[];
  initialCommits: GitHubCommitSummary[];
  initialBranch: string;
};

type ApiError = {
  error: string;
};

const nodeTypes = {
  commit: CommitNode,
};

const nodeWidth = 80;
const columnGap = 150;
const rowGap = 132;

function graphErrorMessage(message: string) {
  if (message.toLowerCase().includes("rate limit")) {
    return "GitHub rate limit reached. Let the stars settle for a moment, then try again.";
  }

  return message;
}

export default function CommitGraph(props: CommitGraphProps) {
  return (
    <ReactFlowProvider>
      <CommitGraphInner {...props} />
    </ReactFlowProvider>
  );
}

function CommitGraphInner({
  owner,
  repo,
  initialBranches,
  initialCommits,
  initialBranch,
}: CommitGraphProps) {
  const [branches] = useState(initialBranches);
  const [commits, setCommits] = useState(initialCommits);
  const [selectedBranch, setSelectedBranch] = useState(initialBranch);
  const [limit, setLimit] = useState(25);
  const [selectedSha, setSelectedSha] = useState<string | null>(null);
  const [commitDetails, setCommitDetails] = useState<GitHubCommitDetails | null>(null);
  const [detailsError, setDetailsError] = useState("");
  const [graphError, setGraphError] = useState("");
  const [isGraphPending, startGraphTransition] = useTransition();
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const fetchCommits = useCallback(
    (branch: string, nextLimit: number) => {
      setGraphError("");
      startGraphTransition(async () => {
        const params = new URLSearchParams({
          branch,
          limit: String(nextLimit),
        });

        const response = await fetch(`/api/repos/${owner}/${repo}?${params.toString()}`);
        const payload = (await response.json()) as { commits?: GitHubCommitSummary[] } & ApiError;

        if (!response.ok) {
          setGraphError(graphErrorMessage(payload.error));
          return;
        }

        setCommits(payload.commits ?? []);
        setSelectedSha(null);
        setCommitDetails(null);
      });
    },
    [owner, repo],
  );

  const fetchCommitDetails = useCallback(
    async (sha: string) => {
      setSelectedSha(sha);
      setCommitDetails(null);
      setDetailsError("");
      setIsDetailsLoading(true);

      try {
        const params = new URLSearchParams({
          resource: "commit",
          sha,
        });
        const response = await fetch(`/api/repos/${owner}/${repo}?${params.toString()}`);
        const payload = (await response.json()) as { commit?: GitHubCommitDetails } & ApiError;

        if (!response.ok) {
          setDetailsError(graphErrorMessage(payload.error));
          return;
        }

        setCommitDetails(payload.commit ?? null);
      } finally {
        setIsDetailsLoading(false);
      }
    },
    [owner, repo],
  );

  const onBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    fetchCommits(branch, limit);
  };

  const onLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    fetchCommits(selectedBranch, nextLimit);
  };

  const chronologicalCommits = useMemo(() => [...commits].reverse(), [commits]);
  const latestSha = commits[0]?.sha ?? null;

  const columns = useMemo(() => {
    if (chronologicalCommits.length <= 10) {
      return chronologicalCommits.length;
    }

    return Math.min(12, Math.max(4, Math.ceil(Math.sqrt(chronologicalCommits.length * 1.8))));
  }, [chronologicalCommits.length]);

  const nodes = useMemo<Node<CommitNodeData>[]>(
    () =>
      chronologicalCommits.map((commit, index) => ({
        id: commit.sha,
        type: "commit",
        position: {
          x: (index % columns) * (nodeWidth + columnGap),
          y: Math.floor(index / columns) * (nodeWidth + rowGap),
        },
        data: {
          sha: commit.sha,
          selected: selectedSha === commit.sha,
          isLatest: commit.sha === latestSha,
        },
      })),
    [chronologicalCommits, columns, latestSha, selectedSha],
  );

  const edges = useMemo<Edge[]>(
    () =>
      chronologicalCommits.slice(0, -1).map((commit, index) => ({
        id: `${commit.sha}-${chronologicalCommits[index + 1].sha}`,
        source: commit.sha,
        target: chronologicalCommits[index + 1].sha,
        type: "smoothstep",
        animated: selectedSha ? commit.sha === selectedSha : false,
        style: {
          stroke:
            selectedSha === commit.sha || chronologicalCommits[index + 1].sha === latestSha
              ? "#fff"
              : "#737373",
          strokeWidth:
            selectedSha === commit.sha || chronologicalCommits[index + 1].sha === latestSha
              ? 1.8
              : 1,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color:
            selectedSha === commit.sha || chronologicalCommits[index + 1].sha === latestSha
              ? "#fff"
              : "#737373",
          width: 16,
          height: 16,
        },
      })),
    [chronologicalCommits, latestSha, selectedSha],
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      const node = selectedNodes[0];

      if (node?.id && node.id !== selectedSha) {
        void fetchCommitDetails(node.id);
      }
    },
    [fetchCommitDetails, selectedSha],
  );

  useEffect(() => {
    if (!selectedSha || commits.some((commit) => commit.sha === selectedSha)) {
      return;
    }

    setSelectedSha(null);
    setCommitDetails(null);
  }, [commits, selectedSha]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Controls
        branches={branches}
        selectedBranch={selectedBranch}
        limit={limit}
        isLoading={isGraphPending}
        onBranchChange={onBranchChange}
        onLimitChange={onLimitChange}
      />

      <motion.div
        className="h-[calc(100vh-89px)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {graphError ? (
          <div className="m-6 rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-neutral-300">
            {graphError}
          </div>
        ) : null}

        {!graphError && commits.length === 0 ? (
          <div className="m-6 rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-neutral-300">
            No commits were found for this branch.
          </div>
        ) : null}

        {!graphError && commits.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.16 }}
            minZoom={0.15}
            maxZoom={1.7}
            nodesDraggable={false}
            onSelectionChange={onSelectionChange}
            onNodeClick={(_, node) => void fetchCommitDetails(node.id)}
            className="bg-black"
          >
            <Background color="#262626" gap={28} size={1} variant={BackgroundVariant.Dots} />
            <MiniMap
              pannable
              zoomable
              nodeColor={(node) => (node.id === selectedSha ? "#fff" : "#737373")}
              maskColor="rgba(0, 0, 0, 0.72)"
            />
            <FlowControls showInteractive={false} />
          </ReactFlow>
        ) : null}
      </motion.div>

      {isGraphPending ? (
        <div className="pointer-events-none absolute inset-x-0 top-[89px] z-10 h-px bg-white/50" />
      ) : null}

      <CommitDetails
        commit={commitDetails}
        isLoading={isDetailsLoading}
        error={detailsError}
        onClose={() => {
          setSelectedSha(null);
          setCommitDetails(null);
          setDetailsError("");
        }}
      />
    </div>
  );
}
