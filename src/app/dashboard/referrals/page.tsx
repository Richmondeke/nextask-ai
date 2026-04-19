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
    Share2
} from 'lucide-react';

export default function ReferralsPage() {
    const referrals = [
        { name: 'Sarah Wilson', email: 's.wilson@gmail.com', status: 'Active', reward: '$150' },
        { name: 'Michael Chen', email: 'm.chen@outlook.com', status: 'Signed Up', reward: '$0' },
        { name: 'Eric Johnson', email: 'ericj@tech.io', status: 'Payment Pending', reward: '$150' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Refer & Earn</h1>
                <p className="text-zinc-500 mt-2">Earn $150 for every expert you refer who successfully joins Nextask.</p>
            </div>

            {/* Referral Link Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden group"
                >
                    <div className="relative z-10 space-y-6">
                        <div className="p-3 bg-white/20 rounded-2xl w-fit">
                            <Gift size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Invite your friends</h2>
                            <p className="text-blue-100/80 max-w-sm">Share your unique referral link and start building the future of AI together.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <code className="flex-1 px-4 text-sm font-mono truncate">nextask.ai/r/jd-4421</code>
                            <button className="p-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors group-active:scale-95 duration-200">
                                <Copy size={18} />
                            </button>
                        </div>
                    </div>
                    <motion.div
                        className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500"
                    />
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                        <p className="text-zinc-500 text-sm font-medium">Total Earned</p>
                        <div>
                            <p className="text-3xl font-bold text-white">$450</p>
                            <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                                <TrendingUp size={12} /> +12% this month
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                        <p className="text-zinc-500 text-sm font-medium">Successful Referrals</p>
                        <div>
                            <p className="text-3xl font-bold text-white">3</p>
                            <p className="text-xs text-zinc-500 mt-1">From 5 signups</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 col-span-2 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
                                <Zap size={24} />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Referral Bonus x2</p>
                                <p className="text-xs text-zinc-500">Active for next 48 hours</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                            Boost
                        </button>
                    </div>
                </div>
            </div>

            {/* Referrals List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Your Referrals</h2>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:text-white transition-colors">
                            <Share2 size={16} /> Share Link
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors">
                            <Send size={16} /> Invite via Email
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-bottom border-white/10">
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Expert</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Reward</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {referrals.map((ref, index) => (
                                <tr key={ref.email} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{ref.name}</div>
                                        <div className="text-xs text-zinc-500">{ref.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${ref.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                                ref.status === 'Signed Up' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {ref.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-white">
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
