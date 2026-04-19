'use client';

import React from 'react';
import { Search, Plus, Filter, MoreVertical, Briefcase } from 'lucide-react';

export default function AdminJobsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Job Manager</h1>
                    <p className="text-zinc-500">Manage and monitor all job postings across the platform.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
                    <Plus size={20} />
                    <span>Post New Job</span>
                </button>
            </div>

            {/* Placeholder state */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Briefcase size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-zinc-900">No Jobs Found</h3>
                    <p className="text-zinc-500 max-w-sm">The job management system is being initialized. Check back soon to manage active listings.</p>
                </div>
            </div>
        </div>
    );
}
