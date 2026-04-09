import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CommitNode from './CommitNode';
import SidePanel from './SidePanel';
import { motion, AnimatePresence } from 'framer-motion';

const nodeTypes = {
  commitNode: CommitNode,
};

export default function GraphView({ commits }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedCommit, setSelectedCommit] = useState(null);

  // Generate DAG Layout manually for zig-zag
  useEffect(() => {
    if (!commits || commits.length === 0) return;

    const newNodes = [];
    const newEdges = [];
    
    // Reverse to show oldest first? Or newest at top?
    // Usually timeline starts top-left with newest or oldest. Let's do newest at top since that's index 0 from fetch.
    const displayCommits = [...commits].reverse(); // oldest at top for start->finish flow
    
    const startX = window.innerWidth / 2;
    const startY = 100;
    const ySpacing = 120;
    const xOffset = 180;
    
    displayCommits.forEach((commit, index) => {
      // Zig-zag calculation
      const rowNum = index;
      const isEven = rowNum % 2 === 0;
      
      // X swings left and right of center
      const offsetX = (index % 4 === 1 || index % 4 === 2) ? xOffset : -xOffset;
      const x = startX + offsetX * (index === 0 ? 0 : 1);
      const y = startY + index * ySpacing;
      
      newNodes.push({
        id: commit.sha,
        type: 'commitNode',
        position: { x, y },
        data: {
          ...commit,
          isFirst: index === 0,
          isSecret: commit.containsSecret,
          // Classification will be populated later or we guess initially
          classification: commit.containsSecret ? 'secret' : 'minor',
          onHover: () => setHoveredNode(commit),
          onLeave: () => setHoveredNode(null),
        },
      });

      if (index > 0) {
        const prevCommit = displayCommits[index - 1];
        newEdges.push({
          id: `e-${prevCommit.sha}-${commit.sha}`,
          source: prevCommit.sha,
          target: commit.sha,
          animated: true,
          style: { stroke: 'rgba(14, 165, 233, 0.5)', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: 'rgba(14, 165, 233, 0.5)',
          },
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [commits, setNodes, setEdges]);
  
  const handleNodeClick = useCallback((event, node) => {
    setSelectedCommit(node.data);
  }, []);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-transparent"
      >
        <Background gap={30} size={1} color="rgba(255,255,255,0.05)" />
        <Controls className="!bg-black/50 !border-white/10 !fill-white" />
      </ReactFlow>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredNode && !selectedCommit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl z-40 max-w-sm pointer-events-none"
          >
            <p className="text-white/50 text-xs mb-1 font-mono">{hoveredNode.sha.substring(0, 7)}</p>
            <p className="text-white font-medium mb-2 line-clamp-2">{hoveredNode.message.split('\\n')[0]}</p>
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>{hoveredNode.author}</span>
              <span>{new Date(hoveredNode.date).toLocaleDateString()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Panel */}
      <SidePanel 
        commit={selectedCommit} 
        onClose={() => setSelectedCommit(null)} 
      />
    </div>
  );
}
