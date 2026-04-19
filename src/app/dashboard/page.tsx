'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    ArrowUpRight,
    TrendingUp,
    Briefcase
} from 'lucide-react';

export default function DashboardPage() {
    const stats = [
        { label: 'Application Status', value: 'Reviewing', icon: Clock, color: 'text-yellow-500' },
        { label: 'Active Jobs', value: '12', icon: Briefcase, color: 'text-blue-500' },
        { label: 'Next Interview', value: 'In 2 days', icon: CheckCircle2, color: 'text-green-500' },
        { label: 'Earnings', value: '$2,450', icon: TrendingUp, color: 'text-indigo-500' },
    ];

    const recentActivity = [
        { title: 'AI Engineering Role', company: 'TechFlow', status: 'Applied', date: '2 hours ago' },
        { title: 'ML Researcher', company: 'DeepScale', status: 'In Review', date: '5 hours ago' },
        { title: 'Product Manager', company: 'NextStep', status: 'Interviewing', date: '1 day ago' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold tracking-tight">Welcome back, John</h1>
                <p className="text-zinc-500 mt-2">Here's what's happening with your applications today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Recent Activity</h2>
                        <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">View all</button>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <motion.div
                                key={activity.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold">
                                        {activity.company[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{activity.title}</h3>
                                        <p className="text-sm text-zinc-500">{activity.company} • {activity.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                                        {activity.status}
                                    </span>
                                    <ArrowUpRight size={18} className="text-zinc-600" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Mini-info */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Onboarding</h2>
                    <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20">
                        <h3 className="font-semibold text-blue-500 mb-2">Complete your profile</h3>
                        <p className="text-sm text-zinc-400 mb-4">Complete your details to unlock higher paying roles and priority applications.</p>
                        <div className="w-full bg-white/10 h-1.5 rounded-full mb-4">
                            <div className="bg-blue-500 h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </div>
                        <p className="text-xs text-zinc-500 mb-6 font-medium">65% Completed</p>
                        <button className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                            Continue Setup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
