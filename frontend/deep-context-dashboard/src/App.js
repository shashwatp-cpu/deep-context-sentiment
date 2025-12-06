import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import GlassCard from './components/GlassCard';
import StatsGrid from './components/StatsGrid';
import SentimentChart from './components/SentimentChart';
import SentimentBadge from './components/SentimentBadge';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const API_Base = "http://localhost:8000/api/v1";

function App() {
  const [status, setStatus] = useState('IDLE'); // IDLE, LOADING, SUCCESS, ERROR
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const analyzeUrl = async (url) => {
    setStatus('LOADING');
    setError(null);
    try {
      // Direct call to analyze endpoint
      const res = await axios.post(`${API_Base}/analyze`, { url });
      setData(res.data);
      setStatus('SUCCESS');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to analyze URL. Please check the link and try again.");
      setStatus('ERROR');
    }
  };

  const reset = () => {
    setStatus('IDLE');
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-fuchsia-500/30">
      <AnimatePresence mode="wait">
        {status !== 'SUCCESS' ? (
          <motion.div
            key="hero"
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0"
          >
            <Hero onAnalyze={analyzeUrl} isLoading={status === 'LOADING'} />
            {error && (
              <div className="absolute bottom-12 left-0 right-0 p-4 flex justify-center animate-fade-in">
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-3 rounded-xl backdrop-blur-md">
                  {error}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto space-y-6"
          >
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={reset}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  Analysis Results
                </h1>
              </div>
              <a
                href={data?.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
              >
                <span>View Original Post</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </header>

            {/* Context Card */}
            <GlassCard className="mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                {data?.postContext?.images?.[0] && (
                  <img
                    src={data.postContext.images[0]}
                    alt="Post content"
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="capitalize px-2 py-0.5 rounded text-xs - font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {data?.platform}
                    </span>
                    <span className="text-slate-500 text-xs text-mono">
                      {new Date(data?.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-100 line-clamp-2">
                    {data?.postContext?.title || data?.postContext?.description || "No Title Detected"}
                  </h2>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {data?.postContext?.text || "No description text available."}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Stats & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <StatsGrid analysis={data} />

                <GlassCard className="min-h-[400px]">
                  <h3 className="text-xl font-semibold mb-6 text-slate-100">Top Comments</h3>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(data?.topComments || {}).map(([category, comments]) => (
                      <div key={category} className="space-y-3">
                        {comments.map((comment, idx) => (
                          <div key={`${category}-${idx}`} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors">
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <SentimentBadge sentiment={category.replace(/_/g, '/').replace(/\b\w/g, l => l.toUpperCase())} />
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">"{comment}"</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <div className="lg:col-span-1">
                <SentimentChart data={data?.summary} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;