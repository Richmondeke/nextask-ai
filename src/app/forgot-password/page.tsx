'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate submission
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradient Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 relative z-10"
            >
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H8L16 16V20H12L4 8V4Z" fill="white" />
                            <path d="M16 4H20V12L8 20H4V16L16 4Z" fill="white" fillOpacity="0.5" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold tracking-tighter">Nexttask</span>
                </Link>
            </motion.div>

            {/* Forgot Password Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[32px] backdrop-blur-xl relative z-10"
            >
                {!isSubmitted ? (
                    <>
                        <div className="mb-8">
                            <Link href="/login" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium mb-6">
                                <ArrowLeft size={16} /> Back to Sign In
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight mb-2">Reset password</h1>
                            <p className="text-zinc-500">Enter your email and we&apos;ll send you instructions to reset your password.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                            >
                                Send Instructions
                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-6 py-4"
                    >
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mx-auto mb-2">
                            <CheckCircle2 size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight mb-2">Check your email</h2>
                            <p className="text-zinc-500">We&apos;ve sent a password reset link to <span className="text-white font-medium">{email}</span></p>
                        </div>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            Didn&apos;t receive the email? <span className="text-blue-500 font-semibold underline underline-offset-4">Try again</span>
                        </button>
                        <div className="pt-4">
                            <Link href="/login" className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors text-sm">
                                Back to Sign In
                            </Link>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
