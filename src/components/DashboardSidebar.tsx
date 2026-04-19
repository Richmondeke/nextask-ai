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
    Bell,
    Cookie,
    Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const sidebarLinks = [
    { name: 'Explore', href: '/dashboard/explore', icon: Search },
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
    { name: 'Earnings', href: '/dashboard/earnings', icon: Wallet },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-20 h-screen bg-zinc-50 border-r border-zinc-200 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="p-4 flex justify-center">
                <Link href="/" className="group">
                    <div className="text-2xl font-bold tracking-tighter text-blue-600">
                        M
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-4 mt-4">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex flex-col items-center gap-1 group transition-colors duration-200 ${isActive
                                ? 'text-blue-600'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-600/10' : 'group-hover:bg-white/5'}`}>
                                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                            </div>
                            <span className="text-[10px] font-medium tracking-tight">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="p-4 flex flex-col items-center gap-6 mb-2">
                <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                    <Cookie size={20} strokeWidth={1.5} />
                </button>
                <div className="relative">
                    <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                        <Bell size={20} strokeWidth={1.5} />
                    </button>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
                </div>
                <button className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold hover:bg-blue-700 transition-colors">
                    R
                </button>
            </div>
        </div>
    );
}
