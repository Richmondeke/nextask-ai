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
} from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import PhoneVerificationModal from '@/components/PhoneVerificationModal';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('Applications');
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [applicationCount, setApplicationCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

    const tabs = ['Contracts', 'Offers', 'Applications', 'Assessments', 'Saved'];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
                if (profileDoc.exists()) {
                    setProfile(profileDoc.data());
                }
                const submissionsRef = collection(db, 'submissions');
                const snapshot = await getDocs(submissionsRef);
                const count = snapshot.docs.filter(doc => doc.id.startsWith(user.uid)).length;
                setApplicationCount(count);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    const tasks = [];
    if (!profile?.phoneVerified) tasks.push({ id: 'phone', title: 'Verify Your Phone Number', description: 'You must have a valid phone number to use Nexttask', link: '#' });
    if (!profile?.linkedinUrl && !profile?.noLinkedin) tasks.push({ id: 'linkedin', title: 'Link LinkedIn', description: 'Linking boosts your chances of being matched with opportunities', link: '/dashboard/profile' });

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Welcome back, {profile?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Richmond'}!
                </h1>
                {tasks.length > 0 && (
                    <p className="text-zinc-500 mt-2 font-medium">Important Tasks ({tasks.length})</p>
                )}
            </div>

            {/* Task Cards */}
            {tasks.length > 0 && (
                <div className="flex flex-wrap gap-6">
                    {tasks.map((task, index) => (
                        <div
                            key={task.id}
                            className="flex-1 min-w-[320px] p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-zinc-900">{task.title}</h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
                                        {task.description}
                                    </p>
                                </div>
                                {task.id === 'linkedin' && (
                                    <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 italic font-serif text-zinc-400 font-bold text-xs">
                                        in
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => task.id === 'phone' ? setIsPhoneModalOpen(true) : null}
                                    className="px-6 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition-colors"
                                >
                                    {task.id === 'phone' ? 'Verify now' : 'Link now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tabs Navigation */}
            <div className="border-b border-zinc-100">
                <div className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-[13px] font-bold transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-zinc-400 hover:text-zinc-600'
                                }`}
                        >
                            {tab}{tab === 'Applications' && applicationCount > 0 && <span className="ml-2 px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-500 text-[10px]">{applicationCount}</span>}
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
            <AnimatePresence mode="wait">
                {activeTab === 'Applications' && (
                    <motion.div
                        key="applications"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        {applicationCount === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                    <ClipboardList size={28} className="text-zinc-300" strokeWidth={1.5} />
                                </div>
                                <h2 className="text-lg font-bold text-zinc-900">You don't have any active applications</h2>
                                <Link
                                    href="/dashboard/explore"
                                    className="px-8 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-bold hover:bg-zinc-50 transition-colors"
                                >
                                    Explore Opportunities
                                </Link>
                            </div>
                        ) : (
                            <div className="group p-6 rounded-2xl border border-zinc-200 bg-white hover:border-blue-500/30 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                                        <Search size={24} className="text-zinc-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900">Generalist Expert</h3>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                            <span>$25 - $50 / hour</span>
                                            <span>•</span>
                                            <span>Hourly contract</span>
                                            <span>•</span>
                                            <span>Mercor</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col items-end gap-1 text-[11px]">
                                        <span className="text-zinc-400">Started on 04/18/24</span>
                                        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-bold uppercase tracking-wider scale-90 origin-right">
                                            3 of 4 steps completed
                                        </span>
                                    </div>
                                    <ChevronRight size={20} className="text-zinc-300" />
                                </div>
                            </div>
                        )}

                        <div className="pt-8 mt-8 border-t border-zinc-100">
                            <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-600 transition-colors text-sm font-medium">
                                <ChevronRight size={16} className="rotate-0 transition-transform" />
                                <span>Past applications (9)</span>
                                <div className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-500">
                                    !
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Phone Verification Modal - Placeholder for now, will implement properly later */}
            <AnimatePresence>
                {isPhoneModalOpen && (
                    <PhoneVerificationModal onClose={() => setIsPhoneModalOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

