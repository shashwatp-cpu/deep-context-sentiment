import React from 'react';

const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder="Enter a social media link (Facebook, Instagram, YouTube, X)..."
    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

// Make sure you are using "export default"
export default SearchBar;