import React from 'react';

const Button = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors ${className}`}
  >
    {children}
  </button>
);

// Make sure you are using "export default"
export default Button;