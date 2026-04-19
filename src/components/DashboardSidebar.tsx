'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Search,
    Users,
    Wallet,
    User,
    Bell,
    Cookie,
    Settings,
    X,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './ui/Logo';
import { auth, db } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
    { name: 'Explore', href: '/dashboard/explore', icon: Search },
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
    { name: 'Earnings', href: '/dashboard/earnings', icon: Wallet },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = React.useState<any>(null);
    const [profile, setProfile] = React.useState<any>(null);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
                if (profileDoc.exists()) {
                    setProfile(profileDoc.data());
                }
            } else {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <div className={`w-64 h-screen bg-white border-r border-zinc-200 flex flex-col fixed left-0 top-0 transition-transform duration-300 z-[70] 
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo & Close (Mobile) */}
                <div className="p-6 flex items-center justify-between">
                    <Logo />
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-zinc-600 lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.name}
                                id={`sidebar-link-${link.name.toLowerCase()}`}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                                    }`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-blue-600' : 'text-zinc-500 group-hover:text-zinc-700'} />
                                <span className="text-sm">{link.name}</span>
                            </Link>
                        );
                    })}

                    {/* Admin Link (Conditional) */}
                    {(profile?.role === 'admin' || profile?.role === 'superadmin') && (
                        <Link
                            href="/admin"
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group mt-8 border border-zinc-100 ${pathname.startsWith('/admin')
                                ? 'bg-zinc-900 text-white font-semibold'
                                : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
                                }`}
                        >
                            <Settings size={20} />
                            <span className="text-sm">Admin Dashboard</span>
                        </Link>
                    )}
                </nav>

                {/* User Section */}
                <div className="p-4 mt-auto border-t border-zinc-100 bg-zinc-50/50">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <button className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Cookie size={18} />
                        </button>
                        <div className="relative">
                            <button className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <Bell size={18} />
                            </button>
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-blue-200 uppercase">
                            {profile?.fullName?.[0] || user?.displayName?.[0] || user?.email?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 truncate">
                                {profile?.fullName || user?.displayName || 'User'}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
