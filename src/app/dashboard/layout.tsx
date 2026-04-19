'use client';

import React, { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Menu } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            {/* Mobile Header */}
            <header className="lg:hidden h-16 border-b border-zinc-100 px-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40">
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

            <main className="lg:pl-64 min-h-screen">
                <div className="p-6 md:p-12 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
