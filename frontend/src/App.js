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
    <div className="min-h-screen bg-brand-cream text-brand-primary">
      <nav className="border-b border-brand-primary/10 bg-brand-cream/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-xl font-bold text-brand-primary flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand-primary text-brand-cream flex items-center justify-center font-serif italic text-lg shadow-lg">D</span>
              DeepContext
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-brand-primary/70 hidden md:block">{user.email} <span className="text-xs border border-brand-primary/20 rounded px-1">{user.plan_type}</span></span>
                  <Link to="/pricing" className="text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors">Pricing</Link>
                  <button onClick={logout} className="text-sm bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-lg hover:bg-brand-red/20 transition-colors font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors">Login</Link>
                  <Link to="/register" className="text-sm bg-brand-primary text-brand-cream px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition-all font-medium shadow-lg shadow-brand-primary/20">
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