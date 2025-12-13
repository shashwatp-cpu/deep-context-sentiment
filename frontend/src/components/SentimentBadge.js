import React from 'react';

const sentimentColors = {
    'Supportive/Empathetic': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Informative/Neutral': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Critical/Disapproving': 'bg-red-500/20 text-red-300 border-red-500/30',
    'Sarcastic/Ironic': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Angry/Hostile': 'bg-red-600/20 text-red-400 border-red-600/30',
    'Appreciative/Praising': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
};

const SentimentBadge = ({ sentiment, className = '' }) => {
    const colorClass = sentimentColors[sentiment] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorClass} ${className}`}>
            {sentiment}
        </span>
    );
};

export default SentimentBadge;
