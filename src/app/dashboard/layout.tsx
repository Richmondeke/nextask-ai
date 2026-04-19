import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <DashboardSidebar />
            <main className="pl-20 min-h-screen">
                <div className="p-12 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
