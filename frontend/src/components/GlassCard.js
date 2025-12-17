import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`rounded-3xl p-8 bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 shadow-[0_18px_45px_rgba(15,23,42,0.85)] ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
