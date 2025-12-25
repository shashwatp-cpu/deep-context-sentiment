"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import confetti from "canvas-confetti";
import { Loader2, Send, ArrowLeft, Mail, MessageSquare, User, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            setSuccess(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            toast.success("Message sent successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <nav className="border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-black/10 shadow-sm">
                                <ArrowLeft className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-sm font-medium text-black">Back to Dashboard</span>
                        </Link>
                    </div>
                </nav>

                <main className="flex-1 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg text-center"
                    >
                        <Card className="shadow-xl bg-white border-0 py-12 px-6">
                            <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-lime-600" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                            <p className="text-gray-600 text-lg mb-8">
                                Thank you for reaching out. We have received your email and will be in touch with you shortly.
                            </p>
                            <Link href="/dashboard">
                                <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 rounded-xl text-lg">
                                    Return to Dashboard
                                </Button>
                            </Link>
                        </Card>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-black/10 shadow-sm">
                            <ArrowLeft className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-sm font-medium text-black">Back to Dashboard</span>
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg"
                >
                    <Card className="shadow-xl bg-white border-0">
                        <CardHeader className="text-center pb-2">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <Mail className="w-6 h-6 text-lime-600" />
                            </motion.div>
                            <CardTitle className="text-2xl font-bold">Get in Touch</CardTitle>
                            <CardDescription className="text-gray-500">
                                Send us a message and we'll get back to you soon.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" /> Name
                                    </label>
                                    <Input
                                        id="name"
                                        placeholder="Your Name"
                                        {...form.register("name")}
                                        className="focus-visible:ring-lime-500"
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" /> Email
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...form.register("email")}
                                        className="focus-visible:ring-lime-500"
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-gray-400" /> Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        placeholder="How can we help you?"
                                        {...form.register("message")}
                                        className="min-h-[120px] resize-none focus-visible:ring-lime-500"
                                    />
                                    {form.formState.errors.message && (
                                        <p className="text-red-500 text-xs">{form.formState.errors.message.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#c8ff00] text-black hover:bg-[#b3e600] font-bold"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
