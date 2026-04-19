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
    ChevronRight,
    TrendingUp
} from 'lucide-react';

export default function EarningsPage() {
    const transactions = [
        { id: '#TR-8821', desc: 'Expert Bonus - AI Alignment', amount: '$450.00', date: 'Apr 12, 2024', status: 'Completed' },
        { id: '#TR-8819', desc: 'Referral Bonus ( Sarah W. )', amount: '$150.00', date: 'Apr 10, 2024', status: 'Completed' },
        { id: '#TR-8812', desc: 'Contract Payout - Q1 Milestones', amount: '$1,850.00', date: 'Apr 02, 2024', status: 'Completed' },
        { id: '#TR-8791', desc: 'Setup Verification Credit', amount: '$1.00', date: 'Mar 28, 2024', status: 'Completed' },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Earnings</h1>
                    <p className="text-zinc-500 mt-2 text-sm">Manage your payouts, rewards, and transaction history.</p>
                </div>
                <button className="px-6 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors shadow-sm">
                    Withdraw Funds
                </button>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-2xl bg-white border border-zinc-200 flex flex-col justify-between h-48 relative overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between relative z-10">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Available Balance</span>
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <DollarSign size={18} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">$2,451.00</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 px-1.5 py-0.5 rounded bg-green-50 border border-green-100">
                                <TrendingUp size={10} /> +15.5%
                            </div>
                            <span className="text-[10px] text-zinc-400 font-medium">vs last month</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200/50 flex flex-col justify-between h-48">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pending Payouts</span>
                        <Calendar size={18} className="text-zinc-300" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-zinc-800 tracking-tight">$600.00</h2>
                        <p className="text-[11px] text-zinc-400 font-medium mt-1">Estimated Arrival: Apr 25</p>
                    </div>
                </div>

                <div className="p-8 rounded-2xl bg-white border border-zinc-200 flex flex-col justify-between h-48 group cursor-pointer hover:bg-zinc-50 transition-all shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Payout Method</span>
                        <CreditCard size={18} className="text-zinc-300" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900">Bank Transfer</h2>
                            <p className="text-xs text-zinc-500 mt-1">Ending in •••• 4410</p>
                        </div>
                        <ChevronRight size={20} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Transactions */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <div className="flex items-center gap-3">
                        <History size={20} className="text-zinc-900" />
                        <h2 className="text-lg font-bold text-zinc-900">Transaction History</h2>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                        <Download size={14} /> Export CSV
                    </button>
                </div>

                <div className="space-y-3">
                    {transactions.map((tx, index) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-5 rounded-xl border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400">
                                    <DollarSign size={18} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-zinc-900 text-sm">{tx.desc}</h3>
                                    <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-medium tracking-wide">
                                        <span>{tx.id}</span>
                                        <div className="w-1 h-1 rounded-full bg-zinc-200" />
                                        <span>{tx.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="font-bold text-zinc-900 text-sm">{tx.amount}</div>
                                    <div className="text-[9px] text-green-600 font-black uppercase tracking-widest mt-1">
                                        {tx.status}
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-zinc-200 group-hover:text-zinc-400 transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
