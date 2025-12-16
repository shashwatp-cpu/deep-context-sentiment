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
                <div className="p-4 bg-brand-primary/5 rounded-2xl">
                    <MessageSquare className="w-8 h-8 text-brand-primary" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Comments</p>
                    <h4 className="text-3xl font-bold text-brand-primary">{summary.totalComments}</h4>
                </div>
            </GlassCard>

            <GlassCard className="flex items-center space-x-4 hover:scale-[1.02] transition-transform">
                <div className="p-4 bg-brand-accent/10 rounded-2xl">
                    <BarChart3 className="w-8 h-8 text-brand-orange" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Top Emotion</p>
                    <h4 className="text-xl font-bold text-brand-primary truncate max-w-[150px]" title={dominantLabel}>
                        {dominantLabel}
                    </h4>
                </div>
            </GlassCard>

            <GlassCard className="flex items-center space-x-4 hover:scale-[1.02] transition-transform">
                <div className="p-4 bg-brand-red/5 rounded-2xl">
                    <Clock className="w-8 h-8 text-brand-red" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">AI Analysis Time</p>
                    <h4 className="text-3xl font-bold text-brand-primary">{processingTime.toFixed(2)}s</h4>
                </div>
            </GlassCard>
        </div>
    );
};

export default StatsGrid;
