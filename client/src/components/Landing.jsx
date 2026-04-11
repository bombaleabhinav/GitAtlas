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

      {/* High Contrast Video Background */}
      <div className="video-bg-container">
        <video autoPlay loop muted playsInline>
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full text-center z-10"
      >
        <div className="inline-flex items-center justify-center p-3 mb-6 bg-white/5 border border-white/20 rounded-2xl backdrop-blur-md">
          <Rocket className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-lg">
          GitAtlas
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-12 font-medium bg-black/20 backdrop-blur-sm inline-block px-4 py-1 rounded-full">
          Monochromatic Git Visualization
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto group">
          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-black/60 backdrop-blur-2xl border border-white/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all focus-within:border-white">
            <div className="pl-5 pr-3 py-4 text-white/60">
              <Search size={22} className={loading ? "animate-pulse text-white" : ""} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) onClearError();
              }}
              placeholder="https://github.com/owner/repo"
              className="flex-1 bg-transparent border-none text-white placeholder:text-white/40 focus:outline-none focus:ring-0 py-4 text-lg w-full"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!url || loading}
              className="px-8 py-4 bg-white text-black font-bold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-l border-white/20 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-red-600 border border-red-500 text-white font-bold rounded-lg text-sm shadow-lg"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </motion.div>

    </div>
  );
}
