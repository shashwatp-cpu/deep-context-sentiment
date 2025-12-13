import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = () => (
  <div className="p-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      <div className="lg:col-span-2">
        <div className="bg-gray-700 h-48 rounded-lg"></div>
        <div className="bg-gray-700 h-64 rounded-lg mt-8"></div>
      </div>
      <div className="bg-gray-700 h-96 rounded-lg"></div>
    </div>
    <div className="bg-gray-700 h-96 rounded-lg mt-8"></div>
  </div>
);

export default SkeletonLoader;