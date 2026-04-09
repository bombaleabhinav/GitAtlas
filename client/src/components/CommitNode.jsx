import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitCommit, AlertTriangle } from 'lucide-react';

const CommitNode = ({ data }) => {
  const { classification = 'minor', message, isFirst, isSecret } = data;
  
  // Design system for node types
  const config = {
    feature: { color: 'text-green-400', bg: 'bg-green-400/10', class: 'node-feature' },
    refactor: { color: 'text-blue-400', bg: 'bg-blue-400/10', class: 'node-refactor' },
    bugfix: { color: 'text-zinc-400', bg: 'bg-zinc-400/10', class: 'node-bugfix' },
    minor: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', class: 'node-minor' },
    secret: { color: 'text-red-500', bg: 'bg-red-500/10', class: 'node-secret' }
  };

  const styleConfig = isSecret ? config.secret : (config[classification] || config.minor);
  
  return (
    <div className={`relative flex items-center justify-center p-3 rounded-full border-2 bg-black/60 backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer ${styleConfig.class} ${data.isHovered ? 'scale-110 z-50' : 'z-10'}`}
         onMouseEnter={data.onHover}
         onMouseLeave={data.onLeave}
    >
      <Handle type="target" position={Position.Top} className="opacity-0 w-1 h-1" />
      
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${styleConfig.bg}`}>
        {isFirst ? (
           <div className="text-xl">🚀</div>
        ) : isSecret ? (
          <AlertTriangle className={`w-5 h-5 ${styleConfig.color}`} />
        ) : classification === 'feature' ? (
          <div className="text-lg">🌟</div>
        ) : classification === 'bugfix' ? (
          <div className="text-lg">🛠️</div>
        ) : (
          <GitCommit className={`w-5 h-5 ${styleConfig.color}`} />
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="opacity-0 w-1 h-1" />
    </div>
  );
};

export default memo(CommitNode);
