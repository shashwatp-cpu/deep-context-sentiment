import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import GlassCard from '../components/GlassCard';
import StatsGrid from '../components/StatsGrid';
import SentimentChart from '../components/SentimentChart';
import SentimentBadge from '../components/SentimentBadge';
import { ArrowLeft, ExternalLink, Search, Sparkles, Send } from 'lucide-react';

const API_Base = "http://localhost:8000/api/v1";

const COLORS = {
  'Supportive/Empathetic': '#003049',
  'Informative/Neutral': '#475569',
  'Critical/Disapproving': '#D62828',
  'Sarcastic/Ironic': '#F77F00',
  'Angry/Hostile': '#991B1B',
  'Appreciative/Praising': '#FCBF49',
};

const Dashboard = () => {
  const [status, setStatus] = useState('IDLE'); // IDLE, LOADING, SUCCESS, ERROR
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [inputUrl, setInputUrl] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const url = searchParams.get('url');

    if (url) {
      setInputUrl(url);
      fetchData(url);
    } else {
      setStatus('IDLE');
      setData(null);
    }
  }, [location.search]);

  const fetchData = async (url) => {
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

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      navigate(`/dashboard?url=${encodeURIComponent(inputUrl)}`);
    }
  };

  const ChartSection = ({ data }) => {
    // Prepare data for Bar Chart
    const chartData = Object.entries(data.summary)
      .filter(([key]) => key !== 'totalComments')
      .map(([key, value]) => ({
        name: key.replace(/_/g, '/').replace(/\b\w/g, l => l.toUpperCase()),
        value: value,
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SentimentChart data={data.summary} />

        <GlassCard className="h-[400px] flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-6 text-brand-primary">Intent Strength</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans p-4 md:p-8 max-w-7xl mx-auto space-y-8">

      {/* Input Section */}
      <section className="bg-white rounded-3xl p-1 shadow-lg shadow-brand-primary/5 max-w-3xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
        <form onSubmit={handleAnalyze} className="relative flex items-center">
          <div className="pl-6 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste YouTube or Social Media Link..."
            className="w-full py-4 px-4 text-slate-700 bg-transparent text-lg placeholder:text-slate-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={status === 'LOADING'}
            className="m-2 px-8 py-3 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === 'LOADING' ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>Analyze</span>
          </button>
        </form>
      </section>

      <AnimatePresence mode="wait">

        {/* Loading State */}
        {status === 'LOADING' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[40vh] text-brand-primary"
          >
            <div className="w-16 h-16 border-4 border-brand-accent border-t-brand-primary rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold">Analyzing Context & Comments...</h3>
            <p className="text-slate-500 mt-2">Our AI is reading between the lines.</p>
          </motion.div>
        )}

        {/* Error State */}
        {status === 'ERROR' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[40vh] space-y-4"
          >
            <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red px-6 py-4 rounded-xl text-center max-w-lg">
              <p className="font-bold mb-1">Analysis Failed</p>
              <p className="text-sm">{error || "Something went wrong. Please check the URL and try again."}</p>
            </div>
          </motion.div>
        )}

        {/* Results State */}
        {status === 'SUCCESS' && data && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >

            {/* Context Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {data?.postContext?.images?.[0] && (
                <img
                  src={data.postContext.images[0]}
                  alt="Content Thumbnail"
                  className="w-full md:w-64 aspect-video object-cover rounded-2xl shadow-lg border border-white/20"
                />
              )}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {data?.platform}
                  </span>
                  <span className="text-slate-500 text-xs font-medium">
                    {new Date(data?.timestamp).toLocaleString()}
                  </span>
                  <a href={data?.postUrl} target="_blank" rel="noreferrer" className="text-brand-primary hover:text-brand-orange transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-brand-primary leading-tight">
                  {data?.postContext?.title || "Analyzed Content"}
                </h1>
                <p className="text-slate-600 leading-relaxed max-w-3xl">
                  {data?.postContext?.text || data?.postContext?.description}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <StatsGrid analysis={data} />

            {/* Charts Section */}
            <ChartSection data={data} />

            {/* Top Comments Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <h3 className="text-2xl font-bold text-brand-primary mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-brand-accent rounded-full display-block"></span>
                  Key Insights from Comments
                </h3>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {Object.entries(data?.topComments || {}).map(([category, comments]) => (
                    <div key={category} className="break-inside-avoid">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="mb-4 pb-4 border-b border-slate-50 flex items-center justify-between">
                          <SentimentBadge sentiment={category.replace(/_/g, '/').replace(/\b\w/g, l => l.toUpperCase())} />
                        </div>
                        <div className="space-y-4">
                          {comments.map((comment, idx) => (
                            <div key={idx} className="relative pl-4 border-l-2 border-brand-primary/10">
                              <p className="text-slate-600 text-sm italic">"{comment}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;
