import React from 'react';
import GlassCard from './GlassCard';
import { MessageSquare, Clock, BarChart3 } from 'lucide-react';

const StatsGrid = ({ analysis }) => {
    if (!analysis || !analysis.summary) return null;
    const { summary, processingTime } = analysis;

    // Calculate dominant sentiment
    const sentiments = Object.entries(summary).filter(([k]) => k !== 'totalComments');
    const dominant = sentiments.reduce((prev, current) => (prev[1] > current[1] ? prev : current), ['None', 0]);
    const dominantLabel = dominant[0].replace(/_/g, '/').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="flex items-center space-x-4 hover:scale-[1.02] transition-transform">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400">
                    <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Total Comments</p>
                    <h4 className="text-3xl font-bold text-slate-50">{summary.totalComments}</h4>
                </div>
            </GlassCard>

            <GlassCard className="flex items-center space-x-4 hover:scale-[1.02] transition-transform">
                <div className="p-4 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400">
                    <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Top Emotion</p>
                    <h4 className="text-xl font-semibold text-slate-50 truncate max-w-[150px]" title={dominantLabel}>
                        {dominantLabel}
                    </h4>
                </div>
            </GlassCard>

            <GlassCard className="flex items-center space-x-4 hover:scale-[1.02] transition-transform">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Clock className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">AI Analysis Time</p>
                    <h4 className="text-3xl font-bold text-slate-50">{processingTime.toFixed(2)}s</h4>
                </div>
            </GlassCard>
        </div>
    );
};

export default StatsGrid;
