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
    Briefcase,
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

const userLinks = [
    { name: 'Explore', href: '/dashboard/explore', icon: Search },
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Applications', href: '/dashboard/applications', icon: Briefcase },
    { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
    { name: 'Earnings', href: '/dashboard/earnings', icon: Wallet },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

const adminLinks = [
    { name: 'Admin Overview', href: '/admin', icon: Home },
    { name: 'Talent Pool', href: '/admin/users', icon: Users },
    { name: 'Job Manager', href: '/admin/jobs', icon: Search },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
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

            <div className={`w-64 h-screen bg-[#07080a] border-r border-white/[0.06] flex flex-col fixed left-0 top-0 transition-transform duration-300 z-[70] 
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo & Close (Mobile) */}
                <div className="p-6 flex items-center justify-between">
                    <Logo dark />
                    <button
                        onClick={onClose}
                        className="p-2 text-[#6a6b6c] hover:text-[#f9f9f9] lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                    {/* User Links Section */}
                    <div className="space-y-1">
                        <div className="px-3 mb-2">
                            <span className="text-[10px] font-bold text-[#6a6b6c] uppercase tracking-widest">Workspace</span>
                        </div>
                        {userLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.name}
                                    id={`sidebar-link-${link.name.toLowerCase()}`}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-[#ff6363]/10 text-[#ff6363] font-semibold'
                                        : 'text-[#9c9c9d] hover:bg-white/5 hover:text-[#f9f9f9]'
                                        }`}
                                >
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#ff6363]' : 'text-[#6a6b6c] group-hover:text-[#9c9c9d]'} />
                                    <span className="text-sm">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Admin Links Section */}
                    {(profile?.role === 'admin' || profile?.role === 'superadmin') && (
                        <div className="space-y-1 mt-8 pt-6 border-t border-white/[0.06]">
                            <div className="px-3 mb-2 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#6a6b6c] uppercase tracking-widest">Governance</span>
                                <span className="flex h-1.5 w-1.5 rounded-full bg-[#55b3ff] animate-pulse" />
                            </div>

                            {adminLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
                                const Icon = link.icon;

                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${isActive
                                            ? 'bg-white/10 text-white font-semibold shadow-mac'
                                            : 'text-[#9c9c9d] hover:bg-white/5 hover:text-[#f9f9f9]'
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-white' : 'text-[#6a6b6c] group-hover:text-[#9c9c9d]'} />
                                        <span className="text-sm">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </nav>

                {/* User Section */}
                <div className="p-4 mt-auto border-t border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <button className="p-2 text-[#6a6b6c] hover:text-[#55b3ff] hover:bg-[#55b3ff]/10 rounded-lg transition-all">
                            <Cookie size={18} />
                        </button>
                        <div className="relative">
                            <button className="p-2 text-[#6a6b6c] hover:text-[#55b3ff] hover:bg-[#55b3ff]/10 rounded-lg transition-all">
                                <Bell size={18} />
                            </button>
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#ff6363] rounded-full border border-[#07080a]" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-[#ff6363] flex items-center justify-center text-white text-xs font-bold shadow-mac uppercase">
                            {profile?.fullName?.[0] || user?.displayName?.[0] || user?.email?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#f9f9f9] truncate">
                                {profile?.fullName || user?.displayName || 'User'}
                            </p>
                            <p className="text-[11px] text-[#6a6b6c] truncate tracking-normal ">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-[#6a6b6c] hover:text-red-500 transition-colors"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
}
