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
    LogOut,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const sidebarLinks = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Explore', href: '/dashboard/explore', icon: Search },
    { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
    { name: 'Earnings', href: '/dashboard/earnings', icon: Wallet },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 h-screen bg-black border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="p-8">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
                    Nextask<span className="text-blue-500">.ai</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600/10 text-blue-500'
                                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={20} className={isActive ? 'text-blue-500' : 'text-zinc-400 group-hover:text-white'} />
                                <span className="font-medium">{link.name}</span>
                            </div>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="w-1.5 h-1.5 rounded-full bg-blue-500"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">John Doe</p>
                        <p className="text-xs text-zinc-500 truncate">john@nextask.ai</p>
                    </div>
                    <LogOut size={18} className="text-zinc-500 group-hover:text-white" />
                </div>
            </div>
        </div>
    );
}
