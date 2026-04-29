'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    Briefcase,
    Calendar,
    ChevronRight,
    Clock,
    Search,
    Filter,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const q = query(
                        collection(db, 'applications'),
                        where('userId', '==', currentUser.uid),
                        orderBy('createdAt', 'desc')
                    );
                    const querySnapshot = await getDocs(q);
                    const apps = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setApplications(apps);
                } catch (error) {
                    console.error("Error fetching applications:", error);
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredApplications = applications.filter(app =>
        app.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'under review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-zinc-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-zinc-600" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-black text-zinc-900">My Applications</h1>
                                <p className="text-[11px] text-zinc-500 font-medium">Track your progress and updates</p>
                            </div>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search roles or companies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-zinc-100 border-transparent focus:bg-white focus:border-zinc-200 focus:ring-0 rounded-xl text-[13px] font-medium transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {filteredApplications.length === 0 ? (
                    <FadeIn>
                        <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center">
                            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Briefcase size={32} className="text-zinc-400" />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 mb-2">No applications found</h3>
                            <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-8">
                                {searchQuery ? "We couldn't find any applications matching your search." : "You haven't started any applications yet."}
                            </p>
                            <Link
                                href="/dashboard/explore"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                            >
                                Explore Open Roles
                            </Link>
                        </div>
                    </FadeIn>
                ) : (
                    <div className="grid gap-4">
                        {filteredApplications.map((app, index) => (
                            <FadeIn key={app.id} delay={index * 0.05}>
                                <Link
                                    href={`/dashboard/applications/${app.jobId}`}
                                    className="block bg-white border border-zinc-200 rounded-3xl p-6 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/50 transition-all group"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex gap-4">
                                            <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-200 group-hover:scale-105 transition-transform">
                                                <Briefcase size={24} className="text-zinc-900" />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-black text-zinc-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                        {app.title}
                                                    </h3>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusColor(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-zinc-500 mb-3">{app.company}</p>

                                                <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-zinc-400 capitalize">
                                                    <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-lg">
                                                        <Clock size={12} strokeWidth={3} />
                                                        Applied {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recently'}
                                                    </div>
                                                    {app.assessmentScore > 0 && (
                                                        <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-2 py-1 rounded-lg">
                                                            Score: {app.assessmentScore}%
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-100 mt-2 sm:mt-0">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] text-zinc-400 uppercase font-black mb-1">Latest Update</p>
                                                <p className="text-xs font-bold text-zinc-900">
                                                    {app.status === 'Active' ? 'Continue Assessment' : 'Application Received'}
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                                <ChevronRight size={20} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
