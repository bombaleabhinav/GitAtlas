import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import GraphView from './components/GraphView';
import { supabase } from './supabaseClient';
import { LogOut } from 'lucide-react';

function App() {
  const [session, setSession] = useState(null);
  const [commits, setCommits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error logging in:', error);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleFetchCommits = async (repoUrl) => {
    setLoading(true);
    setError('');
    
    try {
      // In production, point to your actual backend URL or use relative if proxied
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/repo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: repoUrl }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch commits');
      }
      
      setCommits(data.commits);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-[#030014] text-white">
      {/* Background Starfield */}
      <div className="stars-bg"></div>

      {/* Header Auth */}
      <div className="absolute top-4 right-4 z-50">
        {session ? (
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
              <img src={session.user.user_metadata.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} alt="Avatar" />
            </div>
            <span className="text-sm font-medium">{session.user.user_metadata.full_name}</span>
            <button 
              onClick={handleLogout}
              className="text-white/50 hover:text-white transition-colors p-1"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 transition-all text-sm font-medium"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
            Sign in with Google
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-screen w-full flex flex-col">
        {!commits ? (
          <Landing 
            onSearch={handleFetchCommits} 
            loading={loading} 
            error={error} 
            onClearError={() => setError('')} 
          />
        ) : (
          <>
            <button 
              onClick={() => setCommits(null)}
              className="absolute top-6 left-6 z-50 text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md transition-all"
            >
              ← Back to Search
            </button>
            <GraphView commits={commits} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
