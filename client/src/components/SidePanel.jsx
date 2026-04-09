import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, GitCommit, User, Calendar, FileText, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function SidePanel({ commit, onClose }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!commit) return;
    
    // Reset state when new commit is selected
    setSummary(null);
    setError('');
    
    // Fetch summary
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.post(`${apiUrl}/api/analyze-commit`, {
          message: commit.message,
          diff: commit.patch || ''
        });
        
        setSummary(res.data);
        
        // Optionally update the parent node directly here if we had access to setNodes
        // but for now, displaying it in the panel is fine.
      } catch (err) {
        setError('Failed to generate AI summary.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, [commit]);

  const typeColors = {
    feature: 'text-green-400 bg-green-400/10 border-green-400/20',
    bugfix: 'text-zinc-300 bg-zinc-500/10 border-zinc-500/20',
    refactor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    minor: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    secret: 'text-red-500 bg-red-500/10 border-red-500/30'
  };

  return (
    <AnimatePresence>
      {commit && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 w-full md:w-[480px] h-full bg-[#08051a]/95 backdrop-blur-2xl border-l border-white/10 p-6 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <GitCommit className="text-cyan-400" />
              Commit Details
            </h2>
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {commit.containsSecret && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-red-400 font-medium mb-1">Security Warning</h3>
                <p className="text-red-300/70 text-sm">Potential secret found in this commit&apos;s patch or message.</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* AI Summary Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Cpu size={100} />
              </div>
              
              <h3 className="text-sm text-cyan-400 font-medium flex items-center gap-2 mb-3">
                <Cpu size={16} /> AI Analysis
              </h3>
              
              {loading ? (
                <div className="flex flex-col gap-2 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              ) : error ? (
                <p className="text-red-400 text-sm">{error}</p>
              ) : summary ? (
                <div>
                  <p className="text-lg font-medium mb-3">{summary.summary}</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${typeColors[summary.type] || typeColors.minor}`}>
                    {summary.type.toUpperCase()}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Metadata Section */}
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                <User className="text-white/40 mt-1" size={18} />
                <div>
                  <p className="text-xs text-white/40 mb-1">Author</p>
                  <p className="font-medium">{commit.author}</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                <Calendar className="text-white/40 mt-1" size={18} />
                <div>
                  <p className="text-xs text-white/40 mb-1">Date</p>
                  <p className="font-medium">{new Date(commit.date).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5 flex-col w-full break-all">
                 <div className="flex gap-4">
                   <FileText className="text-white/40 mt-1 shrink-0" size={18} />
                   <div>
                     <p className="text-xs text-white/40 mb-1">Message</p>
                     <p className="font-mono text-sm whitespace-pre-wrap">{commit.message}</p>
                   </div>
                 </div>
                 <div className="mt-2 pl-8">
                     <p className="text-xs text-white/40 mb-1">SHA</p>
                     <a href={commit.url} target="_blank" rel="noreferrer" className="font-mono text-sm text-cyan-400 hover:underline">{commit.sha}</a>
                 </div>
                 {commit.filesChanged !== undefined && (
                   <div className="mt-2 pl-8">
                      <p className="text-xs text-white/40 mb-1">Files Changed</p>
                      <p className="font-mono text-sm">{commit.filesChanged}</p>
                   </div>
                 )}
              </div>
            </div>
            
            <a 
              href={commit.url}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-4 text-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium border border-white/10"
            >
              View on GitHub
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
