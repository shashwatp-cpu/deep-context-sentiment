import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import StatsGrid from '../components/StatsGrid';
import SentimentChart from '../components/SentimentChart';
import SentimentBadge from '../components/SentimentBadge';
import { ArrowLeft, ExternalLink } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

const API_Base = "http://localhost:8000/api/v1";

const Dashboard = () => {
  const [status, setStatus] = useState('LOADING'); // LOADING, SUCCESS, ERROR
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const url = searchParams.get('url');

    if (!url) {
      setStatus('IDLE');
      return;
    }

    const fetchData = async () => {
      setStatus('LOADING');
      try {
        const res = await axios.post(`${API_Base}/analyze`, { url });
        setData(res.data);
        setStatus('SUCCESS');
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Failed to analyze URL.");
        setStatus('ERROR');
      }
    };

    fetchData();
  }, [location.search]);

  if (status === 'IDLE') {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">No URL provided</h2>
          <Link to="/" className="text-fuchsia-400 hover:text-fuchsia-300">Go back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-fuchsia-500/30 p-6 md:p-8 max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        {status === 'LOADING' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-[50vh] text-white"
          >
            <div className="text-xl">Analyzing... Please wait.</div>
          </motion.div>
        )}

        {status === 'ERROR' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-white space-y-4"
          >
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-3 rounded-xl backdrop-blur-md">
              {error}
            </div>
            <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Try another URL
            </Link>
          </motion.div>
        )}

        {status === 'SUCCESS' && data && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Link>
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
                    <span className="capitalize px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
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

export default Dashboard;