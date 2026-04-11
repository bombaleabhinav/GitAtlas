import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitCommit, AlertTriangle } from 'lucide-react';

const CommitNode = ({ data }) => {
  const { classification = 'minor', isFirst, isSecret } = data;
  
  // Restricted Color Logic
  const isBad = isSecret || classification === 'bugfix';
  const nodeClass = isBad ? 'node-bad' : 'node-good';
  const iconColor = isBad ? 'text-red-500' : 'text-green-500';
  const bgColor = isBad ? 'bg-red-500/10' : 'bg-green-500/10';

  return (
    <div className={`relative flex items-center justify-center p-3 rounded-full border-2 bg-black/80 backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer ${nodeClass}`}
         onMouseEnter={data.onHover}
         onMouseLeave={data.onLeave}
    >
      <Handle type="target" position={Position.Top} className="opacity-0 w-1 h-1" />
      
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor}`}>
        {isFirst ? (
           <div className="text-xl">🚀</div>
        ) : isBad ? (
          <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
        ) : (
          <GitCommit className={`w-5 h-5 ${iconColor}`} />
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="opacity-0 w-1 h-1" />
    </div>
  );
};

export default memo(CommitNode);
