'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
    Menu,
    Loader2
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import Logo from '@/components/ui/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <header className="lg:hidden h-16 border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40">
                <Logo />
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-zinc-500 hover:text-zinc-900"
                >
                    <Menu size={24} />
                </button>
            </header>

            <DashboardSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <main className="flex-1 lg:pl-64">
                <div className="p-6 md:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
