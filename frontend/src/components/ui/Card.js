import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ title, children, className }) => (
  <motion.div
    className={`bg-gray-800 rounded-lg shadow-lg mb-8 ${className || 'p-6'}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className={`text-2xl font-bold mb-4 ${!className && 'px-6 pt-6'} ${className && 'p-6'}`}>{title}</h2>
    {children}
  </motion.div>
);

export default Card;