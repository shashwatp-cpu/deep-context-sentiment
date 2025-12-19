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
  ChevronRight
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
      className="fixed top-0 left-0 right-0 z-50 glass">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-[#c8ff00] flex items-center justify-center border border-black/10 shadow-sm">
            <Brain className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black">EliminateContext</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#problem" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">Problem</a>
          <a href="#solution" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">Solution</a>
          <a href="#use-cases" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">Use Cases</a>
          <a href="#features" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">Features</a>
        </div>

        {/* Auth Aware Button */}
        <div>
          <SignedOut>
            <Link href="/sign-up">
              <Button className="bg-[#c8ff00] text-black hover:bg-[#b3e600] font-bold border border-black/10 shadow-lg">
                Get Early Access
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-[#c8ff00] text-black hover:bg-[#b3e600] font-bold border border-black/10 shadow-lg">
                  Go to Dashboard
                </Button>
              </Link>
              <div className="flex items-center justify-center bg-gray-100/50 rounded-full p-1 border border-black/5">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </motion.nav>);
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 bg-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/hero-1766128827326.png?width=8000&height=8000&resize=contain')`,
          }}
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
      </div>

      <div className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c8ff00]/10 via-transparent to-transparent opacity-60" />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6">

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm shadow-sm border border-black/10 bg-white/50">
            <Sparkles className="w-4 h-4 text-lime-600" />
            <span className="text-gray-700 font-medium">Now in Private Beta</span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8 text-black">

          The First{" "}
          <span className="text-gradient">Context-Aware</span>
          <br />
          <span className="font-serif italic font-normal text-gray-800">Social Listening</span>
          <br />
          Platform.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">

          Stop Counting Keywords. Start Understanding Intent.
          <br />
          <span className="text-black font-semibold !whitespace-pre-line">The Alternative to Brandwatch and Talkwalker.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col items-center gap-6">

          <SignedOut>
            <Link href="/sign-up">
              <Button size="lg" className="bg-[#c8ff00] text-black hover:bg-[#b3e600] font-bold text-xl px-10 py-8 rounded-2xl shadow-[0_20px_50px_rgba(200,255,0,0.3)] border-2 border-black/10 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Get Deep Context – Free Early Access
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="bg-[#c8ff00] text-black hover:bg-[#b3e600] font-bold text-xl px-10 py-8 rounded-2xl shadow-[0_20px_50px_rgba(200,255,0,0.3)] border-2 border-black/10 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Start Analysis Now
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </Link>
          </SignedIn>
          <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime-600" />
            Replace your legacy listening tool today.
          </span>
        </motion.div>
      </motion.div>
    </section>);

}

