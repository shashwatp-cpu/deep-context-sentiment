import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  ArrowRight, CheckCircle, BarChart, Zap, Search, Menu, X
} from 'lucide-react';

const Landing = () => {
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-700 font-sans selection:bg-brand-primary/20">

      {/* Navbar - GiveWell Style: Clean White */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/95 backdrop-blur-sm border-slate-200 shadow-sm py-2' : 'bg-white border-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo area */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-brand-primary text-white flex items-center justify-center font-bold text-xl rounded-sm shadow-sm group-hover:bg-teal-600 transition-colors">
                  D
                </div>
                <span className="text-xl font-bold text-brand-secondary tracking-tight">DeepContext</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {!user ? (
                <>
                  <Link to="/login" className="text-base font-medium text-slate-600 hover:text-brand-primary transition-colors">
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-brand-primary text-white px-6 py-2.5 rounded text-base font-bold hover:bg-teal-600 transition-all shadow-sm hover:shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <Link to="/search" className="bg-brand-primary text-white px-6 py-2 rounded font-bold hover:bg-teal-600 transition-colors">
                  Go to Dashboard
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full px-4 py-4 shadow-lg flex flex-col space-y-4">
            {!user ? (
              <>
                <Link to="/login" className="text-base font-medium text-slate-600 block py-2">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-primary text-white px-6 py-3 rounded text-center block font-bold"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <Link to="/search" className="bg-brand-primary text-white px-6 py-3 rounded text-center block font-bold">
                Go to Dashboard
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section - GiveWell Style: Strong functionality focus, often dark or simple background */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-brand-secondary text-white overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-brand-secondary to-slate-900 opacity-100"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6 text-white">
            We analyze comments to find <span className="text-brand-primary">real sentiment</span>.
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto font-light">
            DeepContext digs deeper than simple keywords. We pinpoint sarcasm, context, and genuine emotion in social conversations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded font-bold text-lg hover:bg-teal-500 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Start Analyzing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
            >
              View Demo
            </Link>
          </div>

          <p className="mt-8 text-sm text-slate-400">
            Trusted by data analysts and content creators worldwide.
          </p>
        </div>
      </header>

      {/* "Mission" / Problem Section - GiveWell Style: Light Grey Background, clean typography */}
      <section className="py-20 bg-brand-light border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-secondary mb-4">The Problem with Traditional Tools</h2>
            <div className="w-16 h-1 bg-brand-primary mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Most sentiment analysis tools are shallow. They see "Great job!" as positive, even when users are mocking a failure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">1</div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-brand-secondary">Missed Sarcasm</h3>
                  <p className="text-slate-600 mt-1">Standard tools fail to detect irony, flagging sarcastic praise as genuine support.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">2</div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-brand-secondary">No Context Awareness</h3>
                  <p className="text-slate-600 mt-1">Without knowing the video or post topic, comments are often misinterpreted.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">3</div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-brand-secondary">Vague Metrics</h3>
                  <p className="text-slate-600 mt-1">Binary "Positive/Negative" labels don't capture human nuance like "Informative" or "Supportive".</p>
                </div>
              </div>
            </div>

            {/* Visual Comparison */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
              <div className="mb-4 border-b border-slate-100 pb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Comment</p>
                <p className="text-lg font-serif italic text-slate-700">"Nice work destroying the project."</p>
              </div>

              <div className="flex items-center justify-between mb-4 opacity-50 grayscale">
                <div>
                  <p className="text-xs font-bold text-slate-400">Standard Tool</p>
                  <p className="text-green-600 font-bold">Positive (90%)</p>
                </div>
                <div className="text-xs text-slate-400">Incorrect</div>
              </div>

              <div className="flex items-center justify-between bg-brand-light p-4 rounded border border-brand-primary/20">
                <div>
                  <p className="text-xs font-bold text-brand-primary">DeepContext AI</p>
                  <p className="text-brand-orange font-bold flex items-center gap-2">Sarcastic / Critical <CheckCircle className="w-4 h-4" /></p>
                </div>
                <div className="text-xs text-brand-primary font-bold">Correct</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Clean Grid */}
      <section className="py-24 bg-white text-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-secondary">Our Process</h2>
            <p className="mt-4 text-slate-600">Simple, transparent, and effective.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Input Source", desc: "Paste a YouTube URL or social media link. We instantly fetch comments and video metadata." },
              { icon: Zap, title: "Deep Analysis", desc: "Our AI evaluates every comment against the content context to determine true intent." },
              { icon: BarChart, title: "Actionable Data", desc: "Receive a detailed report breaking down sentiment by category, not just polarity." }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-brand-light rounded-lg border border-slate-100 hover:border-brand-primary/30 transition-colors">
                <div className="w-12 h-12 bg-teal-100 text-brand-primary rounded flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-brand-secondary mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - GiveWell Style: "Top Charities" Cards */}
      <section className="py-24 bg-brand-light border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-secondary">Plans & Pricing</h2>
            <p className="mt-4 text-slate-600">Choose the depth of analysis you need.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brand-secondary mb-2">Pro Creator</h3>
                <p className="text-slate-500 mb-6">For individual content creators.</p>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-extrabold text-brand-primary">$29</span>
                  <span className="ml-2 text-slate-500">/ month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["50 Analyses per day", "Sarcasm Detection", "CSV Export", "Email Support"].map((feat, i) => (
                    <li key={i} className="flex items-center text-slate-700">
                      <CheckCircle className="w-4 h-4 text-brand-primary mr-3" /> {feat}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow relative">
              <div className="absolute top-0 right-0 bg-brand-secondary text-white text-xs font-bold px-3 py-1 uppercase rounded-bl">
                Best Value
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brand-secondary mb-2">Enterprise</h3>
                <p className="text-slate-500 mb-6">For agencies and large teams.</p>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-extrabold text-brand-secondary">$99</span>
                  <span className="ml-2 text-slate-500">/ month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Unlimited Analyses", "API Access", "Custom Integrations", "Dedicated Account Manager"].map((feat, i) => (
                    <li key={i} className="flex items-center text-slate-700">
                      <CheckCircle className="w-4 h-4 text-brand-primary mr-3" /> {feat}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Teaser / Footer Callout */}
      <section className="py-20 bg-brand-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to see reality?</h2>
          <p className="text-xl text-teal-100 mb-8">Join thousands of users uncovering the hidden sentiment in their communities today.</p>
          <Link to="/register" className="inline-block bg-white text-brand-primary px-8 py-4 rounded font-bold text-lg hover:bg-slate-100 transition-colors shadow-lg">
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer - GiveWell Style: Dark, simple */}
      <footer className="bg-brand-dark text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white/10 flex items-center justify-center font-bold text-white rounded">D</div>
              <span className="text-xl font-bold text-white">DeepContext</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              DeepContext helps you understand the real emotion behind the text, powered by advanced AI and context-aware natural language processing.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-brand-primary transition-colors">Features</Link></li>

              <li><Link to="#" className="hover:text-brand-primary transition-colors">API Keys</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-brand-primary transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-brand-primary transition-colors">Documentation</Link></li>
              <li><Link to="#" className="hover:text-brand-primary transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-brand-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-brand-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-700 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} DeepContext AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;