import React from 'react';
import GlassCard from './GlassCard';
import { MessageSquare, Clock, BarChart3 } from 'lucide-react';

const StatsGrid = ({ analysis }) => {
    if (!analysis || !analysis.summary) return null;
    const { summary, processingTime, allComments } = analysis;

    // Calculate dominant sentiment
    const sentiments = Object.entries(summary).filter(([k]) => k !== 'totalComments');
    const dominant = sentiments.reduce((prev, current) => (prev[1] > current[1] ? prev : current), ['None', 0]);
    const dominantLabel = dominant[0].replace(/_/g, '/').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                    <MessageSquare className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                    <p className="text-sm text-slate-400 font-medium">Total Comments</p>
                    <h4 className="text-2xl font-bold text-slate-100">{summary.totalComments}</h4>
                </div>
            </GlassCard>

            <GlassCard className="flex items-center space-x-4">
                <div className="p-3 bg-fuchsia-500/10 rounded-xl">
                    <BarChart3 className="w-8 h-8 text-fuchsia-400" />
                </div>
                <div>
                    <p className="text-sm text-slate-400 font-medium">Dominant Sentiment</p>
                    <h4 className="text-lg font-bold text-slate-100 truncate max-w-[150px]" title={dominantLabel}>
                        {dominantLabel}
                    </h4>
                </div>
            </GlassCard>

            <GlassCard className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <Clock className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                    <p className="text-sm text-slate-400 font-medium">Processing Time</p>
                    <h4 className="text-2xl font-bold text-slate-100">{processingTime.toFixed(2)}s</h4>
                </div>
            </GlassCard>
        </div>
    );
};

export default StatsGrid;
