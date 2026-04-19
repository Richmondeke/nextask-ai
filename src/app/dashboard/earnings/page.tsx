'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    ArrowUpRight,
    History,
    Download,
    Calendar,
    CreditCard,
    ChevronRight
} from 'lucide-react';

export default function EarningsPage() {
    const transactions = [
        { id: '#TR-8821', desc: 'Expert Bonus - AI Alignment', amount: '$450.00', date: 'Apr 12, 2024', status: 'Completed' },
        { id: '#TR-8819', desc: 'Referral Bonus ( Sarah W. )', amount: '$150.00', date: 'Apr 10, 2024', status: 'Completed' },
        { id: '#TR-8812', desc: 'Contract Payout - Q1 Milestones', amount: '$1,850.00', date: 'Apr 02, 2024', status: 'Completed' },
        { id: '#TR-8791', desc: 'Setup Verification Credit', amount: '$1.00', date: 'Mar 28, 2024', status: 'Completed' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Earnings</h1>
                    <p className="text-zinc-500 mt-2 text-sm">Manage your payouts, rewards, and transaction history.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors">
                    Withdraw Funds
                </button>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-3xl bg-white text-black flex flex-col justify-between h-48 relative overflow-hidden">
                    <div className="flex items-center justify-between relative z-10">
                        <span className="text-sm font-semibold opacity-60">Available Balance</span>
                        <DollarSign size={20} className="text-zinc-400" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold tracking-tight">$2,451.00</h2>
                        <p className="text-xs font-semibold text-green-600 mt-2 flex items-center gap-1">
                            +15.5% vs last month <ArrowUpRight size={12} />
                        </p>
                    </div>
                    <motion.div
                        className="absolute -right-10 -bottom-10 w-40 h-40 bg-zinc-100 rounded-full"
                    />
                </div>

                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between h-48">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-500">Pending Payouts</span>
                        <Calendar size={20} className="text-zinc-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white">$600.00</h2>
                        <p className="text-xs text-zinc-500 mt-2">Estimated Arrival: Apr 25</p>
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between h-48 group cursor-pointer hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-500">Payout Method</span>
                        <CreditCard size={20} className="text-zinc-600" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Bank Transfer</h2>
                            <p className="text-xs text-zinc-500 mt-1">Ending in •••• 4410</p>
                        </div>
                        <ChevronRight size={20} className="text-zinc-700 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>

            {/* Transactions */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <History size={20} className="text-blue-500" />
                        <h2 className="text-xl font-bold">Transaction History</h2>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:text-white transition-colors">
                        <Download size={16} /> Export CSV
                    </button>
                </div>

                <div className="space-y-3">
                    {transactions.map((tx, index) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
                                    <DollarSign size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{tx.desc}</h3>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                                        <span>{tx.id}</span>
                                        <span>•</span>
                                        <span>{tx.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="font-bold text-white">{tx.amount}</div>
                                    <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1">{tx.status}</div>
                                </div>
                                <ChevronRight size={18} className="text-zinc-700 group-hover:text-white transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
