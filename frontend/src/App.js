import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, useUser, useClerk } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import SearchPage from './pages/SearchPage';
import Dashboard from './pages/Dashboard';

// Please set this provided key in your .env file as REACT_APP_CLERK_PUBLISHABLE_KEY
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || "pk_test_PLACEHOLDER_KEY_PLEASE_REPLACE";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  console.warn("Missing Publishable Key. Please set REACT_APP_CLERK_PUBLISHABLE_KEY in your .env");
}

// Navigation Wrapper to show Navbar
const NavigationWrapper = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();

  if (location.pathname === '/') return children;

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-xl font-bold flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-sm bg-brand-primary text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-teal-600 transition-colors">D</span>
              <span className="text-xl font-bold text-brand-secondary tracking-tight">DeepContext</span>
            </Link>
            <div className="flex items-center space-x-6">
              {isLoaded && user ? (
                <>
                  <span className="text-sm text-slate-500 hidden md:block">
                    {user.primaryEmailAddress?.emailAddress}
                  </span>

                  <button
                    onClick={() => signOut()}
                    className="text-sm bg-slate-100 text-slate-600 px-4 py-2 rounded font-medium hover:bg-slate-200 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-slate-600 hover:text-brand-primary transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-brand-primary text-white px-5 py-2.5 rounded font-bold hover:bg-teal-600 transition-all shadow-sm"
                  >
                    Get Started
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
  return <Landing />;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>
    </>
  );
};


function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <NavigationWrapper>
          <Routes>
            <Route path="/" element={<RootRoute />} />

            {/* Protected Routes */}
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Auth Routes */}
            <Route
              path="/login/*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-brand-cream">
                  <SignIn routing="path" path="/login" signUpUrl="/register" redirectUrl="/search" />
                </div>
              }
            />
            <Route
              path="/register/*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-brand-cream">
                  <SignUp routing="path" path="/register" signInUrl="/login" redirectUrl="/search" />
                </div>
              }
            />
          </Routes>
        </NavigationWrapper>
      </Router>
    </ClerkProvider>
  );
}

export default App;