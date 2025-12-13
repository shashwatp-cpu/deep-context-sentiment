import React from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

const Hero = ({ onAnalyze, isLoading }) => {
    const [url, setUrl] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onAnalyze(url);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6 text-center">
            {/* Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="relative max-w-2xl w-full z-10 space-y-8 animate-fade-in">
                <div className="space-y-4">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm text-sm text-slate-300">
                        <Sparkles className="w-4 h-4 text-fuchsia-400" />
                        <span>AI-Powered Context Analysis</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        Deep Context
                        <br />
                        Sentiment
                    </h1>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto">
                        Unlock the true meaning behind social engagement. Analyze sentiment with deep contextual understanding across platforms.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto w-full group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-full opacity-75 group-hover:opacity-100 transition blur duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-center bg-slate-900 rounded-full ring-1 ring-slate-700/50 p-2 pl-6">
                        <input
                            type="url"
                            placeholder="Paste YouTube, Twitter, or Post URL..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !url}
                            className="bg-slate-800 hover:bg-slate-700 text-white rounded-full p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-fuchsia-400" />
                            ) : (
                                <ArrowRight className="w-5 h-5 text-fuchsia-400" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Hero;
