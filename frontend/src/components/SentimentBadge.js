import React from 'react';

const sentimentColors = {
    'Supportive/Empathetic': 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    'Informative/Neutral': 'bg-brand-cream text-brand-primary border-brand-primary/10',
    'Critical/Disapproving': 'bg-brand-red/10 text-brand-red border-brand-red/20',
    'Sarcastic/Ironic': 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
    'Angry/Hostile': 'bg-brand-red/20 text-brand-red border-brand-red/30 font-bold',
    'Appreciative/Praising': 'bg-brand-accent/20 text-brand-orange border-brand-accent/40',
};

const SentimentBadge = ({ sentiment, className = '' }) => {
    // Normalizing keys to match data
    const key = sentimentColors[sentiment] ? sentiment : 'Informative/Neutral';
    const colorClass = sentimentColors[key];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass} ${className}`}>
            {sentiment}
        </span>
    );
};

export default SentimentBadge;
