"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Brain,
  Zap,
  Shield,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  Target,
  Eye,
  Slack,
  ChevronRight,
  Quote,
  Activity,
  GitBranch,
  EyeOff,
  BellRing
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-xl font-bold tracking-tight text-black">EliminateContext</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-800 hover:text-black transition-colors font-medium">Problem</a>
          <a href="#solution" className="text-sm text-gray-800 hover:text-black transition-colors font-medium">Solution</a>
          <a href="#use-cases" className="text-sm text-gray-800 hover:text-black transition-colors font-medium">Use Cases</a>
          <a href="#testimonials" className="text-sm text-gray-800 hover:text-black transition-colors font-medium">Testimonials</a>
          <Link href="/contact" className="text-sm text-gray-800 hover:text-black transition-colors font-medium">Contact</Link>
        </div>

        <div>
          <SignedOut>
            <Link href="/sign-up">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2 font-medium shadow-sm transition-all">
                Go to Dashboard
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2 font-medium shadow-sm transition-all">
                  Go to Dashboard
                </Button>
              </Link>
              <div className="flex items-center justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#faf7f5] min-h-[90vh]">
      <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#fce2d6] via-[#fdf2f0] to-transparent opacity-80" />
      <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ebddeb] via-transparent to-transparent opacity-60" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4eff4]/80 backdrop-blur-sm text-[#4e3a62] text-sm font-medium border border-purple-200/30">
            <Sparkles className="w-4 h-4 text-[#8a5df5]" /> Now in Private Beta
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6 text-black">
          The First <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 via-purple-600 to-purple-800">Context-Aware</span>
          <br />
          Social Listening Platform.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Stop Counting Keywords. Start Understanding Intent.
          <br />
          The Alternative to Brandwatch and Talkwalker.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col items-center gap-4 mb-20">
          <SignedOut>
            <Link href="/sign-up">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 font-medium text-lg shadow-xl shadow-purple-500/10 group transition-all">
                Start The Analysis <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 font-medium text-lg shadow-xl shadow-purple-500/10 group transition-all">
                Start The Analysis <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </SignedIn>
        </motion.div>

        {/* Dashboard Mockup Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative max-w-4xl mx-auto bg-white/60 backdrop-blur-xl border border-white rounded-3xl shadow-2xl overflow-hidden p-6 shadow-purple-900/5">

          {/* Header Mockup */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mr-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-48 h-8 rounded-full bg-gray-100"></div>
              <div className="w-48 h-8 rounded-full bg-gray-100"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-8 rounded-full bg-gray-100"></div>
              <div className="w-10 h-8 rounded-full bg-gray-100"></div>
            </div>
          </div>

          {/* Layout Mockup */}
          <div className="grid grid-cols-12 gap-6 h-64 mt-2">
            {/* Main Content */}
            <div className="col-span-3 flex flex-col gap-4">
              <div className="flex-1 bg-gray-100/80 rounded-2xl w-full"></div>
              <div className="flex-1 bg-gray-100/80 rounded-2xl w-full"></div>
            </div>
            <div className="col-span-5 relative flex flex-col gap-4">
              <div className="h-full bg-gray-100/50 rounded-2xl w-full flex items-center justify-end pr-6 border border-gray-50 shadow-inner">
                <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center"></div>
              </div>
            </div>
            {/* Sidebar */}
            <div className="col-span-4 flex flex-col gap-4 pt-2">
              <div className="h-5 w-full bg-gray-100/80 rounded-full"></div>
              <div className="h-5 w-5/6 bg-gray-100/80 rounded-full"></div>
              <div className="h-5 w-4/6 bg-gray-100/80 rounded-full"></div>

              <div className="h-5 w-full bg-gray-100/80 rounded-full mt-6"></div>
              <div className="h-5 w-3/4 bg-gray-100/80 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MeaningOverKeywordsSection() {
  const cards = [
    {
      sentiment: "Positive",
      sentimentColor: "text-green-600",
      bgClass: "border-t-[3px] border-t-green-500",
      text: "High-intent lead discussing budget and specific features.",
    },
    {
      sentiment: "Neutral",
      sentimentColor: "text-gray-500",
      bgClass: "border-t-[3px] border-t-gray-400",
      text: "Strategic mention by competitor CEO in industry interview.",
    },
    {
      sentiment: "Negative",
      sentimentColor: "text-red-500",
      bgClass: "border-t-[3px] border-t-red-500",
      text: "Constructive feedback from power user about API latency.",
    },
    {
      sentiment: "Neutral",
      sentimentColor: "text-gray-500",
      bgClass: "border-t-[3px] border-t-gray-400",
      text: "Sarcastic remark about legacy competitor pricing models.",
    },
    {
      sentiment: "Positive",
      sentimentColor: "text-green-600",
      bgClass: "border-t-[3px] border-t-green-500",
      text: "Viral praise for the new UI redesign on Reddit threads.",
    }
  ];

  return (
    <section className="py-24 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-black mb-4 tracking-tight">
          Meaning Over <span className="text-gray-400 italic font-serif relative inline-block">Keywords<div className="absolute inset-x-0 top-1/2 h-[2px] bg-gray-400 rotate-[-2deg]"></div></span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Legacy tools only see the surface. We see the strategy, intent, and emotion behind every mention.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {cards.map((card, i) => (
            <div key={i} className={`bg-white border text-center border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center ${card.bgClass}`}>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2 mt-2">Traditional Sentiment</span>
              <div className={`text-xl font-bold mb-6 line-through decoration-2 opacity-80 ${card.sentimentColor}`}>{card.sentiment}</div>

              <div className="w-full h-px bg-gray-100 my-4"></div>

              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-3 mt-2">Deep Context Insight</span>
              <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    {
      icon: Activity,
      title: "False Positives Everywhere",
      description: "Your dashboard shows 10,000 mentions but 40% are irrelevant. You're drowning in data, starving for insight."
    },
    {
      icon: GitBranch,
      title: "Boolean Logic Failures",
      description: "Complex query strings that break with every new slang term. Hours spent tweaking rules that never work."
    },
    {
      icon: EyeOff,
      title: "Sarcasm Blindness",
      description: "\"Great job breaking my order again\" reads as positive. Your AI thinks angry customers are happy ones."
    },
    {
      icon: BellRing,
      title: "Crisis Detected Too Late",
      description: "By the time your tool flags a crisis, it's already trending. You need to be reactive instead of predictive."
    }
  ];

  return (
    <section id="features" className="py-24 relative bg-purple-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center md:text-left">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger as any}>
            <motion.span variants={fadeInUp as any} className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-4 block">
              The Problem
            </motion.span>
            <motion.h2 variants={fadeInUp as any} className="text-4xl md:text-5xl font-bold text-black tracking-tight leading-tight">
              Your Analytics Dashboard
              <br />
              <span className="font-serif italic font-normal text-gray-600">is Lying to You.</span>
            </motion.h2>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger as any}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {problems.map((problem, i) => (
            <motion.div key={i} variants={fadeInUp as any} className="flex flex-col">
              <div className="w-12 h-12 rounded-full border border-purple-200 bg-white shadow-sm flex items-center justify-center mb-6">
                <problem.icon className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-black tracking-tight">{problem.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const steps = [
    { num: "01", title: "LLM-Powered Contextual NLP", desc: "Understanding meaning, not just matching words." },
    { num: "02", title: "Semantic Understanding", desc: "Grasps nuance, idioms, and cultural references." },
    { num: "03", title: "Crisis Prediction Engine", desc: "Identifies brewing issues before they explode." }
  ];

  return (
    <section id="solution" className="py-24 bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger as any}
            className="w-full md:w-3/5 space-y-0">

            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeInUp as any} className={`flex items-center gap-8 md:gap-12 py-8 ${i !== steps.length - 1 ? 'border-b border-white/20' : ''}`}>
                <span className="text-5xl md:text-6xl font-light text-white font-serif">{step.num}</span>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-2/5 md:text-right pt-8">
            <span className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-4 block">
              The Solution
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Enter the<br className="hidden md:block" /> Deep Context<br className="hidden md:block" /> Engine.
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ComparisonTableSection() {
  const rows = [
    { feature: "Analysis Method", legacy: "Boolean keyword matching", eliminate: "Generative AI contextual analysis" },
    { feature: "Sarcasm Detection", legacy: "Misclassifies as positive", eliminate: "94% accuracy rate" },
    { feature: "Crisis Detection", legacy: "Reactive (after trending)", eliminate: "Predictive (hours early)" },
    { feature: "Data Sources", legacy: "Limited API access", eliminate: "Full firehose + visual" },
    { feature: "Setup Time", legacy: "Weeks of Boolean tuning", eliminate: "Minutes, zero configuration" }
  ];

  return (
    <section className="py-32 bg-purple-50/30">
      <div className="max-w-7xl mx-auto px-6 flex flex-col xl:flex-row gap-16 items-start">

        <div className="xl:w-1/4 pt-8">
          <h2 className="text-3xl md:text-5xl font-bold text-black tracking-tight leading-tight">
            Legacy Tools<br />vs<br />EliminateContext
          </h2>
        </div>

        <div className="xl:w-3/4 w-full">
          <div className="rounded-2xl border border-gray-200/50 bg-[#a67cdd] overflow-hidden shadow-sm flex flex-col md:flex-row">

            {/* Left Block: Features & Legacy */}
            <div className="w-full md:w-2/3 text-white">
              <div className="grid grid-cols-2 border-b border-white/20">
                <div className="p-6 font-semibold text-white/90 text-sm">Features</div>
                <div className="p-6 font-semibold text-white/90 text-sm">Legacy Tools</div>
              </div>

              {rows.map((row, i) => (
                <div key={i} className={`grid grid-cols-2 ${i !== rows.length - 1 ? 'border-b border-white/20' : ''}`}>
                  <div className="p-6 text-sm font-medium">{row.feature}</div>
                  <div className="p-6 text-sm text-white/80">{row.legacy}</div>
                </div>
              ))}
            </div>

            {/* Right Block: EliminateContext */}
            <div className="w-full md:w-1/3 bg-white text-black md:rounded-r-2xl border-l border-gray-100 flex flex-col">
              <div className="border-b border-gray-100">
                <div className="p-6 font-bold text-black text-sm">EliminateContext</div>
              </div>

              {rows.map((row, i) => (
                <div key={i} className={`flex-1 flex items-center ${i !== rows.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="p-6 text-sm font-bold text-gray-900">{row.eliminate}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  const useCases = [
    {
      icon: Shield,
      title: "AI Crisis Prediction & Management",
      description: "Detect sentiment shifts and emerging issues hours before they trend. Get AI-generated response recommendations and stakeholder briefings automatically."
    },
    {
      icon: Users,
      title: "True Voice of Customer (VoC)",
      description: "Understand what customers actually mean, not just what they say. Capture sarcasm, frustration, and delight with human-level accuracy."
    },
    {
      icon: Target,
      title: "Competitor Intelligence Without Noise",
      description: "Track competitor mentions with context-aware filtering. Know when discussions are praise, criticism, or irrelevant mentions."
    }
  ];

  return (
    <section id="use-cases" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-4 block">
          Use Cases
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-black tracking-tight">
          The Only Platform for the<br />
          <span className="font-serif italic font-normal text-gray-700">Post-Keyword Era.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {useCases.map((useCase, i) => (
            <div key={i} className="border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow relative flex flex-col h-full bg-white group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <useCase.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black pr-4">{useCase.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-12 flex-1">{useCase.description}</p>

              <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <ArrowRight className="w-4 h-4 -rotate-45" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProofSection() {
  return (
    <section id="testimonials" className="py-24 bg-purple-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-4 block">
            Social Proof
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
            Why Marketing Leaders<br />Are Switching.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-200 relative">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
              <Quote className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <p className="text-lg text-gray-800 font-medium leading-relaxed mb-8">
              &ldquo;We caught a product issue 6 hours before it became a Twitter storm. EliminateContext paid for itself in the first week.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=47" alt="User" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Sarah Chen</h4>
                <p className="text-sm text-gray-500">VP of Marketing, TechCorp</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-200 relative">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
              <Quote className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <p className="text-lg text-gray-800 font-medium leading-relaxed mb-8">
              &ldquo;Finally, a tool that understands when customers are being sarcastic. Our sentiment accuracy went from 62% to 94%.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=11" alt="User" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Marcus Rodriguez</h4>
                <p className="text-sm text-gray-500">Director of Communications, Global Retail</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-100/50 via-pink-50/20 to-white/0" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-black tracking-tight leading-tight">
          Stop Listening to Noise.<br />
          Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#2e1065] pr-2">Hearing the Truth</span>.
        </h2>

        <div className="mt-10 mb-8 flex justify-center">
          <SignedOut>
            <Link href="/sign-up">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 font-medium text-lg shadow-xl group transition-all">
                Start The Analysis <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 font-medium text-lg shadow-xl group transition-all">
                Start The Analysis <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </SignedIn>
        </div>

        <p className="text-gray-600 font-medium text-sm mb-12">
          No credit card required. Includes free &ldquo;Missed Crisis&rdquo; report.
        </p>

        <div className="flex flex-wrap justify-center gap-8 text-gray-600 text-xs tracking-wide">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span className="font-semibold uppercase text-gray-500">14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span className="font-semibold uppercase text-gray-500">No setup required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span className="font-semibold uppercase text-gray-500">Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-100 pt-8">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-black tracking-tight">EliminateContext</span>
          </div>
          <div className="flex gap-8 text-gray-500 text-sm font-medium">
            <a href="#" className="hover:text-black transition-colors">Features</a>
            <a href="#" className="hover:text-black transition-colors">Solution</a>
            <a href="#" className="hover:text-black transition-colors">Use Cases</a>
            <a href="#" className="hover:text-black transition-colors">Testimonials</a>
            <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
          </div>
          <p className="text-gray-400 text-sm font-medium">© 2025 EliminateContext. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-purple-200">
      <Navbar />
      <HeroSection />
      <MeaningOverKeywordsSection />
      <ProblemSection />
      <SolutionSection />
      <ComparisonTableSection />
      <UseCasesSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </main>
  );
}