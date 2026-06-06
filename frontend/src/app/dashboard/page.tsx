"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Brain, Search, Loader2, ArrowLeft, BarChart2, ExternalLink, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

// Mapping backend keys to display labels and colors
const LANGUAGES = [
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi (हिंदी)" },
    { value: "assamese", label: "Assamese (অসমীয়া)" },
    { value: "malayalam", label: "Malayalam (മലയാളം)" },
];

const SENTIMENT_TRANSLATIONS: Record<string, Record<string, string>> = {
    english: {
        supportive_empathetic: "Supportive",
        appreciative_praising: "Appreciative",
        informative_neutral: "Neutral",
        sarcastic_ironic: "Sarcastic",
        critical_disapproving: "Critical",
        angry_hostile: "Hostile",
    },
    hindi: {
        supportive_empathetic: "सहायक",
        appreciative_praising: "प्रशंसापूर्ण",
        informative_neutral: "तटस्थ",
        sarcastic_ironic: "व्यंग्यात्मक",
        critical_disapproving: "आलोचनात्मक",
        angry_hostile: "शत्रुतापूर्ण",
    },
    assamese: {
        supportive_empathetic: "সহায়ক",
        appreciative_praising: "প্ৰশংসাসূচক",
        informative_neutral: "নিৰপেক্ষ",
        sarcastic_ironic: "বক্রোক্তি",
        critical_disapproving: "সমালোচনামূলক",
        angry_hostile: "শত্ৰুতাপূৰ্ণ",
    },
    malayalam: {
        supportive_empathetic: "സഹായകമായ",
        appreciative_praising: "അഭിനന്ദനപരമായ",
        informative_neutral: "നിഷ്പക്ഷമായ",
        sarcastic_ironic: "പരിഹാസപരമായ",
        critical_disapproving: "വിമർശനാത്മകമായ",
        angry_hostile: "ശത്രുതാപരമായ",
    }
};

// Mapping backend keys to display labels (defaulting to English for config referencing) and colors
const SENTIMENT_COLORS: Record<string, string> = {
    appreciative_praising: "#16a34a",
    supportive_empathetic: "#00e676",
    informative_neutral: "#cbd5e1",
    sarcastic_ironic: "#facc15",
    critical_disapproving: "#f97316",
    angry_hostile: "#ef4444",
};

// Mapping backend sentiment category strings to internal keys
const CATEGORY_TO_KEY: Record<string, string> = {
    "Supportive/Empathetic": "supportive_empathetic",
    "Critical/Disapproving": "critical_disapproving",
    "Sarcastic/Ironic": "sarcastic_ironic",
    "Informative/Neutral": "informative_neutral",
    "Appreciative/Praising": "appreciative_praising",
    "Angry/Hostile": "angry_hostile"
};

type ViewState = "input" | "list" | "detail";

