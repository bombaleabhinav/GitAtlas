import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Search, AlertCircle } from 'lucide-react';

export default function Landing({ onSearch, loading, error, onClearError }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSearch(url.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative px-4">
      
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full text-center z-10"
      >
        <div className="inline-flex items-center justify-center p-3 mb-6 bg-white/5 border border-white/10 rounded-2xl glow-effect backdrop-blur-md">
          <Rocket className="w-8 h-8 text-cyan-400" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
          GitAtlas
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 mb-12 font-light">
          Convert any GitHub repository&apos;s commit history into a space-themed, gamified visual timeline.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-opacity duration-300" />
          <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden shadow-2xl transition-all focus-within:border-cyan-400/50">
            <div className="pl-5 pr-3 py-4 text-white/40">
              <Search size={22} className={loading ? "animate-pulse text-cyan-400" : ""} />
            </div>
            <input 
              type="text" 
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) onClearError();
              }}
              placeholder="https://github.com/owner/repo"
              className="flex-1 bg-transparent border-none text-white placeholder:text-white/30 focus:outline-none focus:ring-0 py-4 text-lg w-full"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={!url || loading}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-l border-white/10 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Warping...
                </>
              ) : (
                'Explore'
              )}
            </button>
          </div>
        </form>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </motion.div>
      
    </div>
  );
}
