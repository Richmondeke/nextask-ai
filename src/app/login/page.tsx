'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Logo from '@/components/ui/Logo';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { formatAuthError } from '@/lib/utils';

export default function LoginPage() {
    const router = useRouter();
    // useSearchParams can be problematic with SSR, so we wrap it or just handle it simply
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(formatAuthError(err));
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
            console.error('Google login error:', err);
            setError(formatAuthError(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#07080a] text-[#f9f9f9] flex flex-col items-center justify-center p-6 relative font-sans">
            <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-[#ff6363]/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="mb-8 overflow-hidden">
                <Logo dark className="scale-75" />
            </div>

            <div className="w-full max-w-md bg-[#101111]/80 backdrop-blur-xl border border-white/[0.06] p-10 rounded-[32px] shadow-mac relative z-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
                    <p className="text-[#9c9c9d] text-sm">Sign in to your account to continue.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#9c9c9d] uppercase tracking-wide ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a6b6c] group-focus-within:text-[#ff6363] transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-[#07080a] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#ff6363]/10 focus:border-[#ff6363]/50 transition-all text-sm text-[#f9f9f9] placeholder:text-[#6a6b6c]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-xs font-semibold text-[#9c9c9d] uppercase tracking-wide">Password</label>
                            <Link href="/forgot-password" className="text-xs text-[#ff6363] hover:underline font-medium">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a6b6c] group-focus-within:text-[#ff6363] transition-colors" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="w-full bg-[#07080a] border border-white/[0.08] rounded-2xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#ff6363]/10 focus:border-[#ff6363]/50 transition-all text-sm text-[#f9f9f9] placeholder:text-[#6a6b6c]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6a6b6c] hover:text-[#f9f9f9] transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#ff6363] text-white font-bold py-4 rounded-full hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-lg shadow-[#ff6363]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <LoadingSpinner size={20} /> : (
                            <>
                                Sign In
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/[0.06]"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                        <span className="bg-[#101111] px-4 text-[#6a6b6c]">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-[#07080a] border border-white/[0.08] hover:bg-white/[0.02] py-3.5 rounded-full transition-all font-bold text-sm text-[#f9f9f9] shadow-sm disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>

                <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
                    <Link
                        href="/admin/leads"
                        className="inline-flex items-center justify-center gap-2 text-xs text-[#9c9c9d] hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all font-semibold"
                    >
                        ⚡ Direct Admin Access (Local Dev) ↗
                    </Link>
                </div>

                <p className="text-center mt-6 text-[#9c9c9d] text-sm font-medium">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-[#ff6363] font-bold hover:opacity-80 transition-opacity">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