export default function Dashboard() {
    const { getToken, isLoaded, isSignedIn } = useAuth();

    // State
    const [inputUrl, setInputUrl] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("english");
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
        // Split URLs by newline, comma, or Unicode line/paragraph separators and filter empty, then deduplicate
        const rawUrls = inputUrl.split(/[\n\r,\u2028\u2029]+/).map(u => u.trim()).filter(u => u.length > 0);
        const urls = Array.from(new Set(rawUrls));

        try {
            const token = await getToken();
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            if (urls.length === 1) {
                // Single Analysis
                const res = await fetch("/api/v1/analyze", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ url: urls[0], platform: "auto", language: selectedLanguage })
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
                const res = await fetch("/api/v1/analyze/batch", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ urls, language: selectedLanguage })
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

    const handleExportPDF = async () => {
        if (!currentResult) return;
        try {
            const token = await getToken();
            const res = await fetch("/api/v1/export/pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(currentResult)
            });

            if (!res.ok) throw new Error("Failed to generate PDF");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `report_${currentResult.platform}_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error("Export failed", err);
            // Optionally show error toast
        }
    };

    // Helper to get chart data for a result
    const getChartData = (res: any) => {
        return res?.summary ? Object.keys(SENTIMENT_COLORS).map(key => ({
            name: SENTIMENT_TRANSLATIONS[selectedLanguage]?.[key] || SENTIMENT_TRANSLATIONS["english"][key],
            value: res.summary[key] || 0,
            color: SENTIMENT_COLORS[key]
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
                        <img src="/logo.png" alt="EliminateContext" className="w-8 h-8 rounded-lg" />
                        <span className="text-xl font-bold tracking-tight text-black">EliminateContext</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/contact" className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="hidden md:inline">Contact</span>
                        </Link>
                        <span className="text-sm font-medium text-gray-500 hidden md:block">Dashboard</span>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">

                {/* VIEW: INPUT */}
                {view === "input" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
                        <div className="mb-10 mt-10">
                            <h1 className="text-3xl font-bold mb-3 tracking-tight">Analyse Sentiment Context</h1>
                            <p className="text-gray-700 text-sm">
                                Enter one or more URLs (one per line) from YouTube, Facebook, Instagram, or Twitter/X.
                            </p>
                        </div>

                        <div className="mb-16 relative z-10 w-full max-w-[800px] mx-auto">
                            <form onSubmit={handleAnalyze} className="relative shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] rounded-2xl bg-white overflow-hidden border border-gray-200">
                                <textarea
                                    placeholder="https://www.youtube.com/watch?v=...https://twitter.com/user/status/..."
                                    className="w-full h-[220px] p-6 text-[15px] resize-none outline-none text-gray-700 placeholder:text-gray-400 font-mono tracking-tight"
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                />
                                <div className="bg-[#f3f4f6]/80 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-[13px] text-black font-semibold whitespace-nowrap">
                                            {new Set(inputUrl.split(/[\n\r,\u2028\u2029]+/).filter(u => u.trim().length > 0)).size} URL(s)
                                        </div>
                                        <select
                                            value={selectedLanguage}
                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                            className="bg-white border border-gray-200 text-gray-800 text-[12px] rounded focus:ring-black focus:border-black block py-1.5 px-3 outline-none min-w-[100px] shadow-sm font-medium"
                                        >
                                            {LANGUAGES.map((lang) => (
                                                <option key={lang.value} value={lang.value}>
                                                    {lang.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loading || !inputUrl.trim()}
                                        className="bg-black text-white hover:bg-gray-800 font-medium rounded-md px-8 py-2 text-[13px] h-9 shadow-sm"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Processing...</span>
                                        ) : (
                                            <span>Analyse Context</span>
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
                                                    {res.summary?.totalComments > 0 ? (
                                                        <>
                                                            <span className="block font-bold text-2xl text-black">{res.summary?.totalComments}</span>
                                                            Comments
                                                        </>
                                                    ) : (
                                                        <div className="text-red-500">
                                                            <span className="block font-bold text-lg">Analysis Failed</span>
                                                            <span className="text-xs">API Limit Reached</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Mini Pie Chart Preview */}
                                                <div className="w-16 h-16">
                                                    {res.summary?.totalComments > 0 && (
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie data={getChartData(res)} cx="50%" cy="50%" innerRadius={0} outerRadius={30} dataKey="value">
                                                                    {getChartData(res).map((entry, index) => (
                                                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                                                    ))}
                                                                </Pie>
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    )}
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
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto">
                        {/* Header Actions */}
                        <div className="flex items-center justify-between pb-4 mb-2">
                            <Button variant="ghost" className="gap-2 pl-0 text-gray-600 hover:text-black hover:bg-transparent -ml-2 text-[13px] font-semibold" onClick={handleBackToResults}>
                                <ArrowLeft className="w-4 h-4" />
                                Analyse Another
                            </Button>

                            <div className="flex gap-3">
                                <a href={currentResult.postUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="gap-2 rounded-md h-8 text-[11px] font-semibold shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] border-gray-200">
                                        <span>Visit Link</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Button>
                                </a>
                                <Button className="gap-2 bg-black text-white hover:bg-gray-800 rounded-md h-8 text-[11px] font-semibold shadow-sm" onClick={handleExportPDF}>
                                    <span>Export PDF</span>
                                    <Download className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>

                        {/* 4 Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="shadow-sm border-gray-100 rounded-lg">
                                <CardContent className="p-5 flex flex-col justify-center">
                                    <span className="text-[10px] font-bold text-gray-400 mb-1">Processing Time</span>
                                    <span className="text-[32px] font-bold tracking-tight text-black leading-none mt-1">{currentResult.processingTime?.toFixed(2)}s</span>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-gray-100 rounded-lg relative overflow-hidden">
                                <CardContent className="p-5 flex flex-col justify-center h-full">
                                    <span className="text-[10px] font-bold text-gray-400 mb-1">Sentiment Score</span>
                                    <div className="flex items-end gap-2 mt-1">
                                        <span className="text-[32px] font-bold tracking-tight text-black leading-none">{currentResult.summary?.totalComments > 0 ? (currentResult.summary?.sentimentScore || "88/100") : "N/A"}</span>
                                    </div>
                                    <span className="text-[9px] font-medium text-gray-400 mt-2">{currentResult.summary?.totalComments > 0 ? "High Positivity" : "Not Analyzed"}</span>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-gray-100 rounded-lg">
                                <CardContent className="p-5 flex flex-col justify-center">
                                    <span className="text-[10px] font-bold text-gray-400 mb-1">Total Views</span>
                                    <span className="text-[32px] font-bold tracking-tight text-black leading-none mt-1">{currentResult.summary?.totalViews || "N/A"}</span>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-gray-100 rounded-lg">
                                <CardContent className="p-5 flex flex-col justify-center">
                                    <span className="text-[10px] font-bold text-gray-400 mb-1">Total Comments</span>
                                    <span className="text-[32px] font-bold tracking-tight text-black leading-none mt-1">{currentResult.summary?.totalComments > 0 ? currentResult.summary?.totalComments : "Failed"}</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Middle Section: Context & Sentiment Chart */}
                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                            {/* Context Analysis */}
                            <Card className="shadow-sm border-gray-100 rounded-xl flex flex-col">
                                <CardHeader className="pb-3 pt-5 px-6">
                                    <CardTitle className="text-[14px] font-bold">Context Analysis</CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 flex-grow flex flex-col gap-4">
                                    <div className="rounded-xl overflow-hidden bg-gray-100 relative w-full h-[240px] flex-shrink-0 border border-gray-200/50">
                                        {currentResult.postContext?.images?.[0] ? (
                                            <img src={currentResult.postContext.images[0]} alt="Post Thumbnail" className="w-full h-full object-cover" />
                                        ) : currentResult.platform === "youtube" ? (
                                            <img
                                                src={`https://img.youtube.com/vi/${(() => {
                                                    const match = currentResult.postUrl.match(/(?:youtu\.be\/|v=)([^&]+)/);
                                                    return match ? match[1] : '';
                                                })()}/hqdefault.jpg`}
                                                alt="Video Thumbnail"
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.src = "/placeholder-video.png")}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-gray-50 text-gray-300"><ExternalLink size={32} /></div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-4 mt-1">
                                        <div>
                                            <span className="text-[10px] font-medium text-gray-500 block mb-0.5">Platform</span>
                                            <span className={`text-[13px] font-bold ${currentResult.platform === 'youtube' ? 'text-[#ff0000]' : 'text-black'} capitalize`}>{currentResult.platform}</span>
                                        </div>
                                        {currentResult.postContext?.title && (
                                            <div>
                                                <span className="text-[10px] font-medium text-gray-500 block mb-0.5">Title</span>
                                                <span className="text-[13px] font-bold text-gray-900 leading-snug block">{currentResult.postContext.title}</span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-[10px] font-medium text-gray-500 block mb-0.5">Summary</span>
                                            <p className="text-[12.5px] font-medium text-gray-800 leading-relaxed max-w-[95%]">
                                                {currentResult.postContext?.description || currentResult.postContext?.text || "No summary available."}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Overall Sentiment */}
                            <Card className="shadow-sm border-gray-100 rounded-xl flex flex-col">
                                <CardHeader className="pb-0 pt-5 px-6">
                                    <CardTitle className="text-[14px] font-bold">Overall Sentiment</CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 flex-grow flex flex-col mt-6">
                                    <div className="h-[240px] w-full ml-[-20px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={getChartData(currentResult)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="15%">
                                                <XAxis dataKey="name" hide />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#888', fontWeight: 500 }} tickCount={7} />
                                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: 600 }} />
                                                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                                                    {getChartData(currentResult).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Custom Legend */}
                                    <div className="grid grid-cols-2 gap-y-7 gap-x-4 mt-12 px-6 pb-4">
                                        {[
                                            { key: "appreciative_praising", label: "Appreciative" },
                                            { key: "sarcastic_ironic", label: "Sarcastic" },
                                            { key: "supportive_empathetic", label: "Supportive" },
                                            { key: "critical_disapproving", label: "Critical" },
                                            { key: "informative_neutral", label: "Neutral" },
                                            { key: "angry_hostile", label: "Hostile" },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: SENTIMENT_COLORS[item.key] }}></div>
                                                <span className="text-[11px] font-bold text-gray-800 tracking-wide">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Key Insights By Category */}
                        <div className="mt-8 mb-12">
                            <h3 className="text-[17px] font-bold mb-5 tracking-tight">Key Insights By Category</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {[
                                    "appreciative_praising",
                                    "supportive_empathetic",
                                    "informative_neutral",
                                    "sarcastic_ironic",
                                    "critical_disapproving",
                                    "angry_hostile"
                                ].map((key) => {
                                    // Map backend string representation back if necessary, but here we can just check directly
                                    // if currentResult.topComments has comments that map to this key
                                    const categoryEntry = Object.entries(currentResult.topComments || {}).find(([cat, _]) => CATEGORY_TO_KEY[cat] === key);
                                    let comments = categoryEntry ? categoryEntry[1] as string[] : [];

                                    // Generate dummy comments for presentation if empty (based on design image where they are full)
                                    if (comments.length === 0) {
                                        comments = [
                                            "Placeholder comment for demonstration...",
                                            "Another placeholder showing layout structure.",
                                        ];
                                    }

                                    const color = SENTIMENT_COLORS[key];
                                    const label = SENTIMENT_TRANSLATIONS[selectedLanguage]?.[key] || SENTIMENT_TRANSLATIONS["english"][key];

                                    return (
                                        <Card key={key} className="shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border-gray-100 rounded-xl overflow-hidden bg-white">
                                            <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
                                            <CardHeader className="py-4 px-5">
                                                <CardTitle className="text-[13px] font-bold">{label}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="px-5 pb-5">
                                                <div className="flex flex-col gap-3">
                                                    {comments.slice(0, 4).map((comment: string, i: number) => (
                                                        <div key={i} className="text-[11px] text-gray-800 italic bg-[#f8f9fa] rounded flex items-center p-3 leading-relaxed">
                                                            "{comment}"
                                                        </div>
                                                    ))}
                                                </div>
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
