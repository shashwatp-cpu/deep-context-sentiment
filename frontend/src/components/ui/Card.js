import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ title, children, className }) => (
  <motion.div
    className={`mb-8 rounded-3xl border border-slate-800/80 bg-slate-900/80 shadow-[0_18px_45px_rgba(15,23,42,0.85)] ${className || 'p-6'}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2
      className={`text-lg font-semibold tracking-tight text-slate-50 mb-4 ${!className && 'px-6 pt-6'} ${
        className && 'p-6'
      }`}
    >
      {title}
    </h2>
    {children}
  </motion.div>
);

export default Card;