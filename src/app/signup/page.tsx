'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { generateReferralCode } from '@/lib/utils';

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refCode = searchParams.get('ref');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });

            // Create Profile with Referral Logic
            const myRefCode = generateReferralCode();
            await setDoc(doc(db, 'profiles', user.uid), {
                fullName: name,
                email: email,
                referralCode: myRefCode,
                referredBy: refCode || null,
                role: 'user', // Default role
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradient Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 relative z-10"
            >
                <Logo />
            </motion.div>

            {/* Signup Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-md bg-white border border-zinc-100 p-10 rounded-[32px] shadow-2xl shadow-zinc-200/50 relative z-10"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create account</h1>
                    <p className="text-zinc-500">Join the elite network of AI experts.</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                required
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm text-zinc-900 placeholder:text-zinc-400"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm text-zinc-900 placeholder:text-zinc-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm text-zinc-900 placeholder:text-zinc-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg shadow-blue-100"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                                Sign Up
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                            <span className="bg-white px-2 text-zinc-400">Or join with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 hover:bg-zinc-50 py-3.5 rounded-2xl transition-all font-bold text-sm text-zinc-900 shadow-sm disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </button>
                </form>

                <p className="text-center mt-10 text-zinc-500 text-sm font-medium">
                    Already have an account?{' '}
                    <Link href="/login" title="Go to Login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">Sign in</Link>
                </p>
            </motion.div>

            {/* Footer */}
            <div className="mt-12 text-zinc-600 text-xs flex gap-6 relative z-10">
                <Link href="#" className="hover:text-zinc-400">Privacy Policy</Link>
                <Link href="#" className="hover:text-zinc-400">Terms of Service</Link>
            </div>
        </div>
    );
}
