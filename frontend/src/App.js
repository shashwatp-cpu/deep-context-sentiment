import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import SearchPage from './pages/SearchPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage';

// Navigation Wrapper to show Navbar
const NavigationWrapper = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (location.pathname === '/') return children;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-indigo-500">
              DeepContext
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-slate-400 hidden md:block">{user.email} <span className="text-xs border border-slate-700 rounded px-1">{user.plan_type}</span></span>
                  <Link to="/pricing" className="text-sm text-slate-300 hover:text-white">Pricing</Link>
                  <button onClick={logout} className="text-sm bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-slate-300 hover:text-white">Login</Link>
                  <Link to="/register" className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

// Redirect to /search if logged in, else show Landing
const RootRoute = () => {
  // We want the Landing Page to be visible even if logged in? 
  // Usually marketing pages are visible to everyone. 
  // But if logged in, the "Get Started" buttons should go to App.
  // The previous request said: "For the cases the user already has an account on the top right... provide option to login or sign up (or Open App)"
  return <Landing />;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};


function App() {
  return (
    <Router>
      <AuthProvider>
        <NavigationWrapper>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </NavigationWrapper>
      </AuthProvider>
    </Router>
  );
}

export default App;