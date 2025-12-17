import React from 'react';
import { Sparkles, ArrowRight, Loader2, Link as LinkIcon, Search } from 'lucide-react';

const Hero = ({ onAnalyze, isLoading }) => {
    const [url, setUrl] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onAnalyze(url);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center relative p-6 text-center bg-brand-light">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-teal-50 via-transparent to-transparent opacity-50"></div>

            <div className="relative max-w-3xl w-full z-10 space-y-8 animate-fade-in -mt-20">
                <div className="space-y-6">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span className="tracking-wide uppercase text-xs">AI Context Analysis</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-secondary leading-tight">
                        Analyze any discussion. <br />
                        <span className="text-brand-primary">Uncover the truth.</span>
                    </h1>

                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Paste a YouTube, Twitter, or Instagram link below. Our AI will read between the lines to detect sarcasm, sentiment, and context.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto w-full group mt-8">
                    <div className="absolute -inset-1 bg-brand-primary/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative flex flex-col bg-white rounded-2xl p-2 shadow-xl border border-slate-100 focus-within:ring-2 focus-within:ring-brand-primary/50 focus-within:border-brand-primary transition-all">
                        <div className="flex items-start p-2">
                            <LinkIcon className="w-5 h-5 text-slate-400 mr-3 mt-3" />
                            <textarea
                                placeholder="Paste your links here (one per line)..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-lg py-2 min-h-[60px] resize-y"
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-between items-center px-4 pb-2 border-t border-slate-50 pt-2 mt-1">
                            <span className="text-xs font-semibold text-brand-primary/80 bg-brand-primary/5 px-2 py-1 rounded-md">
                                ✨ Batch Mode: Paste multiple URLs
                            </span>
                            <button
                                type="submit"
                                disabled={isLoading || !url}
                                className="bg-brand-primary hover:bg-teal-600 text-white rounded-xl px-6 py-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-bold shadow-md text-sm"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Analyze <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-8 flex justify-center gap-6 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Search className="w-3 h-3" /> YouTube</span>
                    <span className="flex items-center gap-1"><Search className="w-3 h-3" /> Twitter/X</span>
                    <span className="flex items-center gap-1"><Search className="w-3 h-3" /> Instagram</span>
                </div>
            </div>
        </div>
    );
};

export default Hero;
