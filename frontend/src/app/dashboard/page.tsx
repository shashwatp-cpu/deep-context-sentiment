"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Brain, Search, Loader2, ArrowLeft, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

// Mapping backend keys to display labels and colors
const SENTIMENT_CONFIG: Record<string, { label: string; color: string }> = {
    supportive_empathetic: { label: "Supportive", color: "#84cc16" }, // lime-500
    appreciative_praising: { label: "Appreciative", color: "#22c55e" }, // green-500
    informative_neutral: { label: "Neutral", color: "#94a3b8" }, // slate-400
    sarcastic_ironic: { label: "Sarcastic", color: "#a855f7" }, // purple-500
    critical_disapproving: { label: "Critical", color: "#f59e0b" }, // amber-500
    angry_hostile: { label: "Hostile", color: "#ef4444" }, // red-500
};

type ViewState = "input" | "list" | "detail";

export default function Dashboard() {
    const { getToken, isLoaded, isSignedIn } = useAuth();

    // State
    const [inputUrl, setInputUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [view, setView] = useState<ViewState>("input");

    // Data
    const [batchResults, setBatchResults] = useState<any[]>([]);
    const [currentResult, setCurrentResult] = useState<any>(null);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputUrl.trim()) return;

        setLoading(true);
        setError("");
        setBatchResults([]);
        setCurrentResult(null);

        // Split URLs by newline or comma and filter empty
        const urls = inputUrl.split(/[\n,]+/).map(u => u.trim()).filter(u => u.length > 0);

        try {
            const token = await getToken();
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            if (urls.length === 1) {
                // Single Analysis
                const res = await fetch("http://localhost:8000/api/v1/analyze", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ url: urls[0], platform: "auto" })
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.detail || "Analysis failed");
                }

                const data = await res.json();
                setCurrentResult(data);
                setView("detail");
            } else {
                // Batch Analysis
                const res = await fetch("http://localhost:8000/api/v1/analyze/batch", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ urls })
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.detail || "Batch analysis failed");
                }

                const data = await res.json();
                // data.results contains the list of analysis responses
                setBatchResults(data.results || []);
                setView("list");
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectResult = (result: any) => {
        setCurrentResult(result);
        setView("detail");
    };

    const handleBackToResults = () => {
        if (batchResults.length > 0) {
            setView("list");
        } else {
            setView("input");
            setInputUrl("");
        }
        setCurrentResult(null);
    };

    const handleReset = () => {
        setView("input");
        setInputUrl("");
        setBatchResults([]);
        setCurrentResult(null);
    }

    // Helper to get chart data for a result
    const getChartData = (res: any) => {
        return res?.summary ? Object.keys(SENTIMENT_CONFIG).map(key => ({
            name: SENTIMENT_CONFIG[key].label,
            value: res.summary[key] || 0,
            color: SENTIMENT_CONFIG[key].color
        })).filter(item => item.value > 0) : [];
    };

    if (!isLoaded || !isSignedIn) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Navbar */}
            <nav className="border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-xl bg-[#c8ff00] flex items-center justify-center border border-black/10 shadow-sm">
                            <Brain className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-black">EliminateContext</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-500 hidden md:block">Dashboard</span>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">

                {/* VIEW: INPUT */}
                {view === "input" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold mb-4">Analyze Sentiment Context</h1>
                            <p className="text-gray-600 text-lg">
                                Enter one or more URLs (one per line) from YouTube, Reddit, or Twitter/X.
                            </p>
                        </div>

                        <div className="mb-16 relative z-10">
                            <form onSubmit={handleAnalyze} className="relative shadow-2xl rounded-3xl bg-white overflow-hidden border border-black/5">
                                <textarea
                                    placeholder="https://www.youtube.com/watch?v=...&#10;https://www.reddit.com/r/..."
                                    className="w-full h-48 card-textarea p-8 text-lg resize-none outline-none text-gray-700 placeholder:text-gray-300"
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                />
                                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                                    <div className="text-sm text-gray-400 font-medium">
                                        {inputUrl.split(/[\n,]+/).filter(u => u.trim().length > 0).length} URL(s) detected
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loading || !inputUrl.trim()}
                                        className="bg-[#c8ff00] text-black hover:bg-[#b3e600] font-bold rounded-xl px-8 py-6 text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Processing...</span>
                                        ) : (
                                            <span className="flex items-center gap-2">Analyze Context <Search className="w-5 h-5" /></span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
                                    {error}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* VIEW: LIST (Batch Results) */}
                {view === "list" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Analysis Results ({batchResults.length})</h2>
                            <Button variant="outline" onClick={handleReset}>New Analysis</Button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {batchResults.map((res, idx) => {
                                const dominant = res.summary?.dominant_sentiment || "Neutral";
                                const isSuccess = res.status === "completed";
                                if (!isSuccess) return null; // or show error card

                                return (
                                    <Card
                                        key={idx}
                                        className="glass hover:shadow-xl transition-all cursor-pointer group border-black/5"
                                        onClick={() => handleSelectResult(res)}
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold uppercase text-gray-500">{res.platform}</span>
                                                <span className="text-xs text-gray-400">{res.processingTime?.toFixed(2)}s</span>
                                            </div>
                                            <CardTitle className="text-lg line-clamp-1 group-hover:text-[#84a300] transition-colors">
                                                {res.postContext?.title || res.postUrl}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-500">
                                                    <span className="block font-bold text-2xl text-black">{res.summary?.totalComments}</span>
                                                    Comments
                                                </div>
                                                {/* Mini Pie Chart Preview */}
                                                <div className="w-16 h-16">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie data={getChartData(res)} cx="50%" cy="50%" innerRadius={0} outerRadius={30} dataKey="value">
                                                                {getChartData(res).map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                                                ))}
                                                            </Pie>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-gray-50/50 border-t border-gray-100 py-3">
                                            <div className="flex items-center gap-2 text-sm font-medium w-full justify-between">
                                                <span>View Insights</span>
                                                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </CardFooter>
                                    </Card>
                                )
                            })}
                        </div>
                    </motion.div>
                )}

                {/* VIEW: DETAIL (Single Result) */}
                {view === "detail" && currentResult && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8">
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-[#84a300]" onClick={handleBackToResults}>
                                <ArrowLeft className="w-4 h-4" />
                                {batchResults.length > 0 ? "Back to Results" : "Analyze Another"}
                            </Button>
                        </div>

                        {/* Summary Row */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Chart Section */}
                            <Card className="glass border-black/5 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Sentiment Distribution</CardTitle>
                                    <CardDescription>Breakdown of emotions detected in comments</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={getChartData(currentResult)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {getChartData(currentResult).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Meta Stats & Context */}
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="glass border-black/5 bg-lime-50/50">
                                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-lime-700 uppercase tracking-wider">Total Comments</CardTitle></CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold">{currentResult.summary?.totalComments}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="glass border-black/5 bg-blue-50/50">
                                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-700 uppercase tracking-wider">Processing Time</CardTitle></CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold">{currentResult.processingTime?.toFixed(2)}s</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="glass border-black/5 flex-grow">
                                    <CardHeader><CardTitle>Context Analysis</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-500 mb-1">Platform</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold uppercase">{currentResult.platform}</span>
                                                </div>
                                            </div>
                                            {currentResult.postContext?.title && (
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-500 mb-1">Title</h4>
                                                    <p className="font-medium line-clamp-2">{currentResult.postContext.title}</p>
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-500 mb-1">Context Summary</h4>
                                                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">{currentResult.postContext?.description || currentResult.postContext?.text || "No specific context available."}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Detailed Breakdowns */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Key Insights by Category</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(currentResult.topComments || {}).map(([category, comments]: [string, any]) => {
                                    const configKey = Object.keys(SENTIMENT_CONFIG).find(k => SENTIMENT_CONFIG[k].label === category.split('/')[0])
                                        || Object.keys(SENTIMENT_CONFIG).find(k => category.toLowerCase().includes(k.split('_')[0]))
                                        || "informative_neutral";

                                    const style = SENTIMENT_CONFIG[configKey] || SENTIMENT_CONFIG.informative_neutral;

                                    return (
                                        <Card key={category} className="glass border-black/5 shadow-sm hover:shadow-md transition-shadow">
                                            <div className={`h-1 w-full`} style={{ backgroundColor: style.color }} />
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center justify-between">
                                                    {category}
                                                    <span className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-500 font-normal">Top Comments</span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-3">
                                                    {comments.slice(0, 3).map((comment: string, i: number) => (
                                                        <li key={i} className="text-sm text-gray-600 italic bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                                            "{comment}"
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                    </motion.div>
                )}
            </main>
        </div>
    );
}
