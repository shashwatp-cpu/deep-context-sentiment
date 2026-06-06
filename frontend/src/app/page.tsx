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

const shimmer = {
  initial: { x: "-100%" },
  animate: {
    x: "200%",
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: "linear",
    }
  }
};

const float = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-black/[0.03] shadow-sm shadow-purple-900/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="EliminateContext" className="w-8 h-8 rounded-lg" />
          <span className="text-2xl font-black tracking-tighter text-black">
            EliminateContext
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-800 hover:text-purple-600 transition-colors font-medium">Problem</a>
          <a href="#solution" className="text-sm text-gray-800 hover:text-purple-600 transition-colors font-medium">Solution</a>
          <a href="#use-cases" className="text-sm text-gray-800 hover:text-purple-600 transition-colors font-medium">Use Cases</a>
          <a href="#testimonials" className="text-sm text-gray-800 hover:text-purple-600 transition-colors font-medium">Testimonials</a>
          <Link href="/contact" className="text-sm text-gray-800 hover:text-purple-600 transition-colors font-medium">Contact</Link>
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
    <section className="relative pt-32 pb-20 overflow-hidden bg-transparent min-h-[90vh]">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-[#faf7f5]">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-purple-200/50 to-pink-200/50 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [45, 0, 45],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-indigo-200/40 to-purple-200/40 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Floating Particles */}
        <div className="absolute inset-x-0 top-0 h-full pointer-events-none flex justify-center">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.5, 0],
                y: [-20, -100],
                x: i % 2 === 0 ? [0, 20] : [0, -20]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut"
              }}
              className="absolute w-2 h-2 rounded-full bg-purple-400/20"
              style={{
                left: `${15 + i * 15}%`,
                top: `${40 + (i % 3) * 20}%`
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md text-[#4e3a62] text-sm font-medium border border-purple-300/30 hover:bg-white/60 hover:border-purple-300 transition-all cursor-default shadow-sm shadow-purple-200/10">
            <Sparkles className="w-4 h-4 text-[#8a5df5] animate-pulse" /> Now in Private Beta
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-black">
          The First <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:200%_auto] animate-gradient">Context-Aware</span>
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
          <span className="text-gray-500 font-normal">The premium alternative to Brandwatch and Talkwalker.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col items-center gap-4 mb-20">
          <SignedOut>
            <Link href="/sign-up">
              <Button size="lg" className="relative bg-black text-white hover:bg-gray-800 rounded-full px-10 py-7 font-semibold text-lg shadow-2xl shadow-purple-500/20 group transition-all overflow-hidden border border-white/10">
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                />
                <span className="relative flex items-center gap-2">
                  Start The Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="relative bg-black text-white hover:bg-gray-800 rounded-full px-10 py-7 font-semibold text-lg shadow-2xl shadow-purple-500/20 group transition-all overflow-hidden border border-white/10">
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                />
                <span className="relative flex items-center gap-2">
                  Start The Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
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
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] hover:scale-110 transition-transform cursor-pointer"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] hover:scale-110 transition-transform cursor-pointer"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840] hover:scale-110 transition-transform cursor-pointer"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-48 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
              <div className="w-48 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
              <div className="w-10 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
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
    <section className="py-24 bg-transparent relative border-y border-gray-100/50">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}>
          <motion.h2 variants={fadeInUp as any} className="text-3xl md:text-5xl font-bold text-black mb-4 tracking-tight">
            Meaning Over <span className="text-gray-400 italic font-serif relative inline-block">Keywords<div className="absolute inset-x-0 top-1/2 h-[2px] bg-gray-400 rotate-[-2deg]"></div></span>
          </motion.h2>
          <motion.p variants={fadeInUp as any} className="text-gray-600 max-w-2xl mx-auto text-lg">
            Legacy tools only see the surface. We see the strategy, intent, and emotion behind every mention.
          </motion.p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}
          className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={fadeInUp as any}
              className={`relative bg-white/40 backdrop-blur-xl border border-white/60 text-center rounded-2xl p-6 shadow-xl shadow-purple-900/5 group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col items-center ${card.bgClass} overflow-hidden`}>
              <motion.div
                variants={shimmer}
                initial="initial"
                whileHover="animate"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2 mt-2">Traditional Sentiment</span>
              <div className={`text-xl font-bold mb-6 line-through decoration-2 opacity-80 ${card.sentimentColor}`}>{card.sentiment}</div>

              <div className="w-full h-px bg-gray-200/50 my-4"></div>

              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-3 mt-2">Deep Context Insight</span>
              <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                {card.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
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
    <section id="features" className="py-24 relative bg-purple-50/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center md:text-left">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger as any}>
            <motion.span variants={fadeInUp as any} className="text-indigo-600 text-sm font-extrabold tracking-widest uppercase mb-4 block">
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
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {problems.map((problem, i) => (
            <motion.div key={i} variants={fadeInUp as any} className="flex flex-col p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white hover:border-purple-200 shadow-xl shadow-purple-900/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group cursor-default relative overflow-hidden">
              <motion.div
                variants={shimmer}
                initial="initial"
                whileHover="animate"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
              />
              <div className="w-12 h-12 rounded-xl border border-purple-100 bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300">
                <problem.icon className="w-5 h-5 text-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-black tracking-tight group-hover:text-indigo-700 transition-colors duration-300">{problem.title}</h3>
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
    <section id="solution" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Animated Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/30 via-purple-500/10 to-transparent blur-[80px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger as any}
            className="w-full md:w-3/5 space-y-0 relative z-10">

            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeInUp as any} className={`flex items-start gap-8 md:gap-12 py-8 group cursor-pointer overflow-hidden ${i !== steps.length - 1 ? 'border-b border-white/10' : ''}`}>
                <span className="text-5xl md:text-6xl font-light text-white font-serif transition-all duration-300 group-hover:text-indigo-400 group-hover:scale-110">{step.num}</span>
                <div className="pt-2 transform transition-all duration-300 group-hover:translate-x-4">
                  <h3 className="text-lg md:text-xl font-bold mb-1 text-white transition-colors duration-300 group-hover:text-indigo-300">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed transition-colors duration-300 group-hover:text-white/80">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full md:w-2/5 md:text-right pt-8 relative z-10">
            <span className="text-indigo-400 text-sm font-extrabold tracking-widest uppercase mb-4 block">
              The Solution
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Enter the<br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Deep Context</span><br className="hidden md:block" /> Engine.
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
    <section className="py-32 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col xl:flex-row gap-16 items-start">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="xl:w-1/4 pt-8">
          <h2 className="text-3xl md:text-5xl font-bold text-black tracking-tight leading-tight">
            Legacy Tools<br />vs<br /><span className="text-indigo-600">EliminateContext</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="xl:w-3/4 w-full">
          <div className="rounded-3xl border border-gray-200/50 bg-[#1a1a1a] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
            {/* Left Block: Features & Legacy */}
            <div className="w-full md:w-2/3 text-white">
              <div className="grid grid-cols-2 border-b border-white/5">
                <div className="p-6 font-semibold text-white/40 text-sm">Features</div>
                <div className="p-6 font-semibold text-white/40 text-sm">Legacy Tools</div>
              </div>

              {rows.map((row, i) => (
                <div key={i} className={`grid grid-cols-2 group hover:bg-white/5 transition-colors cursor-default ${i !== rows.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="p-6 text-sm font-medium transition-colors group-hover:text-indigo-300">{row.feature}</div>
                  <div className="p-6 text-sm text-white/40 transition-colors group-hover:text-white/60">{row.legacy}</div>
                </div>
              ))}
            </div>

            {/* Right Block: EliminateContext */}
            <div className="w-full md:w-1/3 bg-white text-black md:rounded-r-3xl border-l border-gray-100 flex flex-col relative overflow-hidden group/ec">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 pointer-events-none" />
              <div className="relative border-b border-gray-100">
                <div className="p-6 font-extrabold text-black text-sm flex items-center justify-between">
                  EliminateContext
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                </div>
              </div>

              {rows.map((row, i) => (
                <div key={i} className={`relative flex-1 flex items-center group/item hover:bg-indigo-600 transition-all duration-300 cursor-default ${i !== rows.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="p-6 text-sm font-bold text-gray-900 group-hover/item:text-white transition-colors">{row.eliminate}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
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
    <section id="use-cases" className="py-32 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}>
          <motion.span variants={fadeInUp as any} className="text-indigo-600 text-sm font-extrabold tracking-widest uppercase mb-4 block">
            Use Cases
          </motion.span>
          <motion.h2 variants={fadeInUp as any} className="text-4xl md:text-5xl font-bold mb-16 text-black tracking-tight">
            The Only Platform for the<br />
            <span className="font-serif italic font-normal text-gray-700">Post-Keyword Era.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}
          className="grid md:grid-cols-3 gap-6 text-left">
          {useCases.map((useCase, i) => (
            <motion.div
              key={i}
              variants={fadeInUp as any}
              className="bg-white/40 backdrop-blur-xl border border-white hover:border-indigo-200 rounded-3xl p-8 hover:shadow-2xl transition-all relative flex flex-col h-full group cursor-pointer hover:-translate-y-2 duration-300 overflow-hidden shadow-xl shadow-purple-900/5">
              <motion.div
                variants={shimmer}
                initial="initial"
                whileHover="animate"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
              />
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 shadow-inner flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <useCase.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black pr-4 group-hover:text-indigo-700 transition-colors">{useCase.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-12 flex-1">{useCase.description}</p>

              <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-indigo-600 group-hover:scale-110 transition-all shadow-lg">
                <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SocialProofSection() {
  return (
    <section id="testimonials" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}
          className="text-center mb-16">
          <motion.span variants={fadeInUp as any} className="text-indigo-600 text-sm font-extrabold tracking-widest uppercase mb-4 block">
            Social Proof
          </motion.span>
          <motion.h2 variants={fadeInUp as any} className="text-4xl md:text-5xl font-bold text-black tracking-tight">
            Why Marketing Leaders<br />Are Switching.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}
          className="grid md:grid-cols-2 gap-8">
          <motion.div variants={fadeInUp as any} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-xl shadow-purple-900/5 border border-white relative hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
            <motion.div
              variants={shimmer}
              initial="initial"
              whileHover="animate"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            />
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 text-white">
              <Quote className="w-4 h-4 fill-white" />
            </div>
            <p className="text-xl text-gray-800 font-medium leading-[1.6] mb-8 relative">
              &ldquo;We caught a product issue 6 hours before it became a Twitter storm. EliminateContext paid for itself in the first week.&rdquo;
            </p>
            <div className="flex items-center gap-4 relative">
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden ring-4 ring-white shadow-sm transition-transform group-hover:scale-110">
                <img src="https://i.pravatar.cc/150?img=47" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900">Sarah Chen</h4>
                <p className="text-sm text-gray-500 font-medium tracking-tight">VP of Marketing, TechCorp</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp as any} className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-xl shadow-purple-900/5 border border-white relative hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
            <motion.div
              variants={shimmer}
              initial="initial"
              whileHover="animate"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            />
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 text-white">
              <Quote className="w-4 h-4 fill-white" />
            </div>
            <p className="text-xl text-gray-800 font-medium leading-[1.6] mb-8 relative">
              &ldquo;Finally, a tool that understands when customers are being sarcastic. Our sentiment accuracy went from 62% to 94%.&rdquo;
            </p>
            <div className="flex items-center gap-4 relative">
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden ring-4 ring-white shadow-sm transition-transform group-hover:scale-110">
                <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900">Marcus Rodriguez</h4>
                <p className="text-sm text-gray-500 font-medium tracking-tight">Director of Communications, Global Retail</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/40 via-purple-50/20 to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-black tracking-tight leading-[1.1]">
            Stop Listening to Noise.<br />
            Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:200%_auto] animate-gradient pr-2">Hearing the Truth</span>.
          </h2>

          <div className="mt-10 mb-8 flex justify-center">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" className="relative bg-black text-white hover:bg-gray-800 rounded-full px-10 py-7 font-bold text-xl shadow-2xl shadow-indigo-500/20 group transition-all overflow-hidden">
                  <motion.div
                    variants={shimmer}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                  />
                  <span className="relative flex items-center gap-2">
                    Start The Analysis <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="relative bg-black text-white hover:bg-gray-800 rounded-full px-10 py-7 font-bold text-xl shadow-2xl shadow-indigo-500/20 group transition-all overflow-hidden">
                  <motion.div
                    variants={shimmer}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                  />
                  <span className="relative flex items-center gap-2">
                    Start The Analysis <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </SignedIn>
          </div>

          <p className="text-gray-600 font-bold text-sm mb-12 tracking-tight">
            No credit card required. Includes free <span className="text-indigo-600">&ldquo;Missed Crisis&rdquo;</span> report.
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-gray-600 text-[10px] tracking-[0.2em]">
            <div className="flex items-center gap-2 group cursor-default">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 group-hover:scale-125 transition-transform" />
              <span className="font-extrabold uppercase text-gray-400 group-hover:text-indigo-600 transition-colors">14-day free trial</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 group-hover:scale-125 transition-transform" />
              <span className="font-extrabold uppercase text-gray-400 group-hover:text-indigo-600 transition-colors">No setup required</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 group-hover:scale-125 transition-transform" />
              <span className="font-extrabold uppercase text-gray-400 group-hover:text-indigo-600 transition-colors">Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-100/50 pt-12 mt-12">
          <div className="flex items-center gap-2 group cursor-pointer">
            <img src="/logo.png" alt="EliminateContext" className="w-7 h-7 rounded-md transition-all group-hover:scale-110 group-hover:rotate-12" />
            <span className="text-lg font-bold text-black tracking-tight group-hover:text-indigo-600 transition-colors">EliminateContext</span>
          </div>
          <div className="flex gap-8 text-gray-500 text-sm font-semibold tracking-tight">
            <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Solution</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Use Cases</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Testimonials</a>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors cursor-default">© 2025 EliminateContext. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-purple-200 relative">
      {/* Global Background Visuals */}
      <div className="fixed inset-0 -z-50 pointer-events-none opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #00000008 1.5px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

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

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </main>
  );
}