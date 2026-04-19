'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users as UsersIcon,
    Copy,
    Gift,
    Send,
    Zap,
    TrendingUp,
    Share2,
    Check,
    Loader2,
    Users,
    Linkedin,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function ReferralsPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                await fetchData(user.uid);
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchData = async (uid: string) => {
        setIsLoading(true);
        try {
            const profileDoc = await getDoc(doc(db, 'profiles', uid));
            if (profileDoc.exists()) {
                const profileData = profileDoc.data();
                setProfile(profileData);

                if (profileData.referralCode) {
                    const q = query(
                        collection(db, 'profiles'),
                        where('referredBy', '==', profileData.referralCode)
                    );
                    const querySnapshot = await getDocs(q);
                    const refs = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setReferrals(refs);
                }
            }
        } catch (error) {
            console.error("Error fetching referrals:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const copyToClipboard = () => {
        if (!profile?.referralCode) return;
        const url = `${window.location.origin}/signup?ref=${profile.referralCode}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="bg-blue-600 rounded-[40px] p-10 md:p-14 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
                        Refer people you've worked with. <br />
                        <span className="text-blue-200">Earn when they get hired.</span>
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-10 opacity-90">
                        Help your talented colleagues find world-class opportunities and get recognized for your professional network.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                        <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20 flex items-center justify-between group">
                            <span className="text-sm font-bold tracking-wider text-blue-50">
                                {profile?.referralCode || 'REF-XXXX'}
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className="text-[10px] font-black uppercase tracking-widest bg-white text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                            >
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Abstract shape */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: "1. Upload connections",
                        desc: "Export your LinkedIn ZIP or CSV and upload it to Nexttask.",
                        icon: <Linkedin size={24} />,
                        color: "bg-blue-50 text-blue-600"
                    },
                    {
                        title: "2. We find matches",
                        desc: "Our AI matches your connections with frontier research roles.",
                        icon: <Zap size={24} />,
                        color: "bg-orange-50 text-orange-600"
                    },
                    {
                        title: "3. You earn 20%",
                        desc: "Get a 20% commission on every placement from your network.",
                        icon: <Gift size={24} />,
                        color: "bg-green-50 text-green-600"
                    }
                ].map((feature, i) => (
                    <div key={i} className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center shadow-inner`}>
                            {feature.icon}
                        </div>
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed font-medium">{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* Stats Block */}
            <div className="bg-zinc-900 rounded-[40px] p-8 md:p-12 text-white shadow-2xl shadow-zinc-200">
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12 text-center md:text-left">
                    {[
                        { label: "Signed Up", value: referrals.length },
                        { label: "Application Started", value: 0 },
                        { label: "Application Completed", value: 0 },
                        { label: "Offer Extended", value: 0 },
                        { label: "Hired", value: 0 },
                        { label: "Paid", value: "$0" }
                    ].map((stat, i) => (
                        <div key={i} className="space-y-2">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Referrals Table */}
            <div className="bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                    <h3 className="text-xl font-bold">Recent Referrals</h3>
                    <div className="px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-500 text-[11px] font-bold flex items-center gap-2 shadow-sm">
                        <Users size={14} />
                        {referrals.length} total
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-zinc-400">Talent</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-zinc-400">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] uppercase tracking-widest font-black text-zinc-400">Reward</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100">
                            {referrals.length > 0 ? (
                                referrals.map((ref) => (
                                    <tr key={ref.id} className="hover:bg-zinc-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-zinc-900 text-sm group-hover:text-blue-600 transition-colors">{ref.fullName}</div>
                                            <div className="text-[11px] text-zinc-400 font-medium">{ref.email}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm border ${ref.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' :
                                                ref.status === 'Signed Up' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                }`}>
                                                {ref.status || 'Signed Up'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right font-black text-zinc-900 text-sm">
                                            {ref.status === 'Active' ? '$150.00' : '$0.00'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 max-w-xs mx-auto">
                                            <div className="w-16 h-16 rounded-[24px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-200">
                                                <Share2 size={32} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-zinc-900">No referrals discovered</p>
                                                <p className="text-xs text-zinc-400 leading-relaxed">Your professional network is your greatest asset. Share your link to start earning.</p>
                                            </div>
                                            <button
                                                onClick={copyToClipboard}
                                                className="mt-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                                            >
                                                Share Referral Link
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
