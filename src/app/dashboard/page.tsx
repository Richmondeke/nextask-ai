'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Globe,
    Phone,
    ClipboardList,
    ChevronRight,
    Search
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('Applications');

    const tabs = ['Contracts', 'Offers', 'Applications', 'Assessments', 'Saved'];

    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Welcome back, Richmond!</h1>
                <p className="text-zinc-500 mt-2 font-medium">Important Tasks (2)</p>
            </div>

            {/* Task Cards */}
            <div className="flex flex-wrap gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 min-w-[320px] p-6 rounded-xl border border-zinc-200 bg-white shadow-sm"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <h3 className="font-bold text-zinc-900">Verify Your Phone Number</h3>
                            <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
                                You must have a valid phone number to use Nexttask
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
                            Verify now
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 min-w-[320px] p-6 rounded-xl border border-zinc-200 bg-white shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-4 right-4 text-zinc-200">
                        <Globe size={20} />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <h3 className="font-bold text-zinc-900">Link LinkedIn</h3>
                            <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
                                Linking boosts your chances of being matched with opportunities
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
                            Link now
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-zinc-200">
                <div className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-zinc-400 hover:text-zinc-600'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="tabUnderline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs Content */}
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100">
                    <ClipboardList size={28} className="text-zinc-300" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-lg font-bold text-zinc-900">You don't have any active applications</h2>
                </div>
                <Link
                    href="/dashboard/explore"
                    className="px-8 py-2.5 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-bold hover:bg-zinc-50 transition-colors"
                >
                    Explore Opportunities
                </Link>
            </div>

            {/* Past Applications Collapsible */}
            <div className="pt-8 border-t border-zinc-100">
                <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-600 transition-colors text-sm font-medium">
                    <ChevronRight size={16} className="rotate-0 transition-transform" />
                    <span>Past applications (0)</span>
                    <div className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-500">
                        i
                    </div>
                </button>
            </div>
        </div>
    );
}
