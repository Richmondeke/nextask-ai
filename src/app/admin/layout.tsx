'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    ArrowLeft,
    ShieldAlert,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/login');
                return;
            }

            const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
            const profileData = profileDoc.data();

            if (profileData?.role === 'admin' || profileData?.role === 'superadmin') {
                setIsAuthorized(true);
            } else {
                router.push('/dashboard');
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    const adminLinks = [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Talent Pool', href: '/admin/users', icon: Users },
        { name: 'Job Manager', href: '/admin/jobs', icon: Briefcase },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-zinc-900 text-white flex flex-col fixed h-full z-50">
                <div className="p-8 border-b border-zinc-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                        N
                    </div>
                    <span className="font-bold tracking-tight text-xl">Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 mt-6">
                    {adminLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="text-sm font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-all group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Back to User View</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-12">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
