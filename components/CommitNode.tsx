"use client";

import { memo } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";

export type CommitNodeData = {
  sha: string;
  selected: boolean;
  isLatest: boolean;
};

function CommitNode({ data }: NodeProps) {
  const nodeData = data as unknown as CommitNodeData;

  return (
    <button
      type="button"
      className={`group relative flex h-20 w-20 items-center justify-center rounded-full border bg-black text-xs font-medium text-white transition duration-300 hover:scale-105 hover:border-white hover:shadow-glow ${
        nodeData.isLatest
          ? "border-white shadow-[0_0_18px_rgba(255,255,255,0.45),0_0_54px_rgba(255,255,255,0.24)]"
          : nodeData.selected
            ? "border-white shadow-glow"
            : "border-neutral-600"
      }`}
      aria-label={`Open commit ${nodeData.sha.slice(0, 7)}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border !border-neutral-500 !bg-black"
      />
      <span className="tracking-[0.12em]">{nodeData.sha.slice(0, 7)}</span>
      {nodeData.isLatest ? (
        <span className="absolute -bottom-6 text-[10px] uppercase tracking-[0.22em] text-neutral-300">
          latest
        </span>
      ) : null}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border !border-neutral-500 !bg-black"
      />
    </button>
  );
}

export default memo(CommitNode);
