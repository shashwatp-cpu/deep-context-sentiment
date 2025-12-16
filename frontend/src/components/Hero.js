import React from 'react';
import { Sparkles, ArrowRight, Loader2, Link } from 'lucide-react';

const Hero = ({ onAnalyze, isLoading }) => {
    const [url, setUrl] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onAnalyze(url);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6 text-center bg-brand-primary">
            {/* Background Effects */}
            <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-accent/20 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/20 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="relative max-w-3xl w-full z-10 space-y-10 animate-fade-in">
                <div className="space-y-6">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-brand-accent shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-semibold tracking-wide uppercase text-xs">AI Context Analysis</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
                        DeepContext
                        <span className="text-brand-accent">.</span>
                    </h1>

                    <p className="text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
                        Ready to uncover the truth? Paste a link to start analyzing sentiment with context awareness.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto w-full group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-accent to-brand-orange rounded-full opacity-50 group-hover:opacity-100 transition duration-500 blur"></div>
                    <div className="relative flex items-center bg-white rounded-full p-2 pl-6 shadow-2xl">
                        <Link className="w-5 h-5 text-slate-400 mr-3" />
                        <input
                            type="url"
                            placeholder="Paste YouTube, Twitter, or Social Link..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-lg"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !url}
                            className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full px-6 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-bold"
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
                </form>
            </div>
        </div>
    );
};

export default Hero;