function CarouselSection() {
  const cards = [
    {
      traditional: "Positive",
      contextual: "High-intent lead discussing budget and specific features.",
      icon: TrendingUp,
      color: "from-blue-50 to-white",
      borderColor: "border-blue-100",
      iconColor: "text-blue-600"
    },
    {
      traditional: "Negative",
      contextual: "Constructive feedback from power user about API latency.",
      icon: MessageSquare,
      color: "from-red-50 to-white",
      borderColor: "border-red-100",
      iconColor: "text-red-600"
    },
    {
      traditional: "Neutral",
      contextual: "Strategic mention by competitor CEO in industry interview.",
      icon: Target,
      color: "from-purple-50 to-white",
      borderColor: "border-purple-100",
      iconColor: "text-purple-600"
    },
    {
      traditional: "Positive",
      contextual: "Viral praise for the new UI redesign on Reddit threads.",
      icon: Sparkles,
      color: "from-green-50 to-white",
      borderColor: "border-green-100",
      iconColor: "text-green-600"
    },
    {
      traditional: "Negative",
      contextual: "Sarcastic remark about legacy competitor pricing models.",
      icon: Zap,
      color: "from-yellow-50 to-white",
      borderColor: "border-yellow-100",
      iconColor: "text-yellow-600"
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden border-y border-black/5">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
          Meaning Over <span className="text-gray-400 line-through">Keywords</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Legacy tools only see the surface. We see the strategy, intent, and emotion behind every mention.
        </p>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-6 px-6"
          animate={{
            x: ["0%", "-50%"]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...cards, ...cards].map((card, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[420px] p-10 rounded-[2.5rem] border ${card.borderColor} bg-gradient-to-br ${card.color} shadow-sm group hover:shadow-xl transition-all duration-500`}
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-2">Traditional Sentiment</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-300 line-through decoration-black/20">{card.traditional}</span>
                    <XCircle className="w-5 h-5 text-red-400 opacity-50" />
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${card.iconColor}`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-bold text-black/40 italic">
                  "Leave the traditional sentiments and use this"
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-600 block mb-3">Deep Context Insight</span>
                <p className="text-2xl font-bold text-black leading-tight group-hover:text-lime-700 transition-colors">
                  {card.contextual}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent z-10" />
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: "False Positives Everywhere",
      description: "Your dashboard shows 10,000 mentions but 40% are irrelevant noise. You're drowning in data, starving for insight."
    },
    {
      icon: XCircle,
      title: "Boolean Logic Failures",
      description: "Complex query strings that break with every new slang term. Hours spent tweaking rules that never quite work."
    },
    {
      icon: MessageSquare,
      title: "Sarcasm Blindness",
      description: '"Great job breaking my order again" reads as positive. Your AI thinks angry customers are happy ones.'
    },
    {
      icon: TrendingUp,
      title: "Crisis Detected Too Late",
      description: "By the time your tool flags a crisis, it's already trending. Reactive instead of predictive."
    }];


  return (
    <section id="problem" className="py-32 relative bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c8ff00]/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}
          className="text-center mb-20">

          <motion.span variants={fadeInUp as any} className="text-lime-600 text-sm font-bold tracking-widest uppercase mb-4 block">
            The Problem
          </motion.span>
          <motion.h2 variants={fadeInUp as any} className="text-4xl md:text-6xl font-bold mb-6 text-black">
            Your Analytics Dashboard
            <br />
            <span className="font-serif italic font-normal text-gray-500">is Lying to You.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger as any}
          className="grid md:grid-cols-2 gap-6">

          {problems.map((problem, i) =>
            <motion.div
              key={i}
              variants={fadeInUp as any}
              className="group relative p-8 rounded-2xl glass hover:border-[#c8ff00]/50 transition-all duration-500 shadow-sm border border-black/5">

              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors">
                  <problem.icon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">{problem.title}</h3>
                <p className="text-gray-600 leading-relaxed">{problem.description}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-10 rounded-2xl border border-red-200 bg-red-50/50 text-center shadow-inner">

          <p className="text-xl text-gray-800 font-serif italic">
            &ldquo;We spent $50K/year on social listening tools and still missed the product recall crisis that cost us $2M in brand damage.&rdquo;
          </p>
          <p className="text-gray-600 mt-4 font-medium">— Former VP of Communications, Fortune 500 CPG Company</p>
        </motion.div>
      </div>
    </section>);

}

function SolutionSection() {
  const features = [
    { title: "LLM-Powered Contextual NLP", description: "Understanding meaning, not just matching words" },
    { title: "Semantic Understanding", description: "Grasps nuance, idioms, and cultural references" },
    { title: "Crisis Prediction Engine", description: "Identifies brewing issues before they explode" }];


  const comparison = [
    { feature: "Analysis Method", legacy: "Boolean keyword matching", eliminate: "Generative AI contextual analysis" },
    { feature: "Sarcasm Detection", legacy: "❌ Misclassifies as positive", eliminate: "✓ 94% accuracy rate" },
    { feature: "Crisis Detection", legacy: "Reactive (after trending)", eliminate: "Predictive (hours early)" },
    { feature: "Data Sources", legacy: "Limited API access", eliminate: "Full firehose + visual" },
    { feature: "Setup Time", legacy: "Weeks of Boolean tuning", eliminate: "Minutes, zero configuration" }];


  return (
    <section id="solution" className="py-32 relative bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}
          className="text-center mb-20">

          <motion.span variants={fadeInUp as any} className="text-lime-600 text-sm font-bold tracking-widest uppercase mb-4 block">
            The Solution
          </motion.span>
          <motion.h2 variants={fadeInUp as any} className="text-4xl md:text-6xl font-bold mb-6 text-black">
            Enter the{" "}
            <span className="text-gradient">Deep Context</span>
            <br />
            <span className="font-serif italic font-normal text-gray-800">Engine.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger as any}
          className="grid md:grid-cols-3 gap-6 mb-20">

          {features.map((feature, i) =>
            <motion.div
              key={i}
              variants={fadeInUp as any}
              className="p-8 rounded-2xl glass hover:border-[#c8ff00]/50 transition-all duration-500 text-center shadow-sm border border-black/5">

              <div className="w-16 h-16 rounded-2xl bg-[#c8ff00]/20 flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-lime-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden glass border border-black/10 shadow-xl">

          <div className="p-6 border-b border-black/5 bg-white/50">
            <h3 className="text-2xl font-bold text-black">Legacy Tools vs EliminateContext</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/5 bg-gray-50/50">
                  <th className="text-left p-6 text-gray-500 font-bold uppercase text-xs tracking-wider">Feature</th>
                  <th className="text-left p-6 text-red-600 font-bold uppercase text-xs tracking-wider">Legacy Tools</th>
                  <th className="text-left p-6 text-lime-700 font-bold uppercase text-xs tracking-wider">EliminateContext</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) =>
                  <tr key={i} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors bg-white/30">
                    <td className="p-6 font-bold text-black">{row.feature}</td>
                    <td className="p-6 text-gray-600">{row.legacy}</td>
                    <td className="p-6 text-lime-700 font-semibold">{row.eliminate}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>);

}

function UseCasesSection() {
  const useCases = [
    {
      icon: Shield,
      title: "AI Crisis Prediction & Management",
      description: "Detect sentiment shifts and emerging issues hours before they trend. Get AI-generated response recommendations and stakeholder briefings automatically.",
      color: "from-red-100 to-orange-100",
      textColor: "text-red-700"
    },
    {
      icon: Users,
      title: "True Voice of Customer (VoC)",
      description: "Understand what customers actually mean, not just what they say. Capture sarcasm, frustration, and delight with human-level accuracy.",
      color: "from-blue-100 to-cyan-100",
      textColor: "text-blue-700"
    },
    {
      icon: Target,
      title: "Competitor Intelligence Without Noise",
      description: "Track competitor mentions with context-aware filtering. Know when discussions are praise, criticism, or irrelevant mentions.",
      color: "from-purple-100 to-pink-100",
      textColor: "text-purple-700"
    }];


  return (
    <section id="use-cases" className="py-32 relative bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c8ff00]/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}
          className="text-center mb-20">

          <motion.span variants={fadeInUp as any} className="text-lime-600 text-sm font-bold tracking-widest uppercase mb-4 block">
            Use Cases
          </motion.span>
          <motion.h2 variants={fadeInUp as any} className="text-4xl md:text-6xl font-bold mb-6 text-black">
            The Only Platform for the
            <br />
            <span className="font-serif italic font-normal text-gray-500">Post-Keyword Era.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger as any}
          className="grid md:grid-cols-3 gap-8">

          {useCases.map((useCase, i) =>
            <motion.div
              key={i}
              variants={fadeInUp as any}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl glass overflow-hidden border border-black/5 shadow-md">

              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10 p-8">
                <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-white/50 transition-colors">
                  <useCase.icon className={`w-8 h-8 ${useCase.textColor}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">{useCase.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{useCase.description}</p>
                <button className="flex items-center gap-2 text-lime-700 font-bold group-hover:gap-4 transition-all">
                  Learn more <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

}

function TechSpecsSection() {
  const specs = [
    { icon: Globe, title: "Real-Time Firehose", description: "X, Reddit, LinkedIn, TikTok APIs — full access, zero lag" },
    { icon: Eye, title: "Visual Listening", description: "Analyze memes, screenshots, and image-based content" },
    { icon: Slack, title: "Native Integrations", description: "Slack, Salesforce, Zendesk — alerts where you work" },
    { icon: BarChart3, title: "Executive Reports", description: "AI-generated summaries and insights, delivered weekly" }];


  return (
    <section id="features" className="py-32 relative bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}
          className="text-center mb-20">

          <motion.span variants={fadeInUp as any} className="text-lime-600 text-sm font-bold tracking-widest uppercase mb-4 block">
            Tech Specs
          </motion.span>
          <motion.h3 variants={fadeInUp as any} className="text-3xl md:text-5xl font-bold mb-6 text-black">
            Built for the Enterprise,
            <br />
            <span className="font-serif italic font-normal text-gray-500">Designed for Humans.</span>
          </motion.h3>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger as any}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {specs.map((spec, i) =>
            <motion.div
              key={i}
              variants={fadeInUp as any}
              className="p-6 rounded-2xl glass hover:border-[#c8ff00]/50 transition-all duration-500 group border border-black/5 shadow-sm">

              <div className="w-12 h-12 rounded-xl bg-[#c8ff00]/20 flex items-center justify-center mb-4 group-hover:bg-[#c8ff00]/30 transition-colors">
                <spec.icon className="w-6 h-6 text-lime-700" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-black">{spec.title}</h4>
              <p className="text-gray-600 text-sm">{spec.description}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

}

function SocialProofSection() {
  return (
    <section className="py-32 relative bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c8ff00]/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger as any}
          className="text-center mb-20">

          <motion.span variants={fadeInUp as any} className="text-lime-600 text-sm font-bold tracking-widest uppercase mb-4 block">
            Social Proof
          </motion.span>
          <motion.h2 variants={fadeInUp as any} className="text-4xl md:text-6xl font-bold mb-6 text-black">
            Why Marketing Leaders
            <br />
            <span className="font-serif italic font-normal text-gray-500">Are Switching.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-16">

          <div className="p-8 rounded-2xl glass border border-black/5 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c8ff00] to-[#00d4ff] shadow-inner" />
              <div>
                <p className="font-bold text-black">Sarah Chen</p>
                <p className="text-gray-500 text-sm">VP of Marketing, TechCorp</p>
              </div>
            </div>
            <p className="text-xl text-gray-800 font-serif italic leading-relaxed">
              &ldquo;We caught a product issue 6 hours before it became a Twitter storm. EliminateContext paid for itself in the first week.&rdquo;
            </p>
          </div>
          <div className="p-8 rounded-2xl glass border border-black/5 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-inner" />
              <div>
                <p className="font-bold text-black">Marcus Rodriguez</p>
                <p className="text-gray-500 text-sm">Director of Communications, Global Retail</p>
              </div>
            </div>
            <p className="text-xl text-gray-800 font-serif italic leading-relaxed">
              &ldquo;Finally, a tool that understands when customers are being sarcastic. Our sentiment accuracy went from 62% to 94%.&rdquo;
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-10 rounded-2xl bg-gradient-to-r from-[#c8ff00]/20 to-[#00d4ff]/20 border border-[#c8ff00]/30 shadow-xl">

          <h3 className="text-2xl font-bold mb-8 text-center text-black">The Brandwatch Alternative</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-extrabold text-lime-700 mb-2">60%</div>
              <p className="text-gray-700 font-medium">Lower Cost</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-lime-700 mb-2">3x</div>
              <p className="text-gray-700 font-medium">Better Data Accuracy</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-lime-700 mb-2">10x</div>
              <p className="text-gray-700 font-medium">Faster Insights</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}

function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden bg-[#fafafa]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c8ff00]/30 via-transparent to-transparent" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger as any}>

          <motion.h2 variants={fadeInUp as any} className="text-4xl md:text-6xl font-bold mb-6 text-black">
            Stop Listening to Noise.
            <br />
            <span className="text-gradient">Start Hearing the Truth.</span>
          </motion.h2>
          <motion.div variants={fadeInUp as any} className="flex flex-col items-center gap-6">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" className="bg-[#c8ff00] text-black hover:bg-[#b3e600] font-bold text-xl px-12 py-8 glow border border-black/10 shadow-2xl">
                  Start Your Free Context Audit
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="bg-[#c8ff00] text-black hover:bg-[#b3e600] font-bold text-xl px-12 py-8 glow border border-black/10 shadow-2xl">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </SignedIn>
            <p className="text-gray-600 font-medium">
              No credit card required. Includes free &ldquo;Missed Crisis&rdquo; report.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp as any} className="mt-16 flex flex-wrap justify-center gap-8 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-lime-600" />
              <span className="font-medium">14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-lime-600" />
              <span className="font-medium">No setup required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-lime-600" />
              <span className="font-medium">Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer className="py-16 border-t border-black/5 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#c8ff00] flex items-center justify-center border border-black/10">
              <Brain className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-black">EliminateContext</span>
          </div>
          <div className="flex gap-8 text-gray-600 text-sm font-medium">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>
          <p className="text-gray-500 text-sm">© 2025 EliminateContext. All rights reserved.</p>
        </div>
      </div>
    </footer>);

}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <CarouselSection />
      <ProblemSection />
      <SolutionSection />
      <UseCasesSection />
      <TechSpecsSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </main>);

}