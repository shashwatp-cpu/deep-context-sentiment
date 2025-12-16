import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl shadow-brand-primary/5 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
