import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import StatsGrid from '../components/StatsGrid';
import SentimentChart from '../components/SentimentChart';
import SentimentBadge from '../components/SentimentBadge';
import { ExternalLink, Sparkles, Loader2, Link as LinkIcon, ArrowLeft, LayoutGrid } from 'lucide-react';

const API_Base = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

const COLORS = {
  'Supportive/Empathetic': '#00A99D',
  'Informative/Neutral': '#64748B',
  'Critical/Disapproving': '#D62828',
  'Sarcastic/Ironic': '#F77F00',
  'Angry/Hostile': '#991B1B',
  'Appreciative/Praising': '#FCBF49',
};



const Dashboard = () => {
  const { getToken } = useAuth();
  const [status, setStatus] = useState('IDLE'); // IDLE, LOADING, SUCCESS, ERROR
  const [data, setData] = useState(null); // Can be object (single) or array (batch)
  const [batchMode, setBatchMode] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null); // For drilling down in batch mode
  const [error, setError] = useState(null);
  const [inputUrl, setInputUrl] = useState(''); // Can contain multiple URLs separated by newline/comma

  // Ref to track the currently analyzing URL to prevent duplicate calls
  const analyzingUrlRef = useRef(null);
  const abortControllerRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlParam = searchParams.get('url');

    let debounceTimer;

    const fetchData = async (url) => {
      setStatus('LOADING');
      setError(null);
      setBatchMode(false);
      setSelectedAnalysis(null);
      analyzingUrlRef.current = url;

      // Create new AbortController
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const token = await getToken();
        const res = await axios.post(
          `${API_Base}/analyze`,
          { url },
          {
            signal: controller.signal,
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setData(res.data);
        setStatus('SUCCESS');
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          console.error(err);
          setError(err.response?.data?.detail || "Failed to analyze URL.");
          setStatus('ERROR');
        }
      } finally {
        analyzingUrlRef.current = null;
      }
    };

    const fetchBatchData = async (urls) => {
      setStatus('LOADING');
      setError(null);
      setBatchMode(true);
      setSelectedAnalysis(null);
      analyzingUrlRef.current = urls.join(',');

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const token = await getToken();
        const res = await axios.post(
          `${API_Base}/analyze/batch`,
          { urls },
          {
            signal: controller.signal,
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setData(res.data.results);
        setStatus('SUCCESS');
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          console.error(err);
          setError(err.response?.data?.detail || "Failed to analyze batch.");
          setStatus('ERROR');
        }
      } finally {
        analyzingUrlRef.current = null;
      }
    };

    // Only fetch if URL exists
    if (urlParam) {
      if (analyzingUrlRef.current === urlParam && status === 'LOADING') return;

      // Cancel previous request if exists (immediate cleanup)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Check if it's a batch request (comma or newline separated)
      const urls = urlParam.split(/[\n,]+/).map(u => u.trim()).filter(u => u);
      setInputUrl(urls.join('\n')); // Display as newlines in textarea

      debounceTimer = setTimeout(() => {
        if (urls.length > 1) {
          fetchBatchData(urls);
        } else {
          fetchData(urls[0]);
        }
      }, 100);

    } else {
      setStatus('IDLE');
      setData(null);
      setBatchMode(false);
      setSelectedAnalysis(null);
      analyzingUrlRef.current = null;
    }

    // Cleanup on unmount or re-run
    return () => {
      clearTimeout(debounceTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      // Split by newline or comma
      const urls = inputUrl.split(/[\n,]+/).map(u => u.trim()).filter(u => u);
      if (urls.length > 0) {
        const urlParam = urls.join(',');
        navigate(`/dashboard?url=${encodeURIComponent(urlParam)}`);
      }
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
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Sentiment Distribution</h3>
          <SentimentChart data={data.summary} />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Intent Strength</h3>
          <div className="flex-1 w-full min-h-[300px]">
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
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderSingleAnalysis = (analysisData) => (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Context Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {analysisData?.postContext?.images?.[0] && (
          <img
            src={analysisData.postContext.images[0]}
            alt="Content Thumbnail"
            className="w-full md:w-64 aspect-video object-cover rounded-xl shadow-md border border-slate-100"
          />
        )}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <span className="bg-teal-50 text-brand-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-teal-100">
              {analysisData?.platform}
            </span>
            <span className="text-slate-400 text-xs font-medium">
              {new Date(analysisData?.timestamp).toLocaleString()}
            </span>
            <a href={analysisData?.postUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-primary transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            {analysisData?.postContext?.title || "Analyzed Content"}
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-3xl">
            {analysisData?.postContext?.text || analysisData?.postContext?.description}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid analysis={analysisData} />

      {/* Charts Section */}
      <ChartSection data={analysisData} />

      {/* Top Comments Section */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-brand-primary rounded-full block"></span>
            Key Insights
          </h3>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {Object.entries(analysisData?.topComments || {}).map(([category, comments]) => (
              <div key={category} className="break-inside-avoid">
                <div className="rounded-xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="mb-4 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <SentimentBadge sentiment={category.replace(/_/g, '/').replace(/\b\w/g, l => l.toUpperCase())} />
                  </div>
                  <div className="space-y-4">
                    {comments.map((comment, idx) => (
                      <div key={idx} className="relative pl-4 border-l-2 border-slate-100 italic text-slate-600 text-sm">
                        "{comment}"
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
  );

  const renderBatchGrid = (batchResults) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <LayoutGrid className="w-6 h-6 text-brand-primary" />
        Batch Analysis Results
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batchResults.map((result, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-brand-primary/50 transition-all cursor-pointer group"
            onClick={() => setSelectedAnalysis(result)}
          >
            <div className="aspect-video w-full bg-slate-100 rounded-lg mb-4 overflow-hidden relative">
              {result.postContext?.images?.[0] ? (
                <img src={result.postContext.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <ExternalLink className="w-8 h-8" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm uppercase">
                {result.platform}
              </div>
            </div>

            <h3 className="font-bold text-lg text-slate-800 line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors">
              {result.postContext?.title || result.postUrl}
            </h3>

            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
              <span>{result.summary?.totalComments} Comments</span>
              <span>{new Date(result.timestamp).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* Mini Sentiment Indicators */}
              {Object.entries(result.summary || {})
                .filter(([k, v]) => k !== 'totalComments' && v > 0)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([key], i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[key.replace(/_/g, '/').replace(/\b\w/g, l => l.toUpperCase())] }}></div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans px-4 py-8 md:px-8 max-w-7xl mx-auto space-y-10 bg-brand-light">

      {/* Input Section - Clean Light Style */}
      <section className="max-w-3xl mx-auto">
        <form onSubmit={handleAnalyze} className="relative bg-white rounded-3xl p-4 shadow-lg border border-slate-100 transition-shadow focus-within:shadow-xl">
          <div className="flex items-start gap-3">
            <div className="mt-3 text-slate-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <textarea
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste YouTube or Social Media Links (one per line)..."
                className="w-full py-2 px-2 text-slate-800 bg-transparent text-lg placeholder:text-slate-400 focus:outline-none resize-y min-h-[50px]"
                required
                disabled={status === 'LOADING'}
                style={{ minHeight: inputUrl.includes('\n') ? '100px' : '50px' }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-2">
            <span className="text-xs font-semibold text-brand-primary/80 bg-brand-primary/5 px-2 py-1 rounded-md">
              ✨ Batch Mode Supported
            </span>
            <button
              type="submit"
              disabled={status === 'LOADING'}
              className="px-6 py-2.5 bg-brand-primary text-white rounded-full font-bold hover:bg-teal-600 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {status === 'LOADING' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{inputUrl.includes(',') || inputUrl.includes('\n') ? 'Analyze Batch' : 'Analyze'}</span>
            </button>
          </div>
        </form>
      </section>

      <AnimatePresence mode="wait">

        {/* Loading State - Light Clean UI */}
        {status === 'LOADING' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[40vh] text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-brand-primary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-16 h-16 border-4 border-slate-100 border-t-brand-primary rounded-full animate-spin"></div>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Context & Comments...</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {batchMode ? "Processing multiple links in parallel. This might take a moment." : "Our AI is reading between the lines to detect sarcasm, context, and true sentiment."}
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {status === 'ERROR' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[40vh] space-y-4"
          >
            <div className="bg-red-50 border border-red-100 text-red-600 px-8 py-6 rounded-xl text-center max-w-lg shadow-sm">
              <p className="font-bold text-lg mb-2">Analysis Failed</p>
              <p className="text-sm opacity-90">{error || "Something went wrong. Please check the URL and try again."}</p>
              <button
                onClick={() => handleAnalyze({ preventDefault: () => { } })}
                className="mt-4 text-sm font-bold underline hover:no-underline"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Results State */}
        {status === 'SUCCESS' && data && (
          <>
            {/* Back button when drilled down */}
            {selectedAnalysis && batchMode && (
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors font-semibold mb-[-20px]"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Batch Results
              </button>
            )}

            {/* Render Grid or Single Item */}
            {batchMode && !selectedAnalysis ? renderBatchGrid(data) : renderSingleAnalysis(selectedAnalysis || data)}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;
