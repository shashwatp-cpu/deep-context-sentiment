import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, ArrowRight, CheckCircle, AlertTriangle,
  BarChart, Zap, Users, Shield, Play,
  MessageSquare, TrendingUp, Search
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const pricingRef = useRef(null);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlanSelect = (plan) => {
    if (user) {
      navigate('/pricing');
    } else {
      navigate('/register');
    }
  };

  // Mock Data for Demo
  const demoComments = [
    { text: "This is exactly what I needed! Game changer.", sentiment: "Appreciative", color: "bg-brand-primary" },
    { text: "I don't think this works as expected...", sentiment: "Critical", color: "bg-brand-red" },
    { text: "Oh great, another 'AI' tool. Just what we need.", sentiment: "Sarcastic", color: "bg-brand-orange" },
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-primary font-sans selection:bg-brand-accent/30">

      {/* Navbar (Landing specific) */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-brand-primary/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-white text-brand-primary flex items-center justify-center font-serif italic text-lg shadow-lg">D</span>
              DeepContext
            </Link>
            <div className="flex items-center space-x-6">
              {!user && (
                <>
                  <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                    Login
                  </Link>
                  <button
                    onClick={scrollToPricing}
                    className="text-sm bg-brand-accent text-brand-primary px-4 py-2.5 rounded-lg font-semibold hover:bg-white hover:scale-105 transition-all shadow-lg shadow-brand-accent/20"
                  >
                    Start Free
                  </button>
                </>
              )}
              {user && (
                <Link to="/search" className="text-sm bg-brand-accent text-brand-primary px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors">
                  Open Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-primary text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-accent/20 via-brand-primary to-brand-primary opacity-50"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-brand-accent mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium tracking-wide uppercase text-xs">AI-Powered Context Analysis</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
            Decode the <span className="text-brand-accent decoration-wavy underline decoration-brand-red/50">Real Emotion</span> <br />
            Behind Every Comment.
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            Stop guessing. Our AI reads between the lines to detect sarcasm, irony, hostility, and genuine support in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToPricing}
              className="w-full sm:w-auto px-8 py-4 bg-brand-accent text-brand-primary rounded-xl font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-xl shadow-brand-accent/20 flex items-center justify-center gap-2"
            >
              Analyze Now <ArrowRight className="w-5 h-5" />
            </button>
            <div className="text-sm text-white/50 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm">
              No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* Why Traditional Fails */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-brand-red uppercase tracking-widest mb-2">The Problem</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-brand-primary mb-6">Traditional Sentiment Analysis is Broken.</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Keyword-based tools miss the point. They see "Great job!" and mark it positive, even if the video is about a total failure.
              </p>
              <ul className="space-y-4">
                {[
                  "Misses sarcasm and irony entirely",
                  "Ignores video/post context",
                  "Cannot distinguish between angry and constructive",
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700 font-medium">
                    <AlertTriangle className="w-5 h-5 text-brand-red mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-brand-cream rounded-3xl p-8 border border-brand-primary/10 shadow-lg relative">
              <div className="absolute -top-4 -right-4 bg-brand-red text-white px-4 py-2 rounded-lg font-bold shadow-lg transform rotate-3">
                Traditional Tool
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 opacity-50">
                  <p className="text-sm text-slate-500 mb-1">Comment</p>
                  <p className="font-medium">"Wow, what a genius move. 👏"</p>
                  <div className="mt-2 text-green-600 font-bold text-sm">Detected: POSITIVE ✅</div>
                </div>
                <div className="bg-white p-4 rounded-xl border-l-4 border-brand-accent shadow-md transform scale-105">
                  <p className="text-sm text-slate-500 mb-1">Context</p>
                  <p className="font-medium">Video about a car crash...</p>
                  <div className="mt-2 text-brand-orange font-bold text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    DeepContext: SARCASTIC / MOCKING
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it Works</h2>
            <p className="text-white/60 text-lg">Three steps to clarity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "1. Paste Link", desc: "Start with any YouTube video or Social Media/Tweet URL." },
              { icon: Zap, title: "2. AI Processing", desc: "We analyze the content + top comments together." },
              { icon: BarChart, title: "3. Clear Insights", desc: "Get a breakdown of real human emotions." },
            ].map((step, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center text-brand-primary mb-6">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-24 bg-brand-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-primary">See it in Action</h2>
          </div>

          <div className="relative max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-brand-primary/5 overflow-hidden">
            {/* Fake Browser UI */}
            <div className="bg-brand-primary px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="bg-white/10 flex-1 ml-4 rounded px-3 py-1 text-xs text-white/50 text-center font-mono">
                deepcontext.ai/dashboard
              </div>
            </div>

            <div className="p-8 grid md:grid-cols-3 gap-8">
              {/* Chart Side */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-brand-cream/50 p-6 rounded-xl border border-brand-primary/5 text-center">
                  <div className="relative w-32 h-32 mx-auto rounded-full border-8 border-brand-accent flex items-center justify-center">
                    <span className="text-2xl font-bold text-brand-primary">72%</span>
                  </div>
                  <p className="mt-4 font-bold text-brand-primary">Sarcastic</p>
                  <p className="text-xs text-slate-500">Dominant Emotion</p>
                </div>
              </div>

              {/* Comments Side */}
              <div className="md:col-span-2 space-y-4">
                {demoComments.map((c, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow bg-white">
                    <div className="flex-1">
                      <p className="text-slate-800 font-medium text-sm">"{c.text}"</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white h-fit ${c.color === 'bg-brand-primary' ? 'bg-brand-primary' : c.color === 'bg-brand-red' ? 'bg-brand-red' : 'bg-brand-orange'}`}>
                      {c.sentiment}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights (Grid) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-12 text-center">Why Power Users Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Context Aware", desc: "Understands the video topic, not just the text." },
              { title: "Sarcasm Detective", desc: "Flags irony that others miss." },
              { title: "Emotion Clarity", desc: "6 distinct emotional categories." },
              { title: "Creator Friendly", desc: "Built for YouTubers and Influencers." }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-xl bg-brand-cream/30 border border-brand-primary/5 hover:border-brand-accent transition-colors group">
                <h3 className="font-bold text-lg text-brand-primary mb-2 group-hover:text-brand-orange transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Who is this for?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Are you a Creator?", "Brand Manager?", "Marketing Agency?", "Political Analyst?"].map((uc, i) => (
              <div key={i} className="bg-white/5 border border-white/10 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 cursor-default">
                {uc}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-24 bg-brand-cream relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-primary">Simple Pricing</h2>
            <p className="mt-4 text-slate-600">Start for free. Scale when you need to.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-brand-primary/20 transition-all hover:shadow-xl">
              <h3 className="text-xl font-bold text-brand-primary">Free</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-brand-primary">$0</span>
                <span className="ml-1 text-slate-500">/mo</span>
              </div>
              <button
                onClick={() => handlePlanSelect('free')}
                className="mt-8 w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-brand-primary rounded-xl font-bold transition-colors"
              >
                Start for Free
              </button>
              <ul className="mt-8 space-y-4">
                {["5 Analysis / day", "Basic Categories", "Community Support"].map((feat, i) => (
                  <li key={i} className="flex items-center text-slate-600 text-sm">
                    <CheckCircle className="w-4 h-4 text-brand-primary/50 mr-3" /> {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Scale Plan */}
            <div className="bg-brand-primary rounded-2xl p-8 border-2 border-brand-accent relative shadow-2xl transform scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-brand-accent text-brand-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-white">Pro Creator</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$29</span>
                <span className="ml-1 text-white/50">/mo</span>
              </div>
              <button
                onClick={() => handlePlanSelect('pro')}
                className="mt-8 w-full py-3 px-4 bg-brand-accent hover:bg-white text-brand-primary rounded-xl font-bold transition-all"
              >
                Get Pro Access
              </button>
              <ul className="mt-8 space-y-4">
                {["50 Analysis / day", "Sarcasm & Irony Detection", "Export to CSV", "Priority Support"].map((feat, i) => (
                  <li key={i} className="flex items-center text-white/90 text-sm">
                    <CheckCircle className="w-4 h-4 text-brand-accent mr-3" /> {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-brand-primary/20 transition-all hover:shadow-xl">
              <h3 className="text-xl font-bold text-brand-primary">Enterprise</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-brand-primary">$99</span>
                <span className="ml-1 text-slate-500">/mo</span>
              </div>
              <button
                onClick={() => handlePlanSelect('enterprise')}
                className="mt-8 w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-brand-primary rounded-xl font-bold transition-colors"
              >
                Contact Sales
              </button>
              <ul className="mt-8 space-y-4">
                {["Unlimited Analysis", "API Access", "Custom Integration", "Dedicated Monitor"].map((feat, i) => (
                  <li key={i} className="flex items-center text-slate-600 text-sm">
                    <CheckCircle className="w-4 h-4 text-brand-primary/50 mr-3" /> {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-primary text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-white text-brand-primary flex items-center justify-center font-serif italic text-lg shadow-lg">D</span>
              DeepContext
            </Link>
            <p className="text-white/50 max-w-xs">
              The only comment analytics tool that understands context, sarcasm, and true audience sentiment.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-brand-accent">Features</a></li>
              <li><a href="#" className="hover:text-brand-accent">Pricing</a></li>
              <li><a href="#" className="hover:text-brand-accent">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-brand-accent">Privacy</a></li>
              <li><a href="#" className="hover:text-brand-accent">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-white/30 text-sm pt-8 border-t border-white/10">
          <p>© 2025 DeepContext AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;