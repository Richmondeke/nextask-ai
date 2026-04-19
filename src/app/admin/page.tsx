'use client';

import React, { useEffect, useState } from 'react';
import {
    Users,
    Briefcase,
    TrendingUp,
    ArrowUpRight,
    Clock,
    Search,
    Loader2,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function AdminOverview() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { name: 'Total Talent', value: '0', change: '+0%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Active Jobs', value: '0', change: '+0%', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Applications', value: '0', change: '+0%', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
        { name: 'New Reviews', value: '0', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    ]);

    const [recentUsers, setRecentUsers] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch Profiles Count
            const profilesSnap = await getDocs(collection(db, 'profiles'));
            const totalTalent = profilesSnap.size;

            // Fetch Jobs Count
            const jobsSnap = await getDocs(collection(db, 'jobs'));
            const totalJobs = jobsSnap.size;

            // Fetch Applications Count
            const appsSnap = await getDocs(collection(db, 'applications'));
            const totalApps = appsSnap.size;

            // Fetch Recent Users
            const recentUsersQuery = query(
                collection(db, 'profiles'),
                orderBy('createdAt', 'desc'),
                limit(4)
            );
            const recentUsersSnap = await getDocs(recentUsersQuery);
            const users = recentUsersSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setRecentUsers(users);
            setStats([
                { name: 'Total Talent', value: totalTalent.toLocaleString(), change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { name: 'Active Jobs', value: totalJobs.toLocaleString(), change: '+5%', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { name: 'Applications', value: totalApps.toLocaleString(), change: '+18%', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
                { name: 'New Reviews', value: users.filter((u: any) => u.status === 'New' || u.status === 'Pending Review').length.toString(), icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
            ]);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-zinc-500 font-medium font-medium">Synchronizing system data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-2">Platform Overview</h1>
                <p className="text-zinc-500 font-medium">Real-time metrics and system health monitoring.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                                {stat.change}
                                <ArrowUpRight size={12} />
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-zinc-400 mb-1">{stat.name}</p>
                        <h3 className="text-3xl font-bold text-zinc-900">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Application Funnel & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Talent */}
                <div className="lg:col-span-8 bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                        <h3 className="text-xl font-bold">New Talent Submissions</h3>
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
                    </div>
                    <div className="divide-y divide-zinc-50">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="p-6 flex items-center gap-6 hover:bg-zinc-50/50 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                    {user.fullName?.[0] || user.email?.[0] || 'U'}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-zinc-900">{user.fullName || 'New User'}</h4>
                                    <p className="text-sm text-zinc-500">{user.role || 'Unassigned Role'}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-md mb-1 inline-block ${user.status === 'Vetted' ? 'bg-emerald-50 text-emerald-600' :
                                        user.status === 'Pending Review' || user.status === 'New' ? 'bg-amber-50 text-amber-600' :
                                            'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {user.status || 'New'}
                                    </span>
                                    <p className="text-xs text-zinc-400">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Just now'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Tasks */}
                <div className="lg:col-span-4 bg-zinc-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/30 transition-all duration-700" />

                    <h3 className="text-xl font-bold mb-6 relative z-10">Admin Tasks</h3>
                    <div className="space-y-4 relative z-10">
                        {[
                            'Review 24 new resumes',
                            'Approve payout requests',
                            'Update platform pricing',
                            'Audit security logs'
                        ].map((task, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-sm font-medium text-zinc-300">{task}</span>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-4 bg-white text-zinc-900 font-bold rounded-2xl hover:bg-zinc-100 transition-all">
                        Launch System Audit
                    </button>
                </div>
            </div>
        </div>
    );
}
