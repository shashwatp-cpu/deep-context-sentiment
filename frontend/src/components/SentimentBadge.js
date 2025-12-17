import React from 'react';

const sentimentColors = {
    'Supportive/Empathetic': 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40',
    'Informative/Neutral': 'bg-slate-700/60 text-slate-200 border-slate-500/60',
    'Critical/Disapproving': 'bg-amber-500/15 text-amber-300 border-amber-400/40',
    'Sarcastic/Ironic': 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/40',
    'Angry/Hostile': 'bg-rose-500/20 text-rose-300 border-rose-400/60 font-semibold',
    'Appreciative/Praising': 'bg-cyan-500/15 text-cyan-300 border-cyan-400/40',
};

const SentimentBadge = ({ sentiment, className = '' }) => {
    // Normalizing keys to match data
    const key = sentimentColors[sentiment] ? sentiment : 'Informative/Neutral';
    const colorClass = sentimentColors[key];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] uppercase tracking-[0.16em] border ${colorClass} ${className}`}>
            {sentiment}
        </span>
    );
};

export default SentimentBadge;
