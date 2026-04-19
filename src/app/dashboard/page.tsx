'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Globe,
    Phone,
    ClipboardList,
    ChevronRight,
    Search,
    Loader2,
    Briefcase,
    Clock,
    DollarSign,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import PhoneVerificationModal from '@/components/PhoneVerificationModal';
import OnboardingTour from '@/components/OnboardingTour';
import FadeIn from '@/components/FadeIn';

export default function DashboardPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [jobCount, setJobCount] = useState(0);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    // Fetch Profile
                    const profileDoc = await getDoc(doc(db, 'profiles', currentUser.uid));
                    if (profileDoc.exists()) {
                        setProfile(profileDoc.data());
                    }

                    // Fetch Applications
                    const q = query(
                        collection(db, 'applications'),
                        where('userId', '==', currentUser.uid),
                        orderBy('createdAt', 'desc')
                    );
                    const querySnapshot = await getDocs(q);
                    const fetchedApps = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setApplications(fetchedApps);

                    // Fetch Job Opportunities
                    const jobsSnapshot = await getDocs(collection(db, 'jobs'));
                    setJobCount(jobsSnapshot.size);
                } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const stats = [
        {
            label: 'Active Applications',
            value: applications.filter(a => a.status === 'Active' || a.status === 'Pending').length.toString(),
            change: applications.length > 0 ? `+${applications.length}` : '0',
            icon: Briefcase,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Pending Reviews',
            value: applications.filter(a => a.status === 'Under Review').length.toString(),
            change: '0',
            icon: Clock,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            label: 'Total Earnings',
            value: profile?.totalEarnings ? `$${profile.totalEarnings.toLocaleString()}` : '$0',
            change: '+$0',
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            label: 'Opportunities',
            value: jobCount.toString(),
            change: jobCount > 0 ? `+${jobCount}` : '0',
            icon: Zap,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <FadeIn>
            <div className="space-y-8">
                {/* Welcome Message */}
                <div>
                    <h1 id="dashboard-welcome" className="text-2xl font-bold tracking-tight text-zinc-900">
                        Welcome back, {profile?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Expert'}!
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Here's what's happening with your applications.</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                {stat.change !== '0' && stat.change !== '+$0' && (
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            <div className="mt-4 space-y-1">
                                <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Applications */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-zinc-900">Recent Applications</h2>
                            <Link href="/dashboard/explore" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</Link>
                        </div>

                        <div className="space-y-3">
                            {applications.length > 0 ? (
                                applications.map((app, i) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center font-bold text-zinc-400">
                                                    {app.company?.[0] || 'N'}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-zinc-900">{app.title}</h3>
                                                    <p className="text-xs text-zinc-500">{app.company}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right hidden sm:block">
                                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${app.status === 'Accepted' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-orange-600'}`}>
                                                        {app.status}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-400">Recently</p>
                                                </div>
                                                <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-zinc-500 bg-white rounded-2xl border border-zinc-200 border-dashed">
                                    <div className="space-y-4">
                                        <p className="text-sm">You haven't applied to any roles yet.</p>
                                        <Link
                                            href="/dashboard/explore"
                                            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
                                        >
                                            Explore Opportunities
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Referral */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-zinc-900">Quick Referral</h2>
                        <div className="p-6 rounded-2xl bg-zinc-900 text-white space-y-6 relative overflow-hidden">
                            <div className="relative z-10 space-y-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Zap size={20} className="text-blue-400" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold">Earn $100 per expert</h3>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        Invite your colleagues to Nextask and earn rewards for every successful placement.
                                    </p>
                                </div>
                                <button className="w-full py-2.5 rounded-xl bg-white text-zinc-900 text-xs font-bold hover:bg-zinc-100 transition-colors">
                                    Copy Referral Link
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 blur-[40px] -ml-12 -mb-12" />
                        </div>

                        {/* Recent Activity Mini */}
                        <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4">
                            <h3 className="text-sm font-bold text-zinc-900">Platform Activity</h3>
                            <div className="space-y-4">
                                {[
                                    { text: "Identity verified successfully", time: "1h ago" },
                                    { text: "New high-pay roles added", time: "3h ago" }
                                ].map((activity, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] text-zinc-600 leading-tight">{activity.text}</p>
                                            <p className="text-[10px] text-zinc-400">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phone Verification Modal */}
                <AnimatePresence>
                    {isPhoneModalOpen && (
                        <PhoneVerificationModal onClose={() => setIsPhoneModalOpen(false)} />
                    )}
                </AnimatePresence>

                {/* Onboarding Tour */}
                {!loading && profile && !profile.onboardingCompleted && (
                    <OnboardingTour
                        userId={user?.uid}
                        onComplete={() => setProfile({ ...profile, onboardingCompleted: true })}
                    />
                )}
            </div>
        </FadeIn>
    );
}
