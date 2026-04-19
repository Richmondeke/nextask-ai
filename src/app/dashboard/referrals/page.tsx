'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Copy,
    Gift,
    Send,
    Zap,
    TrendingUp,
    Share2,
    Mail
} from 'lucide-react';

export default function ReferralsPage() {
    const referrals = [
        { name: 'Sarah Wilson', email: 's.wilson@gmail.com', status: 'Active', reward: '$150' },
        { name: 'Michael Chen', email: 'm.chen@outlook.com', status: 'Signed Up', reward: '$0' },
        { name: 'Eric Johnson', email: 'ericj@tech.io', status: 'Payment Pending', reward: '$150' },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Refer & Earn</h1>
                    <p className="text-zinc-500 mt-2 text-sm">Earn $150 for every expert you refer who successfully joins Nexttask.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors shadow-sm">
                    <Send size={16} />
                    Invite via Email
                </button>
            </div>

            {/* Referral Link Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-zinc-900 text-white relative overflow-hidden group shadow-md"
                >
                    <div className="relative z-10 space-y-6">
                        <div className="p-3 bg-white/10 rounded-xl w-fit border border-white/5">
                            <Gift size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">Invite your friends</h2>
                            <p className="text-zinc-400 max-w-sm text-sm">Share your unique referral link and start building the future of AI together.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 backdrop-blur-sm">
                            <code className="flex-1 px-4 text-xs font-mono truncate text-zinc-300">nexttask.ai/r/jd-4421</code>
                            <button className="p-2.5 bg-white text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors">
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white border border-zinc-200 flex flex-col justify-between shadow-sm">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Earned</p>
                        <div className="mt-4">
                            <p className="text-3xl font-black text-zinc-900">$450</p>
                            <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold mt-1">
                                <TrendingUp size={12} /> +12% this month
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-white border border-zinc-200 flex flex-col justify-between shadow-sm">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Successful Referrals</p>
                        <div className="mt-4">
                            <p className="text-3xl font-black text-zinc-900">3</p>
                            <p className="text-[10px] text-zinc-400 font-medium mt-1">From 5 signups</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 col-span-2 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-600/10">
                                <Zap size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-blue-900 text-sm">Referral Bonus x2</p>
                                <p className="text-[11px] text-blue-600 font-medium">Active for next 48 hours</p>
                            </div>
                        </div>
                        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">
                            Boost Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Referrals List */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <h2 className="text-lg font-bold text-zinc-900">Your Referrals</h2>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                        <Share2 size={14} /> Share Link
                    </button>
                </div>

                <div className="rounded-xl border border-zinc-100 overflow-hidden bg-white shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Expert</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Reward</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {referrals.map((ref, index) => (
                                <tr key={ref.email} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-zinc-900 text-sm">{ref.name}</div>
                                        <div className="text-[11px] text-zinc-400 font-medium">{ref.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest shadow-sm border ${ref.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' :
                                                ref.status === 'Signed Up' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-yellow-50 text-yellow-600 border-yellow-100'
                                            }`}>
                                            {ref.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-zinc-900 text-sm">
                                        {ref.reward}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
