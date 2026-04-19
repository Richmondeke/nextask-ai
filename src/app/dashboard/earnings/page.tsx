'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign,
    ArrowUpRight,
    History,
    Download,
    Calendar,
    CreditCard,
    ChevronRight,
    TrendingUp,
    Loader2,
    Wallet
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import PayoutModal from '@/components/PayoutModal';

export default function EarningsPage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [earningsData, setEarningsData] = useState({
        availableBalance: 0,
        pendingPayouts: 0,
        lastMonthGrowth: 0
    });
    const [payoutMethod, setPayoutMethod] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);

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
            // Fetch Earnings Summary
            const earningsDoc = await getDoc(doc(db, 'earnings', uid));
            if (earningsDoc.exists()) {
                setEarningsData(earningsDoc.data() as any);
            }

            // Fetch Profile for Payout Method
            const profileDoc = await getDoc(doc(db, 'profiles', uid));
            if (profileDoc.exists()) {
                setPayoutMethod(profileDoc.data()?.payoutMethod || null);
            }

            // Fetch Latest Transactions
            const txQuery = query(
                collection(db, 'earnings', uid, 'transactions'),
                orderBy('date', 'desc'),
                limit(10)
            );
            const txSnapshot = await getDocs(txQuery);
            const txData = txSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTransactions(txData);

        } catch (error) {
            console.error("Error fetching earnings data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center py-40">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Earnings</h1>
                    <p className="text-zinc-500 mt-2 text-sm">Manage your payouts, rewards, and transaction history.</p>
                </div>
                <button
                    onClick={() => setIsPayoutModalOpen(true)}
                    className="px-6 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors shadow-sm"
                >
                    {payoutMethod ? 'Withdraw Funds' : 'Set Payout Method'}
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
                        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                            ${earningsData.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${earningsData.lastMonthGrowth >= 0
                                    ? 'text-green-600 bg-green-50 border-green-100'
                                    : 'text-red-600 bg-red-50 border-red-100'
                                }`}>
                                <TrendingUp size={10} className={earningsData.lastMonthGrowth < 0 ? 'rotate-180' : ''} />
                                {earningsData.lastMonthGrowth >= 0 ? '+' : ''}{earningsData.lastMonthGrowth}%
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
                        <h2 className="text-3xl font-black text-zinc-800 tracking-tight">
                            ${earningsData.pendingPayouts.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h2>
                        <p className="text-[11px] text-zinc-400 font-medium mt-1">
                            {earningsData.pendingPayouts > 0 ? 'Next payout processed soon' : 'No pending payouts'}
                        </p>
                    </div>
                </div>

                <div
                    onClick={() => setIsPayoutModalOpen(true)}
                    className="p-8 rounded-2xl bg-white border border-zinc-200 flex flex-col justify-between h-48 group cursor-pointer hover:bg-zinc-50 transition-all shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Payout Method</span>
                        <CreditCard size={18} className="text-zinc-300" />
                    </div>
                    <div className="flex items-center justify-between">
                        {payoutMethod ? (
                            <div>
                                <h2 className="text-lg font-bold text-zinc-900">{payoutMethod.bankName}</h2>
                                <p className="text-xs text-zinc-500 mt-1">Ending in •••• {payoutMethod.accountNumber.slice(-4)}</p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-lg font-bold text-zinc-400 italic">Not set</h2>
                                <p className="text-xs text-zinc-400 mt-1">Click to add payment method</p>
                            </div>
                        )}
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
                    {transactions.length > 0 && (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                            <Download size={14} /> Export CSV
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {transactions.length > 0 ? (
                        transactions.map((tx, index) => (
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
                                        <h3 className="font-bold text-zinc-900 text-sm">{tx.description}</h3>
                                        <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-medium tracking-wide">
                                            <span>{tx.id.toUpperCase()}</span>
                                            <div className="w-1 h-1 rounded-full bg-zinc-200" />
                                            <span>{new Date(tx.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="font-bold text-zinc-900 text-sm">
                                            ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                        <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${tx.status === 'Completed' ? 'text-green-600' : 'text-zinc-400'
                                            }`}>
                                            {tx.status}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-zinc-200 group-hover:text-zinc-400 transition-colors" />
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-zinc-400 shadow-sm mb-4">
                                <Wallet size={24} />
                            </div>
                            <h3 className="text-sm font-bold text-zinc-900">No transactions yet</h3>
                            <p className="text-xs text-zinc-500 mt-1 max-w-[200px] text-center leading-relaxed">
                                Your earnings and payout history will appear here once you complete tasks.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Payout Modal */}
            <AnimatePresence>
                {isPayoutModalOpen && user && (
                    <PayoutModal
                        uid={user.uid}
                        isOpen={isPayoutModalOpen}
                        onClose={() => setIsPayoutModalOpen(false)}
                        currentMethod={payoutMethod}
                        onSuccess={() => fetchData(user.uid)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
