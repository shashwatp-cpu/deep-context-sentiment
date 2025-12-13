import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-gray-800 p-4 shadow-md">
    <nav>
      <Link to="/" className="text-xl font-bold">
        DeepContext
      </Link>
    </nav>
  </header>
);

// Make sure you are using "export default"
export default Header;