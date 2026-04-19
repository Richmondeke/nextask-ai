'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Landmark, Check, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface PayoutModalProps {
    uid: string;
    isOpen: boolean;
    onClose: () => void;
    currentMethod?: any;
    onSuccess: () => void;
}

const banks = [
    "Access Bank",
    "First Bank",
    "GTBank",
    "UBA",
    "Zenith Bank",
    "Opay",
    "Palmpay",
    "Kuda Bank",
    "Standard Chartered",
    "Ecobank",
    "Ghana Commercial Bank (GCB)",
    "Standard Chartered (Ghana)",
    "Fidelity Bank (Ghana)",
    "Equity Bank (Kenya)",
    "KCB Bank (Kenya)",
    "Co-operative Bank of Kenya"
];

export default function PayoutModal({ uid, isOpen, onClose, currentMethod, onSuccess }: PayoutModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [bankName, setBankName] = useState(currentMethod?.bankName || '');
    const [accountNumber, setAccountNumber] = useState(currentMethod?.accountNumber || '');
    const [accountName, setAccountName] = useState(currentMethod?.accountName || '');

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateDoc(doc(db, 'profiles', uid), {
                payoutMethod: {
                    bankName,
                    accountNumber,
                    accountName,
                    updatedAt: new Date().toISOString()
                }
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving payout method:", error);
            alert("Failed to save payout method. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Payout Method</h2>
                            <p className="text-sm text-zinc-500 font-medium tracking-tight">Set where you want to receive your earnings.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all border border-zinc-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Select Bank</label>
                                <div className="relative group">
                                    <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <select
                                        required
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm text-zinc-900 appearance-none"
                                    >
                                        <option value="">Select a bank</option>
                                        {banks.map(bank => (
                                            <option key={bank} value={bank}>{bank}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                        <Check size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Account Number</label>
                                <div className="relative group">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="0123456789"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm text-zinc-900 placeholder:text-zinc-400 font-medium"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Account Name</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-zinc-200 group-focus-within:border-blue-600 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter your full account name"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm text-zinc-900 placeholder:text-zinc-400 font-medium"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white font-bold h-14 rounded-2xl hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-blue-100"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <Check size={20} strokeWidth={3} />
                                    Link Payout Account
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-zinc-50 p-6 border-t border-zinc-100">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">i</div>
                        <p className="text-[10px] text-zinc-400 font-medium leading-relaxed uppercase tracking-wider">
                            By linking your account, you agree to NexTask's payment terms. Payouts are typically processed within 3-5 business days of task completion.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
