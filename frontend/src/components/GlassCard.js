import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
