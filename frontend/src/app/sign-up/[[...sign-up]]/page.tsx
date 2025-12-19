"use strict";
import { SignUp } from "@clerk/nextjs";
import { Brain } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c8ff00]/10 via-transparent to-transparent opacity-60" />

            {/* Header Logo */}
            <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
                <div className="w-10 h-10 rounded-xl bg-[#c8ff00] flex items-center justify-center border border-black/10 shadow-sm">
                    <Brain className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl font-bold tracking-tight text-black">EliminateContext</span>
            </div>

            <div className="relative z-10">
                <SignUp
                    routing="path"
                    path="/sign-up"
                    appearance={{
                        elements: {
                            formButtonPrimary:
                                "bg-[#c8ff00] text-black hover:bg-[#b3e600] font-bold border border-black/10 shadow-lg",
                            card: "glass border border-black/10 shadow-xl",
                            headerTitle: "text-2xl font-bold text-black",
                            headerSubtitle: "text-gray-600",
                            socialButtonsBlockButton: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
                            formFieldLabel: "text-gray-700 font-medium",
                            formFieldInput: "border-gray-300 focus:border-[#c8ff00] focus:ring-[#c8ff00]"
                        }
                    }}
                />
            </div>
        </div>
    );
}
