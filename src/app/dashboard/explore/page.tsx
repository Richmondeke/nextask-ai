'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Search,
    MapPin,
    DollarSign,
    Clock,
    Filter,
    ChevronDown,
    Share2,
    Users
} from 'lucide-react';

const jobs = [
    {
        id: 1,
        title: 'Senior AI Research Engineer',
        company: 'Neural Labs',
        location: 'San Francisco (Remote)',
        salary: '$180k - $250k',
        type: 'Full-time',
        tags: ['PyTorch', 'LLMs'],
        posted: '2 days ago',
        isBestMatch: true
    },
    {
        id: 2,
        title: 'Frontend Engineer (AI Tools)',
        company: 'ScaleAI',
        location: 'New York (Hybrid)',
        salary: '$140k - $190k',
        type: 'Contract',
        tags: ['React', 'TS'],
        posted: '5 hours ago',
        isBestMatch: false
    },
    {
        id: 3,
        title: 'MLOps Architect',
        company: 'DataFlow',
        location: 'Remote',
        salary: '$160k - $220k',
        type: 'Full-time',
        tags: ['AWS', 'K8s'],
        posted: '1 day ago',
        isBestMatch: false
    }
];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-8">
            {/* Header & Social Proof */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Explore Roles</h1>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors">
                        <Share2 size={16} />
                        Refer & earn
                    </button>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-[8px] font-bold">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <span>1,499 Nexttaskers work at these companies</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 py-2">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search for job titles, roles or keywords"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-zinc-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
                        Best match
                        <ChevronDown size={16} />
                    </button>
                    <button className="p-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 gap-4">
                {jobs.map((job, index) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-blue-500/30 hover:shadow-sm transition-all duration-300 group"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 font-bold shrink-0">
                                    {job.company[0]}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                                            {job.title}
                                        </h3>
                                        {job.isBestMatch && (
                                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
                                                1-click apply
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                                        <span className="flex items-center gap-1.5 text-zinc-900 font-medium">
                                            $ {job.salary.replace('$', '')}
                                        </span>
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {job.posted}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded-md bg-zinc-50 text-zinc-500 text-[11px] font-medium border border-zinc-200/50">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/dashboard/applications/${job.id}`}
                                    className="px-6 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-bold hover:bg-zinc-50 transition-colors"
                                >
                                    Apply
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
