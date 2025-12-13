import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const pricingRef = useRef(null);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlanSelect = (plan) => {
    if (user) {
      navigate('/pricing'); // Already logged in, go to payment
    } else {
      navigate('/register'); // Create account first
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-indigo-500">
              DeepContext
            </Link>
            <div className="flex items-center space-x-4">
              {!user && (
                <>
                  <Link to="/login" className="text-sm text-slate-300 hover:text-white px-3 py-2">
                    Login
                  </Link>
                  <button
                    onClick={scrollToPricing}
                    className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg hover:shadow-indigo-500/25"
                  >
                    Sign Up
                  </button>
                </>
              )}
              {user && (
                <Link to="/search" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors">
                  Open App
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-4xl space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm text-sm text-slate-300 mx-auto">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span>AI-Powered Sentiment Analysis</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-tight">
            Understand the Emotion <br className="hidden md:block" /> Behind the Comments
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Unlock deep contextual insights from YouTube, Twitter, and Social Media.
            Go beyond simple positive/negative analysis with our advanced AI engine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={scrollToPricing}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 rounded-full text-white font-bold text-lg hover:opacity-90 transition-all shadow-xl hover:shadow-fuchsia-500/25 flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 rounded-full text-slate-200 font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
            >
              Existing User Login
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-24 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-slate-400 text-lg">Choose the perfect plan for your analysis needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* Free Plan */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all hover:scale-105">
              <h3 className="text-xl font-bold text-slate-100">Free</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="ml-1 text-slate-400">/mo</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">Perfect for trying out the power of DeepContext.</p>
              <button
                onClick={() => handlePlanSelect('free')}
                className="mt-8 w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Start for Free
              </button>
              <ul className="mt-8 space-y-4">
                {[
                  "5 Analysis per day",
                  "Basic Sentiment Support",
                  "Standard Support"
                ].map((feat, i) => (
                  <li key={i} className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Basic Plan */}
            <div className="bg-gradient-to-b from-indigo-900/50 to-slate-800 rounded-2xl p-8 border border-indigo-500/50 relative shadow-2xl shadow-indigo-500/10 transform scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
              <h3 className="text-xl font-bold text-white">Basic</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$1</span>
                <span className="ml-1 text-slate-300">/mo</span>
              </div>
              <p className="mt-4 text-sm text-indigo-200">For creators and small teams.</p>
              <button
                onClick={() => handlePlanSelect('basic')}
                className="mt-8 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/50"
              >
                Subscribe Now
              </button>
              <ul className="mt-8 space-y-4">
                {[
                  "50 Analysis per day",
                  "Detailed Reports",
                  "Priority Processing",
                  "Email Support"
                ].map((feat, i) => (
                  <li key={i} className="flex items-center text-slate-200 text-sm">
                    <CheckCircle className="w-4 h-4 text-indigo-400 mr-3 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all hover:scale-105">
              <h3 className="text-xl font-bold text-slate-100">Pro</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$5</span>
                <span className="ml-1 text-slate-400">/mo</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">Unlimited power for heavy usage.</p>
              <button
                onClick={() => handlePlanSelect('pro')}
                className="mt-8 w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Get Pro Access
              </button>
              <ul className="mt-8 space-y-4">
                {[
                  "Unlimited Analysis",
                  "Advanced Insights",
                  "Data Export (CSV/JSON)",
                  "24/7 Priority Support"
                ].map((feat, i) => (
                  <li key={i} className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-800">
        <p>© 2024 DeepContext. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Landing;